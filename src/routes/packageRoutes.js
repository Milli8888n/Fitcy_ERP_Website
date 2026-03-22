const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Bảo vệ toàn bộ Route bên dưới: Must Be Logged In + Must Be Admin/Manager/SA
router.use(protect);
router.use(restrictTo('Admin', 'Manager', 'SA'));

// Danh sách gói tập
router.get('/list', packageController.getPackageList);

// Form Tạo mới
router.get('/create', packageController.getCreateForm);
router.post('/store', packageController.storePackage);

// Form Sửa
router.get('/edit/:id', packageController.getEditForm);
router.post('/update/:id', packageController.updatePackage);

// Xóa (Phương thức POST vì dùng tag <form> trên EJS)
router.post('/delete/:id', packageController.deletePackage);

module.exports = router;
