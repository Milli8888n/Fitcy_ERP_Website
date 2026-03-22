const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Chỉ có Ban Giám Đốc và Bộ Phận Sales mới vào được Module Hợp Đồng
router.use(protect);
router.use(restrictTo('SA', 'Admin', 'Manager', 'Sales'));

// Danh sách Hợp đồng / Doanh thu
router.get('/list', contractController.getContractList);

// Form Tạo mới Hợp đồng
router.get('/create', contractController.getCreateForm);
router.post('/store', contractController.storeContract);

// Form Sửa (Cập nhật số tiền thanh toán, Payment Method)
router.get('/edit/:id', contractController.getEditForm);
router.post('/update/:id', contractController.updateContract);

// Xóa (POST) - Ràng buộc xoá trong Controller (Chỉ SA mới xoá được HĐ đã đóng tiền)
router.post('/delete/:id', restrictTo('SA', 'Admin'), contractController.deleteContract);

// Xuất PDF
router.get('/download/:id', contractController.downloadContract);

// Bảo lưu và Kích hoạt lại
router.post('/pause/:id', contractController.pauseContract);
router.post('/unpause/:id', contractController.unpauseContract);

// Quản lý Yêu cầu Bảo lưu (Pause Requests from Clients)
router.get('/requests', restrictTo('SA', 'Admin', 'Manager', 'CEO'), contractController.getPauseRequests);
router.post('/requests/approve/:id', restrictTo('SA', 'Admin', 'Manager', 'CEO'), contractController.approvePauseRequest);
router.post('/requests/reject/:id', restrictTo('SA', 'Admin', 'Manager', 'CEO'), contractController.rejectPauseRequest);

module.exports = router;
