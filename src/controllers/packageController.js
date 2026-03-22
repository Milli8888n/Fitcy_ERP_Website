const ServicePackage = require('../models/servicePackageModel');

// 1. Hiển thị danh sách
exports.getPackageList = async (req, res, next) => {
    try {
        const packages = await ServicePackage.find().sort({ createdAt: -1 });
        res.render('admin/packages/list', { packages });
    } catch (err) {
        next(err);
    }
};

// 2. Hiển thị form Tạo mới
exports.getCreateForm = (req, res) => {
    res.render('admin/packages/form', { 
        isEdit: false, 
        pkg: new ServicePackage() 
    });
};

// 3. Xử lý Thêm mới
exports.storePackage = async (req, res, next) => {
    try {
        await ServicePackage.create(req.body);
        req.flash('success_msg', 'Tạo gói tập mới thành công!');
        res.redirect('/admin/packages/list');
    } catch (err) {
        // Validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect('/admin/packages/create');
        }
        next(err);
    }
};

// 4. Hiển thị form Chỉnh sửa
exports.getEditForm = async (req, res, next) => {
    try {
        const pkg = await ServicePackage.findById(req.params.id);
        if (!pkg) {
            req.flash('error_msg', 'Không tìm thấy gói tập này!');
            return res.redirect('/admin/packages/list');
        }
        res.render('admin/packages/form', { isEdit: true, pkg });
    } catch (err) {
        next(err);
    }
};

// 5. Xử lý Cập nhật
exports.updatePackage = async (req, res, next) => {
    try {
        const updated = await ServicePackage.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updated) {
            req.flash('error_msg', 'Chỉnh sửa thất bại! Không tìm thấy gói tập.');
            return res.redirect('/admin/packages/list');
        }
        req.flash('success_msg', 'Cập nhật gói tập thành công!');
        res.redirect('/admin/packages/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect(`/admin/packages/edit/${req.params.id}`);
        }
        next(err);
    }
};

// 6. Xử lý Xóa
exports.deletePackage = async (req, res, next) => {
    try {
        const deleted = await ServicePackage.findByIdAndDelete(req.params.id);
        if (!deleted) {
            req.flash('error_msg', 'Không tìm thấy gói tập để xoá!');
        } else {
            req.flash('success_msg', 'Xoá gói tập thành công!');
        }
        res.redirect('/admin/packages/list');
    } catch (err) {
        next(err);
    }
};
