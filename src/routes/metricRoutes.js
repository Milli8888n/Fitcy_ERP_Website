const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// PT routes for entering metrics
router.get('/pt/metrics', protect, restrictTo('PT'), metricController.getMyClientsForMetrics);
router.get('/pt/metrics/add/:clientId', protect, restrictTo('PT'), metricController.getAddMetricForm);
router.post('/pt/metrics/add/:clientId', protect, restrictTo('PT'), metricController.saveBodyMetric);

// Client route to view their progress
router.get('/client/progress', protect, restrictTo('Client'), metricController.getMyProgress);

module.exports = router;
