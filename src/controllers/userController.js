const User = require('../models/userModel');
const Branch = require('../models/branchModel');

// 1. Hiển thị danh sách nhân sự (Staff)
exports.getUserList = async (req, res, next) => {
    try {
        // Lấy tất cả trừ Client (Chỉ lọc nhân sự nội bộ)
        const filters = { role: { $ne: 'Client' } }; 
        const users = await User.find(filters).populate('branch', 'name').sort({ createdAt: -1 });
        res.render('admin/users/list', { users });
    } catch (err) {
        next(err);
    }
};

// 2. Form Tạo mới
exports.getCreateForm = async (req, res, next) => {
    try {
        const branches = await Branch.find();
        res.render('admin/users/form', { 
            isEdit: false, 
            userData: new User(), // 'user' is already used by res.locals.user in app.js
            branches 
        });
    } catch (err) {
        next(err);
    }
};

// 3. Xử lý Thêm mới
exports.storeUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Kiểm tra trùng email
        const existing = await User.findOne({ email });
        if (existing) {
            req.flash('error_msg', 'Email này đã được sử dụng!');
            return res.redirect('/admin/users/create');
        }

        // Tạo tài khoản (Model gài sẵn bcrypt pre-save cho field password)
        await User.create(req.body);
        req.flash('success_msg', 'Tạo tài khoản nhân viên mới thành công!');
        res.redirect('/admin/users/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect('/admin/users/create');
        }
        next(err);
    }
};

// 4. Form Chỉnh sửa
exports.getEditForm = async (req, res, next) => {
    try {
        const userData = await User.findById(req.params.id);
        if (!userData) {
            req.flash('error_msg', 'Không tìm thấy nhân viên này!');
            return res.redirect('/admin/users/list');
        }
        const branches = await Branch.find();
        res.render('admin/users/form', { isEdit: true, userData, branches });
    } catch (err) {
        next(err);
    }
};

// 5. Xử lý Cập nhật
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        // Nếu admin không điền mật khẩu mới, ta bỏ field password ra khỏi update object
        const updateData = { ...req.body };
        if (!updateData.password || updateData.password.trim() === '') {
            delete updateData.password;
        }

        // Email check unique exception cho user hiện tại
        if (updateData.email) {
            const existing = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
            if (existing) {
                req.flash('error_msg', 'Email cập nhật bị trùng lặp với người khác!');
                return res.redirect(`/admin/users/edit/${userId}`);
            }
        }

        const updatedUser = await User.findById(userId);
        if (!updatedUser) {
            req.flash('error_msg', 'Cập nhật thất bại. Không tìm thấy tài khoản!');
            return res.redirect('/admin/users/list');
        }

        // Apply fields and trigger 'save' for pre-save hook (tốt cho Hash Password)
        Object.keys(updateData).forEach(key => {
            updatedUser[key] = updateData[key];
        });
        
        await updatedUser.save({ runValidators: true });

        req.flash('success_msg', 'Cập nhật thông tin Hồ sơ Nhân sự thành công!');
        res.redirect('/admin/users/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect(`/admin/users/edit/${req.params.id}`);
        }
        next(err);
    }
};

// 6. Xử lý xóa
exports.deleteUser = async (req, res, next) => {
    try {
        // To-do logic: Có thể soft-delete hoặc khoá tài khoản thay vì Hard Delete nếu dính tới Payroll
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            req.flash('error_msg', 'Không tìm thấy tài khoản nhân viên!');
        } else {
            req.flash('success_msg', 'Xóa tài khoản nhân viên thành công!');
        }
        res.redirect('/admin/users/list');
    } catch (err) {
        next(err);
    }
};
