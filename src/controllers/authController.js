const User = require('../models/userModel');
const { hash } = require('../utils/encryption');

/**
 * Handle Login
 * - Validate Email/Password
 * - Set User Session
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error_msg', 'Vui lòng nhập đầy đủ Email và Mật khẩu');
            return res.redirect('/auth/login');
        }

        const user = await User.findOne({ emailHash: hash(email) }).select('+password');
        
        if (!user) {
            req.flash('error_msg', 'Email hoặc Mật khẩu không chính xác');
            return res.redirect('/auth/login');
        }

        // Check if user is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            req.flash('error_msg', `Tài khoản đã bị tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${minutesLeft} phút.`);
            return res.redirect('/auth/login');
        }
        
        const isPasswordCorrect = await user.correctPassword(password, user.password);

        if (!isPasswordCorrect) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                req.flash('error_msg', 'Nhập sai 5 lần. Tài khoản đã bị khóa 30 phút.');
            } else {
                req.flash('error_msg', `Email hoặc Mật khẩu không chính xác. Đã sai ${user.loginAttempts}/5 lần.`);
            }
            await user.save({ validateBeforeSave: false }); // Bypass validation like phone regex
            return res.redirect('/auth/login');
        }

        if (user.status !== 'Active') {
            req.flash('error_msg', 'Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động');
            return res.redirect('/auth/login');
        }

        // Reset login attempts on success
        if (user.loginAttempts > 0) {
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save({ validateBeforeSave: false });
        }

        // 4. Create Session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            branch: user.branch,
            avatar: user.avatar
        };
        console.log(`User ${user.email} logged in. Role: ${user.role}. Session ID: ${req.sessionID}`);

        // 5. Explicitly save session before redirecting (important for high-speed E2E tests)
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect('/auth/login');
            }
            if (['Admin', 'Manager', 'SA'].includes(user.role)) {
                return res.redirect('/admin');
            } else if (user.role === 'PT') {
                return res.redirect('/pt');
            } else {
                return res.redirect('/client');
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        req.flash('error_msg', 'Đã có lỗi xảy ra, vui lòng thử lại sau');
        return res.redirect('/auth/login');
    }
};

/**
 * Handle Logout
 * - Destroy Session
 */
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Logout Error:', err);
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};

/**
 * Get Profile
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).populate('branch');
        res.render('profile', { user });
    } catch (err) {
        res.status(500).render('error', { message: 'Không tìm thấy thông tin cá nhân' });
    }
};
