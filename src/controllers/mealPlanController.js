const MealPlan = require('../models/mealPlanModel');
const Contract = require('../models/contractModel');
const User = require('../models/userModel');

/**
 * [PT/Trainer] List meal plans for their clients
 */
exports.getMyClientsMealPlans = async (req, res, next) => {
    try {
        const filter = {};
        if (req.session.user.role === 'PT') {
            filter.pt = req.session.user.id;
        }

        const mealPlans = await MealPlan.find(filter)
            .populate('client', 'name email avatar')
            .populate('contract', 'contractStatus')
            .sort({ createdAt: -1 });

        res.render('pt/meal-plans/list', { 
            mealPlans,
            activePage: 'meal-plans' 
        });
    } catch (err) {
        next(err);
    }
};

/**
 * [PT] Form to create meal plan for a client with active contract
 */
exports.getCreateForm = async (req, res, next) => {
    try {
        const contracts = await Contract.find({ 
            pt: req.session.user.id, 
            contractStatus: 'Active' 
        }).populate('client');

        res.render('pt/meal-plans/form', { 
            contracts,
            activePage: 'meal-plans'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * [PT] Save Meal Plan
 */
exports.saveMealPlan = async (req, res, next) => {
    try {
        const { contractId, goal, calories, protein, carbs, fat, mealsJson } = req.body;
        
        // Find contract to get client
        const contract = await Contract.findById(contractId);
        if (!contract) return next(new Error('Contract not found'));

        const parsedMeals = JSON.parse(mealsJson || '[]');

        await MealPlan.create({
            client: contract.client,
            pt: req.session.user.id,
            contract: contractId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
            goal,
            dailyCalories: Number(calories),
            macros: { protein, carbs, fat },
            meals: parsedMeals
        });

        req.flash('success_msg', 'Thiết lập thực đơn thành công cho hội viên!');
        res.redirect('/pt/meal-plans');
    } catch (err) {
        next(err);
    }
};
