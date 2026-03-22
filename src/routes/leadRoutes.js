const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public routes (for Landing Page)
router.get('/', leadController.getLandingPage);
router.post('/register-lead', leadController.registerLead);

// Admin-only routes (for Leads management)
router.get('/admin/leads', protect, restrictTo('Admin', 'Manager', 'SA', 'Marketing'), leadController.getAllLeads);
router.get('/admin/leads/export', protect, restrictTo('Admin', 'Manager', 'SA', 'Marketing'), leadController.exportLeadsExcel);

module.exports = router;
