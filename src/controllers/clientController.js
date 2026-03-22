const WorkoutSession = require('../models/workoutSessionModel');
const PauseRequest = require('../models/pauseRequestModel');
const Contract = require('../models/contractModel');
const User = require('../models/userModel');
const notificationService = require('../services/notificationService');

exports.confirmSession = async (req, res, next) => {
    try {
        const sessionId = req.params.id;
        const session = await WorkoutSession.findById(sessionId);

        if (!session) {
            req.flash('error_msg', 'Không tìm thấy buổi tập!');
            return res.redirect('/client');
        }

        // Verify client ownership
        if (session.client.toString() !== req.session.user.id.toString()) {
            req.flash('error_msg', 'Bạn không có quyền xác nhận cho buổi tập này!');
            return res.redirect('/client');
        }

        // Confirm
        session.clientConfirmation = {
            time: new Date(),
            isConfirmed: true
        };
        
        await session.save();

        req.flash('success_msg', 'Xác nhận hoàn thành buổi tập thành công!');
        res.redirect('/client');
    } catch (err) {
        next(err);
    }
};

/**
 * [Client] Gửi yêu cầu bảo lưu Hợp đồng
 */
exports.requestPause = async (req, res, next) => {
    try {
        const clientId = req.session.user.id;
        const { contractId, startDate, durationDays, reason } = req.body;

        // Check if contract belongs to client and is active
        const contract = await Contract.findOne({ _id: contractId, client: clientId, contractStatus: 'Active' });
        if (!contract) {
            req.flash('error_msg', 'Hợp đồng không khả dụng để bảo lưu.');
            return res.redirect('/client');
        }

        // Check for existing pending request
        const existing = await PauseRequest.findOne({ contract: contractId, status: 'Pending' });
        if (existing) {
            req.flash('error_msg', 'Bạn đã có một yêu cầu bảo lưu đang chờ xử lý.');
            return res.redirect('/client');
        }

        await PauseRequest.create({
            client: clientId,
            contract: contractId,
            startDate: new Date(startDate),
            durationDays: Number(durationDays),
            reason
        });

        // NOTIFY ADMINS / CEO
        const admins = await User.find({ role: { $in: ['SA', 'CEO', 'Manager'] }, status: 'Active' });
        for (let admin of admins) {
            await notificationService.pushNotification(
                admin._id,
                'Yêu cầu bảo lưu mới',
                `Khách hàng ${req.session.user.name} vừa gửi yêu cầu bảo lưu hợp đồng ${contract.contractCode}.`,
                'Warning',
                '/admin/contracts/requests',
                clientId
            );
        }

        req.flash('success_msg', 'Yêu cầu bảo lưu của bạn đã được gửi. Vui lòng chờ bộ phận quản lý phê duyệt.');
        res.redirect('/client');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/client');
    }
};

/**
 * [Client] Xem Thư viện bài tập / Lịch tập của mình
 */
exports.getWorkouts = async (req, res, next) => {
    try {
        const clientId = req.session.user.id;
        
        // Lấy danh sách các buổi tập đã lên lịch và đã tập xong của client này
        const sessions = await WorkoutSession.find({ client: clientId })
            .populate('pt', 'name avatar')
            .sort({ scheduledTime: -1 });

        res.render('client/workouts', { 
            sessions,
            activePage: 'workouts'
        });
    } catch (err) {
        next(err);
    }
};

