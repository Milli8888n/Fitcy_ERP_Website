const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);

// PT specific routes
router.get('/', restrictTo('PT', 'Manager', 'Admin', 'SA'), mealPlanController.getMyClientsMealPlans);
router.get('/create', restrictTo('PT'), mealPlanController.getCreateForm);
router.post('/store', restrictTo('PT'), mealPlanController.saveMealPlan);

module.exports = router;
