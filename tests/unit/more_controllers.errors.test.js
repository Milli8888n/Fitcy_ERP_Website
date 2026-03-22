const couponController = require('../../src/controllers/couponController');
const expenseController = require('../../src/controllers/expenseController');
const packageController = require('../../src/controllers/packageController');
const Coupon = require('../../src/models/couponModel');
const Expense = require('../../src/models/expenseModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const User = require('../../src/models/userModel');
const Contract = require('../../src/models/contractModel');
const Payroll = require('../../src/models/payrollModel');
const payrollController = require('../../src/controllers/payrollController');

describe('More Controller Error Coverage', () => {
    let req, res, next;
    beforeEach(() => {
        req = { params: {}, body: {}, flash: jest.fn(), session: { user: { id: 'u1' } } };
        res = { render: jest.fn(), redirect: jest.fn(), status: jest.fn().mockReturnThis() };
        next = jest.fn();
    });

    it('getCouponList error', async () => {
        jest.spyOn(Coupon, 'find').mockImplementation(() => ({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockRejectedValue(new Error('err')) }));
        await couponController.getCouponList(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('storeCoupon catch error', async () => {
        jest.spyOn(Coupon, 'create').mockRejectedValue(new Error('Validation fail'));
        await couponController.storeCoupon(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/admin/coupons/create');
    });

    it('deleteCoupon error', async () => {
        jest.spyOn(Coupon, 'findByIdAndDelete').mockRejectedValue(new Error('err'));
        await couponController.deleteCoupon(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getAllExpenses error', async () => {
        jest.spyOn(Expense, 'find').mockImplementation(() => ({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockRejectedValue(new Error('err')) }));
        await expenseController.getAllExpenses(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('saveExpense error', async () => {
        jest.spyOn(Expense, 'create').mockRejectedValue(new Error('fail'));
        await expenseController.saveExpense(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getPackageList error', async () => {
        jest.spyOn(ServicePackage, 'find').mockImplementation(() => ({ sort: jest.fn().mockRejectedValue(new Error('err')) }));
        await packageController.getPackageList(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getPayrollSummary for Sales/Manager', async () => {
        jest.spyOn(User, 'find').mockResolvedValue([{ _id: 'u2', role: 'Sales', baseSalary: 6000000, status: 'Active' }]);
        jest.spyOn(Contract, 'find').mockResolvedValue([{ totalAmount: 1000000 }]);
        jest.spyOn(Payroll, 'findOne').mockResolvedValue(null);
        await payrollController.getPayrollSummary(req, res, next);
        expect(res.render).toHaveBeenCalledWith('admin/payroll/summary', expect.any(Object));
    });

    it('getPayrollSummary error', async () => {
        jest.spyOn(User, 'find').mockRejectedValue(new Error('err'));
        await payrollController.getPayrollSummary(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('finalizePayroll catch error', async () => {
        jest.spyOn(User, 'findById').mockRejectedValue(new Error('Staff not found'));
        await payrollController.finalizePayroll(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/admin/payroll/summary');
    });

    it('finalizePayroll existing Paid', async () => {
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'u1', name: 'N' });
        jest.spyOn(Payroll, 'findOne').mockResolvedValue({ status: 'Paid' });
        await payrollController.finalizePayroll(req, res, next);
        expect(req.flash).toHaveBeenCalledWith('error_msg', 'Lương tháng này đã được thanh toán, không thể chỉnh sửa.');
    });
});
