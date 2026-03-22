const Expense = require('../models/expenseModel');
const Branch = require('../models/branchModel');

/**
 * [Admin/Manager] Xem danh sách chi phí
 */
exports.getAllExpenses = async (req, res, next) => {
    try {
        const filter = {};
        if (req.session.user.role === 'Manager') {
            filter.branch = req.session.user.branch;
        }

        const expenses = await Expense.find(filter)
            .populate('branch', 'name')
            .populate('recordedBy', 'name')
            .sort({ date: -1 });

        const branches = await Branch.find({ status: 'Open' });

        res.render('admin/expenses/list', { 
            expenses, 
            branches,
            activePage: 'expenses' 
        });
    } catch (err) {
        next(err);
    }
};

/**
 * [Admin/Manager] Lưu chi phí mới
 */
exports.saveExpense = async (req, res, next) => {
    try {
        const { branchId, category, amount, date, description, invoiceImage } = req.body;

        await Expense.create({
            branch: branchId || req.session.user.branch,
            category,
            amount: Number(amount),
            date: date || new Date(),
            description,
            invoiceImage,
            recordedBy: req.session.user.id
        });

        req.flash('success_msg', 'Đã ghi nhận khoản chi phí mới thành công.');
        res.redirect('/admin/expenses');
    } catch (err) {
        next(err);
    }
};

/**
 * [SA/Admin] Xóa chi phí
 */
exports.deleteExpense = async (req, res, next) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Đã xóa khoản chi phí thành công.');
        res.redirect('/admin/expenses');
    } catch (err) {
        next(err);
    }
};
