const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Chỉ có Ban Giám Đốc (SA, Admin, Manager) mới có quyền quản lý nhân sự
router.use(protect);
router.use(restrictTo('SA', 'Admin', 'Manager'));

// Danh sách Nhân viên (Loại Client)
router.get('/list', userController.getUserList);

// Form Tạo mới
router.get('/create', userController.getCreateForm);
router.post('/store', userController.storeUser);

// Form Sửa
router.get('/edit/:id', userController.getEditForm);
router.post('/update/:id', userController.updateUser);

// Xóa (POST) - Chỉ dành riêng cho Super Admin và Admin
router.post('/delete/:id', restrictTo('SA', 'Admin'), userController.deleteUser);

module.exports = router;
