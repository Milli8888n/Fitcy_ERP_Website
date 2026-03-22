const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);

// Admin/Sales specific routes
router.get('/', restrictTo('Sales', 'Manager', 'Admin', 'SA'), couponController.getCouponList);
router.get('/create', restrictTo('Sales', 'Manager', 'Admin', 'SA'), couponController.getCreateForm);
router.post('/store', restrictTo('Sales', 'Manager', 'Admin', 'SA'), couponController.storeCoupon);
router.get('/delete/:id', restrictTo('Admin', 'SA'), couponController.deleteCoupon);

module.exports = router;
