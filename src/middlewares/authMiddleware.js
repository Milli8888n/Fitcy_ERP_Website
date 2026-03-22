exports.protect = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).render('error', {
                message: 'Bạn không có quyền truy cập vào chức năng này.'
            });
        }
        next();
    };
};
