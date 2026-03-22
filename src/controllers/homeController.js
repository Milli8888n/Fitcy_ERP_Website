const Contract = require('../models/contractModel');
const WorkoutSession = require('../models/workoutSessionModel');
const User = require('../models/userModel');
const Payroll = require('../models/payrollModel');
const Expense = require('../models/expenseModel');
const MealPlan = require('../models/mealPlanModel');

exports.getAdminDashboard = async (req, res, next) => {
    try {
        // 1. Total Revenue
        const totalRevenueResult = await Contract.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
        const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

        // 2. Total Expenses
        const totalExpensesResult = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalExpenses = totalExpensesResult[0] ? totalExpensesResult[0].total : 0;

        // 3. Profit
        const netProfit = totalRevenue - totalExpenses;

        // 4. Pending Receivables
        const pendingResult = await Contract.aggregate([
            { $project: { pending: { $subtract: ['$totalAmount', '$paidAmount'] } } },
            { $group: { _id: null, totalPending: { $sum: '$pending' } } }
        ]);
        const pendingReceivables = pendingResult[0] ? pendingResult[0].totalPending : 0;

        // 3. Active Members
        const activeMembers = await User.countDocuments({ role: 'Client', status: 'Active' });
        
        // 4. Sessions Today
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const sessionsToday = await WorkoutSession.countDocuments({
            scheduledTime: { $gte: today, $lt: tomorrow }
        });

        // 5. Recent pending contracts table
        const pendingContracts = await Contract.find({ paymentStatus: { $ne: 'Paid' } })
            .populate('client', 'name avatar')
            .populate('pt', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // 6. PT Performance Leaderboard (Top 5 PTs by sessions this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);

        const ptPerformance = await WorkoutSession.aggregate([
            { $match: { scheduledTime: { $gte: startOfMonth }, status: 'Completed' } },
            { $group: { _id: '$pt', sessionCount: { $sum: 1 } } },
            { $sort: { sessionCount: -1 } },
            { $limit: 4 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'ptInfo' } },
            { $unwind: '$ptInfo' }
        ]);

        res.render('admin/dashboard', {
            totalRevenue,
            totalExpenses,
            netProfit,
            pendingReceivables,
            activeMembers,
            sessionsToday,
            pendingContracts,
            ptPerformance,
            activePage: 'dashboard'
        });
    } catch (error) {
        next(error);
    }
};

// Logic was moved to the bottom of the file with updated calculations

exports.getPtDashboard = async (req, res, next) => {
    try {
        const ptId = req.session.user.id;
        
        // 1. Get Today's roster
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const roster = await WorkoutSession.find({
            pt: ptId,
            scheduledTime: { $gte: today, $lt: tomorrow },
            status: { $in: ['Scheduled', 'In_Progress'] }
        }).populate('client', 'name avatar');

        // 2. Estimate Commission (Mock logic: 100k per completed session this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        
        const ptUser = await User.findById(ptId);
        const commissionRate = ptUser.ptCommissionPerSession || 150000;

        const completedSessions = await WorkoutSession.countDocuments({
            pt: ptId,
            status: 'Completed',
            scheduledTime: { $gte: startOfMonth }
        });

        res.render('pt/dashboard', {
            estimatedCommission: completedSessions * commissionRate,
            targetCommission: 15000000,
            rosterCount: roster.length,
            roster
        });
    } catch (error) {
        next(error);
    }
};

exports.getClientDashboard = async (req, res, next) => {
    try {
        const clientId = req.session.user.id;
        
        // 1. Get Active Contract
        const contract = await Contract.findOne({ client: clientId, contractStatus: 'Active' })
            .populate('servicePackage')
            .sort({ createdAt: -1 });

        // 2. Count sessions
        const sessionsCompleted = await WorkoutSession.countDocuments({
            client: clientId,
            status: 'Completed'
        });

        // 3. Find pending confirmations
        const pendingConfirmation = await WorkoutSession.findOne({
            client: clientId,
            status: 'Completed',
            'clientConfirmation.isConfirmed': false
        }).populate('pt', 'name avatar');

        // 4. Get current Meal Plan
        const mealPlan = await MealPlan.findOne({ client: clientId, active: true }).sort({ createdAt: -1 });
        
        res.render('client/dashboard', {
            sessionsCompleted,
            totalSessions: contract ? contract.totalSessions : 0,
            packageName: contract && contract.servicePackage ? contract.servicePackage.name : "Chưa có gói tập",
            contract,
            pendingConfirmation,
            mealPlan
        });
    } catch (error) {
        next(error);
    }
};

exports.getClientNutrition = async (req, res, next) => {
    try {
        const clientId = req.session.user.id;
        const mealPlan = await MealPlan.findOne({ client: clientId, active: true })
            .populate('pt', 'name avatar')
            .sort({ createdAt: -1 });

        res.render('client/nutrition', { mealPlan });
    } catch (error) {
        next(error);
    }
};
const reportService = require('../services/reportService');
const path = require('path');
const fs = require('fs');

exports.exportQuarterlyReport = async (req, res, next) => {
    try {
        const { year = new Date().getFullYear(), quarter = 1 } = req.query;
        const workbook = await reportService.generateQuarterlyReport(Number(year), Number(quarter));

        const fileName = `Financial_Report_Q${quarter}_${year}.xlsx`;
        const tempPath = path.join(__dirname, '../../tmp', fileName);

        if (!fs.existsSync(path.join(__dirname, '../../tmp'))) {
            fs.mkdirSync(path.join(__dirname, '../../tmp'));
        }

        await workbook.xlsx.writeFile(tempPath);

        res.download(tempPath, fileName, (err) => {
            if (err) next(err);
            try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch(e) {}
        });
    } catch (err) {
        next(err);
    }
};
