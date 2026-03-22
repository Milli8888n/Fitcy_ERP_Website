const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const { errorHandler } = require('./middlewares/errorHandler');
const homeController = require('./controllers/homeController');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const branchRoutes = require('./routes/branchRoutes');
const userRoutes = require('./routes/userRoutes');
const contractRoutes = require('./routes/contractRoutes');
const ptRoutes = require('./routes/ptRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const clientRoutes = require('./routes/clientRoutes');
const leadRoutes = require('./routes/leadRoutes');
const metricRoutes = require('./routes/metricRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const couponRoutes = require('./routes/couponRoutes');
const { protect, restrictTo } = require('./middlewares/authMiddleware');
const { fetchNotifications } = require('./middlewares/notificationMiddleware');

const app = express();

// 1. Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Cấu hình Session (Cần thiết cho Flash messages)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fitcity_fms_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Middleware để truyền Flash messages vào tất cả các View
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null; // Share user payload to EJS templates (e.g. Avatar/Name)
    next();
});

// Middleware lấy Thông báo
app.use(fetchNotifications);

// 3. Routes
app.use('/auth', authRoutes);
app.use('/admin/packages', packageRoutes);
app.use('/admin/branches', branchRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/contracts', contractRoutes);
app.use('/admin/payroll', payrollRoutes);
app.use('/pt', ptRoutes);
app.use('/client', clientRoutes);
app.use('/', leadRoutes);
app.use('/', metricRoutes);
app.use('/admin/expenses', expenseRoutes);
app.use('/pt/meal-plans', mealPlanRoutes);
app.use('/admin/coupons', couponRoutes);

// FMS Protected Routes (with RBAC)
app.get('/admin', protect, restrictTo('Admin', 'Manager', 'SA'), homeController.getAdminDashboard);
app.get('/admin/export-report', protect, restrictTo('Admin', 'Manager', 'SA'), homeController.exportQuarterlyReport);
app.get('/client', protect, restrictTo('Client'), homeController.getClientDashboard);
app.get('/client/nutrition', protect, restrictTo('Client'), homeController.getClientNutrition);
app.get('/pt', protect, restrictTo('PT'), homeController.getPtDashboard);
app.get('/pt/dashboard', (req, res) => res.redirect('/pt'));

// Error Handler
app.use(errorHandler);

module.exports = app;