const Contract = require('../models/contractModel');
const ServicePackage = require('../models/servicePackageModel');
const Branch = require('../models/branchModel');
const User = require('../models/userModel');
const contractService = require('../services/contractService');
const contractPauseService = require('../services/contractPauseService');
const pdfService = require('../services/pdfService');
const driveService = require('../services/driveService');
const fs = require('fs');
const path = require('path');
const notificationService = require('../services/notificationService');

/**
 * Xuất file PDF Hợp đồng
 */
exports.downloadContract = async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id)
            .populate('client')
            .populate('servicePackage')
            .populate('pt')
            .populate('branch');

        if (!contract) {
            req.flash('error_msg', 'Không tìm thấy hợp đồng!');
            return res.redirect('/admin/contracts/list');
        }

        const fileName = `Contract_${contract.contractCode || contract._id}.pdf`;
        const tempPath = path.join(__dirname, '../../tmp', fileName);

        // Ensure tmp dir exists
        const tmpDir = path.join(__dirname, '../../tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        await pdfService.generateContractPDF(contract, tempPath);

        // SYNC TO GDRIVE: Upload only if not already on drive
        if (!contract.googleDriveFileId) {
            const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || 'fitcity_contracts';
            const driveId = await driveService.uploadToDrive(tempPath, fileName, folderId);
            if (driveId) {
                await driveService.attachDriveIdToContract(contract._id, driveId);
            }
        }

        res.download(tempPath, fileName, (err) => {
            if (err) next(err);
            // Delete temp local file after download/upload
            try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch(e) {}
        });
    } catch (err) {
        next(err);
    }
};

// 1. Hiển thị danh sách Hợp đồng
exports.getContractList = async (req, res, next) => {
    try {
        const contracts = await Contract.find()
            .populate('client', 'name email phone')
            .populate('servicePackage', 'name type price duration')
            .populate('pt', 'name')
            .populate('sales', 'name')
            .sort({ createdAt: -1 });
            
        res.render('admin/contracts/list', { contracts });
    } catch (err) {
        next(err);
    }
};

// 2. Form Tạo Hợp đồng mới
exports.getCreateForm = async (req, res, next) => {
    try {
        // Cần truyền list options cho dropdowns
        const clients = await User.find({ role: 'Client', status: 'Active' });
        const packages = await ServicePackage.find({ status: 'Active' });
        const branches = await Branch.find();
        
        // Sales person can be someone with Sales, Manager, Admin roles
        const salesStaff = await User.find({ role: { $in: ['Sales', 'Manager', 'Admin', 'SA'] }, status: 'Active' });
        
        // PTs
        const pts = await User.find({ role: 'PT', status: 'Active' });

        res.render('admin/contracts/form', { 
            isEdit: false, 
            contract: new Contract(),
            clients,
            packages,
            branches,
            salesStaff,
            pts
        });
    } catch (err) {
        next(err);
    }
};

// 3. Xử lý Thêm mới (Logic tài chính nằm ở contractService)
exports.storeContract = async (req, res, next) => {
    try {
        const { client, servicePackage, branch, sales, pt, discount, couponCode, paymentStatus, paymentMethods, notes } = req.body;
        
        // Use service to calculate money and dates
        const newContract = await contractService.createContract({
            clientId: client,
            packageId: servicePackage,
            branchId: branch,
            salesId: sales,
            ptId: pt || null,
            discount: Number(discount) || 0,
            couponCode: couponCode,
            startDate: new Date()
        });

        // Update payment info if provided
        if (paymentStatus) newContract.paymentStatus = paymentStatus;
        if (paymentMethods) newContract.paymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods];
        if (notes) newContract.notes = notes;
        
        if (paymentStatus === 'Paid') {
            newContract.paidAmount = newContract.totalAmount;
            newContract.contractStatus = 'Active';
        }
        
        await newContract.save();

        // NOTIFY CLIENT: New Contract Created
        await notificationService.pushNotification(
            client,
            'Hợp đồng mới đã được tạo',
            `Chào bạn, một hợp đồng mới (${newContract.contractCode}) đã được thiết lập cho gói tập ${servicePackage}. Vui lòng kiểm kiểm tra.`,
            'Info',
            '/client/contracts'
        );

        // NOTIFY SALES: Sale contribution recognized
        await notificationService.pushNotification(
            sales,
            'Ghi nhận doanh thu',
            `Bạn vừa chốt thành công 01 hợp đồng (${newContract.contractCode}). Chúc mừng!`,
            'Success'
        );

        req.flash('success_msg', 'Tạo hợp đồng thành công! Dòng tiền đã được ghi nhận.');
        res.redirect('/admin/contracts/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect('/admin/contracts/create');
        }
        req.flash('error_msg', err.message);
        return res.redirect('/admin/contracts/create');
    }
};

// 4. Form Chỉnh sửa Hợp đồng (Thường dùng để cập nhật Thanh toán)
exports.getEditForm = async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            req.flash('error_msg', 'Không tìm thấy hợp đồng!');
            return res.redirect('/admin/contracts/list');
        }

        const clients = await User.find({ role: 'Client', status: 'Active' });
        const packages = await ServicePackage.find({ status: 'Active' });
        const branches = await Branch.find();
        const salesStaff = await User.find({ role: { $in: ['Sales', 'Manager', 'Admin', 'SA'] }, status: 'Active' });
        const pts = await User.find({ role: 'PT', status: 'Active' });

        res.render('admin/contracts/form', { 
            isEdit: true, 
            contract,
            clients,
            packages,
            branches,
            salesStaff,
            pts
        });
    } catch (err) {
        next(err);
    }
};

