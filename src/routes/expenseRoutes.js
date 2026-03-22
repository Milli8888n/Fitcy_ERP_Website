const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('SA', 'Admin', 'Manager', 'Accountant'));

// [GET] Xem danh sách chi phí
router.get('/', expenseController.getAllExpenses);

// [POST] Thêm khoản chi mới
router.post('/store', expenseController.saveExpense);

// [DELETE] Xóa khoản chi (Chỉ SA, Admin)
router.post('/delete/:id', restrictTo('SA', 'Admin'), expenseController.deleteExpense);

module.exports = router;
