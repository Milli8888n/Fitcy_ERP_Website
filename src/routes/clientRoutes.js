const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Chỉ hội viên mới được thực hiện các action này
router.use(protect);
router.use(restrictTo('Client'));

// POST /client/sessions/confirm/:id
router.post('/sessions/confirm/:id', clientController.confirmSession);

// POST /client/contracts/pause (Xin bảo lưu)
router.post('/contracts/pause', clientController.requestPause);

// GET /client/workouts (Thư viện bài tập/Lịch tập)
router.get('/workouts', clientController.getWorkouts);

module.exports = router;
