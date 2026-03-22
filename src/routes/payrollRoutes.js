const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// RBAC: Chỉ Admin, Manager, SA mới được xem lương và thưởng của nhân sự
router.use(protect);
router.use(restrictTo('Admin', 'Manager', 'SA'));

// GET /admin/payroll/summary
router.get('/summary', payrollController.getPayrollSummary);

// GET /admin/payroll/export-csv
router.get('/export-csv', payrollController.exportPayrollCSV);

// POST /admin/payroll/approve
router.post('/approve', payrollController.finalizePayroll);

module.exports = router;
