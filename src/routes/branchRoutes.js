const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Bảo vệ toàn bộ Route: Must Be Logged In + Must Be SA, Admin, Manager
router.use(protect);
router.use(restrictTo('SA', 'Admin', 'Manager'));

// Danh sách chi nhánh
router.get('/list', branchController.getBranchList);

// Form Tạo mới
router.get('/create', branchController.getCreateForm);
router.post('/store', branchController.storeBranch);

// Form Sửa
router.get('/edit/:id', branchController.getEditForm);
router.post('/update/:id', branchController.updateBranch);

// Xóa (POST from forms)
router.post('/delete/:id', restrictTo('SA', 'Admin'), branchController.deleteBranch); // Chỉ SA/Admin mới được Xoá

module.exports = router;
