const express = require('express');
const router = express.Router();
const ptController = require('../controllers/ptController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// PT-Specific Actions
router.use(protect);
router.use(restrictTo('PT', 'Manager', 'SA'));

// POST /pt/sessions/check-in/:id
router.post('/sessions/check-in/:id', ptController.checkInSession);

// POST /pt/sessions/check-out/:id
router.post('/sessions/check-out/:id', ptController.checkOutSession);

module.exports = router;
