const Coupon = require('../models/couponModel');
const User = require('../models/userModel');

/**
 * [Admin/Sales] List Coupons
 */
exports.getCouponList = async (req, res, next) => {
    try {
        const coupons = await Coupon.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.render('admin/coupons/list', { 
            coupons,
            activePage: 'coupons'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * [Admin/Sales] Form to Create Coupon
 */
exports.getCreateForm = async (req, res, next) => {
    res.render('admin/coupons/form', { 
        isEdit: false,
        coupon: new Coupon(),
        activePage: 'coupons'
    });
};

/**
 * Store Coupon
 */
exports.storeCoupon = async (req, res, next) => {
    try {
        const { code, type, value, maxDiscount, endDate, usageLimit } = req.body;

        await Coupon.create({
            code: code.toUpperCase(),
            type,
            value: Number(value),
            maxDiscount: Number(maxDiscount) || 0,
            endDate,
            usageLimit: Number(usageLimit) || 100,
            createdBy: req.session.user.id
        });

        req.flash('success_msg', 'Tạo mã giảm giá thành công!');
        res.redirect('/admin/coupons');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/coupons/create');
    }
};

/**
 * Delete/Deactivate Coupon
 */
exports.deleteCoupon = async (req, res, next) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Đã xoá mã giảm giá thành công!');
        res.redirect('/admin/coupons');
    } catch (err) {
        next(err);
    }
};
