const User = require('../models/userModel');
const Contract = require('../models/contractModel');
const WorkoutSession = require('../models/workoutSessionModel');
const Payroll = require('../models/payrollModel');
const payrollService = require('../services/payrollService');

/**
 * Hiển thị tổng quan lương tháng hiện tại của toàn bộ nhân viên
 */
exports.getPayrollSummary = async (req, res, next) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // 1. Lấy danh sách nhân viên có thể có lương (Sales, PT, Manager)
        const staffList = await User.find({ 
            role: { $in: ['Sales', 'PT', 'Manager'] }, 
            status: 'Active' 
        });

        // 2. Tính toán hoa hồng dự kiến cho từng người
        const payrollData = await Promise.all(staffList.map(async (staff) => {
            let commission = 0;
            let detailCount = 0;

            if (staff.role === 'PT') {
                // Đếm số buổi hoàn thành trong tháng
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59);
                
                const sessions = await WorkoutSession.find({
                    pt: staff._id,
                    status: 'Completed',
                    'clientConfirmation.isConfirmed': true,
                    scheduledTime: { $gte: startOfMonth, $lte: endOfMonth }
                });
                
                // Use Tiered logic via payrollService
                commission = payrollService.calculatePTCommission(sessions);
                detailCount = sessions.length;
            } else if (staff.role === 'Sales' || staff.role === 'Manager') {
                // ... same logic for contracts filter
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59);

                const contracts = await Contract.find({
                    sales: staff._id,
                    paymentStatus: 'Paid',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });

                const rate = staff.salesCommissionRate || 5;
                commission = Math.round(contracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0) * (rate / 100));
                detailCount = contracts.length;
            }

            // Check if record exists
            const existingPayroll = await Payroll.findOne({ staff: staff._id, month, year });

            return {
                staff,
                commission,
                detailCount,
                existingPayroll,
                totalEstimate: (staff.baseSalary || 5000000) + commission
            };
        }));

        res.render('admin/payroll/summary', { 
            payrollData, 
            month, 
            year,
            activePage: 'payroll'
        });
    } catch (err) {
        next(err);
    }
};

exports.finalizePayroll = async (req, res, next) => {
    try {
        const { staffId, month, year, commission, totalSalary } = req.body;

        const staff = await User.findById(staffId);
        if (!staff) throw new Error('Nhân viên không tồn tại');

        // Check if already finalized/paid
        const existing = await Payroll.findOne({ staff: staffId, month, year });
        if (existing && existing.status === 'Paid') {
            req.flash('error_msg', 'Lương tháng này đã được thanh toán, không thể chỉnh sửa.');
            return res.redirect('/admin/payroll/summary');
        }

        await Payroll.findOneAndUpdate(
            { staff: staffId, month, year },
            { 
                commission: Number(commission), 
                totalSalary: Number(totalSalary), 
                status: 'Approved',
                baseSalary: staff.baseSalary || 5000000 
            },
            { upsert: true, new: true }
        );

        req.flash('success_msg', `Đã chốt lương thành công cho ${staff.name}.`);
        res.redirect('/admin/payroll/summary');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/payroll/summary');
    }
};

/**
 * Xuất báo cáo lương CSV cho tháng hiện tại
 */
exports.exportPayrollCSV = async (req, res, next) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const staffList = await User.find({ 
            role: { $in: ['Sales', 'PT', 'Manager'] }, 
            status: 'Active' 
        });

        const payrollData = await Promise.all(staffList.map(async (staff) => {
            let commission = 0;
            let detailCount = 0;

            if (staff.role === 'PT') {
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59);
                const sessions = await WorkoutSession.find({
                    pt: staff._id,
                    status: 'Completed',
                    'clientConfirmation.isConfirmed': true,
                    scheduledTime: { $gte: startOfMonth, $lte: endOfMonth }
                });
                commission = payrollService.calculatePTCommission(sessions);
                detailCount = sessions.length;
            } else if (staff.role === 'Sales' || staff.role === 'Manager') {
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59);
                const contracts = await Contract.find({
                    sales: staff._id,
                    paymentStatus: 'Paid',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });
                const rate = staff.salesCommissionRate || 5;
                commission = Math.round(contracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0) * (rate / 100));
                detailCount = contracts.length;
            }

            const existingPayroll = await Payroll.findOne({ staff: staff._id, month, year });
            const roleMap = { 'PT': 'Huấn luyện viên', 'Sales': 'Kinh doanh', 'Manager': 'Quản lý' };
            const statusMap = { 'Approved': 'Đã phê duyệt', 'Paid': 'Đã thanh toán', 'Draft': 'Bản nháp' };

            return {
                name: staff.name,
                role: roleMap[staff.role] || staff.role,
                baseSalary: staff.baseSalary || 5000000,
                detailCount,
                commission,
                totalEstimate: (staff.baseSalary || 5000000) + commission,
                status: existingPayroll ? (statusMap[existingPayroll.status] || existingPayroll.status) : 'Bản nháp'
            };
        }));

        // Build CSV with UTF-8 BOM
        const BOM = '\uFEFF';
        const header = 'STT,Nhân viên,Vai trò,Lương cứng,Chỉ số hiệu suất,Hoa hồng,Thực nhận dự kiến,Trạng thái';
        const rows = payrollData.map((p, i) => 
            `${i + 1},"${p.name}","${p.role}",${p.baseSalary},${p.detailCount},${p.commission},${p.totalEstimate},"${p.status}"`
        );
        const csv = BOM + header + '\n' + rows.join('\n');

        const fileName = `Payroll_T${month}_${year}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
};
