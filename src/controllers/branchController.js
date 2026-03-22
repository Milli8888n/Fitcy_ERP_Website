const Branch = require('../models/branchModel');
const User = require('../models/userModel');

// 1. Hiển thị danh sách
exports.getBranchList = async (req, res, next) => {
    try {
        const branches = await Branch.find().populate('manager', 'name email').sort({ createdAt: -1 });
        res.render('admin/branches/list', { branches });
    } catch (err) {
        next(err);
    }
};

// 2. Form Tạo mới
exports.getCreateForm = async (req, res, next) => {
    try {
        const managers = await User.find({ role: 'Manager', status: 'Active' });
        res.render('admin/branches/form', { 
            isEdit: false, 
            branch: new Branch(),
            managers 
        });
    } catch (err) {
        next(err);
    }
};

// 3. Xử lý Thêm mới
exports.storeBranch = async (req, res, next) => {
    try {
        const { name } = req.body;
        
        // Kiểm tra độc quyền tên Chi nhánh
        const existing = await Branch.findOne({ name });
        if (existing) {
            req.flash('error_msg', 'Tên chi nhánh đã tồn tại!');
            return res.redirect('/admin/branches/create');
        }

        await Branch.create(req.body);
        req.flash('success_msg', 'Tạo chi nhánh mới thành công!');
        res.redirect('/admin/branches/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect('/admin/branches/create');
        }
        next(err);
    }
};

// 4. Form Chỉnh sửa
exports.getEditForm = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            req.flash('error_msg', 'Không tìm thấy chi nhánh này!');
            return res.redirect('/admin/branches/list');
        }
        const managers = await User.find({ role: 'Manager', status: 'Active' });
        res.render('admin/branches/form', { isEdit: true, branch, managers });
    } catch (err) {
        next(err);
    }
};

// 5. Xử lý Cập nhật
exports.updateBranch = async (req, res, next) => {
    try {
        const { name } = req.body;
        const branchId = req.params.id;

        const existing = await Branch.findOne({ name, _id: { $ne: branchId } });
        if (existing) {
            req.flash('error_msg', 'Tên chi nhánh bị trùng lặp với cơ sở khác!');
            return res.redirect(`/admin/branches/edit/${branchId}`);
        }

        const updated = await Branch.findByIdAndUpdate(
            branchId, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            req.flash('error_msg', 'Cập nhật thất bại. Không tìm thấy chi nhánh!');
            return res.redirect('/admin/branches/list');
        }

        req.flash('success_msg', 'Cập nhật thông tin chi nhánh thành công!');
        res.redirect('/admin/branches/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect(`/admin/branches/edit/${req.params.id}`);
        }
        next(err);
    }
};

// 6. Xử lý xóa
exports.deleteBranch = async (req, res, next) => {
    try {
        // Validation logic: Cannot delete a branch that has active Staff/Contracts
        const hasStaffs = await User.findOne({ branch: req.params.id, status: 'Active' });
        if (hasStaffs) {
            req.flash('error_msg', 'Không thể xóa chi nhánh có nhân sự đang hoạt động. Vui lòng thuyên chuyển hoặc vô hiệu hóa nhân sự trước!');
            return res.redirect('/admin/branches/list');
        }

        const deleted = await Branch.findByIdAndDelete(req.params.id);
        if (!deleted) {
            req.flash('error_msg', 'Không tìm thấy chi nhánh!');
        } else {
            req.flash('success_msg', 'Xóa chi nhánh thành công!');
        }
        res.redirect('/admin/branches/list');
    } catch (err) {
        next(err);
    }
};
