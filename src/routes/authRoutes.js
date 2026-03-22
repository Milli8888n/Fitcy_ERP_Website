const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes (GET for rendering views, POST for data submission)
router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);

// Protected Routes
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