// 5. Cập nhật Hợp đồng
exports.updateContract = async (req, res, next) => {
    try {
        const contractId = req.params.id;
        
        // ONLY update explicitly permitted fields for payment status changes
        const updateData = {};
        if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;
        if (req.body.paymentMethods) updateData.paymentMethods = req.body.paymentMethods;
        if (req.body.notes !== undefined) updateData.notes = req.body.notes;
        
        // Handle logic for checking Paid status
        if (updateData.paymentStatus === 'Paid') {
            const tempContract = await Contract.findById(contractId);
            updateData.paidAmount = tempContract.totalAmount;
            updateData.contractStatus = 'Active';
        }

        const updated = await Contract.findByIdAndUpdate(contractId, updateData, { new: true });
        
        if (updated && updateData.paymentStatus === 'Paid') {
            // NOTIFY CLIENT: Payment confirmed
            await notificationService.pushNotification(
                updated.client,
                'Thanh toán thành công',
                `Hợp đồng ${updated.contractCode} đã được kích hoạt sau khi xác nhận thanh toán. Chúc bạn tập luyện hứng khởi!`,
                'Success',
                '/client/progress'
            );
        }
        
        if (!updated) {
            req.flash('error_msg', 'Cập nhật thất bại. Không tìm thấy hợp đồng!');
            return res.redirect('/admin/contracts/list');
        }

        req.flash('success_msg', 'Cập nhật trạng thái Hợp đồng thành công!');
        res.redirect('/admin/contracts/list');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message).join(', ');
            req.flash('error_msg', messages);
            return res.redirect(`/admin/contracts/edit/${req.params.id}`);
        }
        next(err);
    }
};

// 6. Xóa Hợp đồng
exports.deleteContract = async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            req.flash('error_msg', 'Không tìm thấy hợp đồng!');
            return res.redirect('/admin/contracts/list');
        }
        
        if (contract.paymentStatus === 'Paid' && req.session.user.role !== 'SA') {
            req.flash('error_msg', 'Chỉ có SuperAdmin mới được quyền xoá hợp đồng đã thu tiền!');
            return res.redirect('/admin/contracts/list');
        }

        await Contract.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Đã huỷ/xoá thủ công Hợp đồng thành công!');
        res.redirect('/admin/contracts/list');
    } catch (err) {
        next(err);
    }
};
// 7. Bảo lưu hợp đồng
exports.pauseContract = async (req, res, next) => {
    try {
        const { durationDays, reason } = req.body;
        await contractPauseService.pauseContract(req.params.id, parseInt(durationDays), reason);
        req.flash('success_msg', 'Bảo lưu hợp đồng thành công!');
        res.redirect('/admin/contracts/list');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/contracts/list');
    }
};

// 8. Kích hoạt lại hợp đồng
exports.unpauseContract = async (req, res, next) => {
    try {
        await contractPauseService.unpauseContract(req.params.id);
        req.flash('success_msg', 'Kích hoạt lại hợp đồng thành công!');
        res.redirect('/admin/contracts/list');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/contracts/list');
    }
};

/**
 * [Admin/CEO] Xem danh sách yêu cầu bảo lưu đang chờ
 */
const PauseRequest = require('../models/pauseRequestModel');
exports.getPauseRequests = async (req, res, next) => {
    try {
        const requests = await PauseRequest.find({ status: 'Pending' })
            .populate('client', 'name email avatar')
            .populate('contract', 'contractCode endDate')
            .sort({ createdAt: -1 });
            
        res.render('admin/contracts/pause-requests', { requests, activePage: 'contracts' });
    } catch (err) {
        next(err);
    }
};

/**
 * [Admin/CEO] Phê duyệt yêu cầu bảo lưu
 */
exports.approvePauseRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const request = await PauseRequest.findById(requestId);
        if (!request) throw new Error('Yêu cầu không tồn tại');

        // 1. Thực hiện bảo lưu hợp đồng qua service
        await contractPauseService.pauseContract(request.contract, request.durationDays, request.reason);

        // 2. Cập nhật trạng thái yêu cầu
        request.status = 'Approved';
        request.processedBy = req.session.user.id;
        request.adminNote = req.body.adminNote || 'Đã phê duyệt qua hệ thống';
        await request.save();

        // 3. Thông báo cho khách hàng
        await notificationService.pushNotification(
            request.client,
            'Bảo lưu đã được duyệt',
            `Yêu cầu bảo lưu ${request.durationDays} ngày của bạn đã được phê duyệt. Hợp đồng hiện đang tạm dừng.`,
            'Success',
            '/client/contracts'
        );

        req.flash('success_msg', 'Đã phê duyệt yêu cầu bảo lưu thành công!');
        res.redirect('/admin/contracts/requests');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/contracts/requests');
    }
};

/**
 * [Admin/CEO] Từ chối yêu cầu bảo lưu
 */
exports.rejectPauseRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const request = await PauseRequest.findById(requestId);
        if (!request) throw new Error('Yêu cầu không tồn tại');

        request.status = 'Rejected';
        request.processedBy = req.session.user.id;
        request.adminNote = req.body.adminNote || 'Không đủ điều kiện bảo lưu';
        await request.save();

        // Thông báo
        await notificationService.pushNotification(
            request.client,
            'Yêu cầu bảo lưu bị từ chối',
            `Yêu cầu bảo lưu của bạn không được phê duyệt. Lý do: ${request.adminNote}`,
            'Warning',
            '/client/contracts'
        );

        req.flash('success_msg', 'Đã từ chối yêu cầu bảo lưu.');
        res.redirect('/admin/contracts/requests');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/admin/contracts/requests');
    }
};
