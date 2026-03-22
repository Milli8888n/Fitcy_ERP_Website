const WorkoutSession = require('../models/workoutSessionModel');
const Contract = require('../models/contractModel');
const workoutService = require('../services/workoutService');

/**
 * PT Check-in with GPS verification
 */
exports.checkInSession = async (req, res, next) => {
    try {
        const sessionId = req.params.id;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            req.flash('error_msg', 'Thiếu dữ liệu GPS. Vui lòng bật định vị.');
            return res.redirect('/pt');
        }

        // Use service for business logic
        await workoutService.ptCheckIn(sessionId, latitude, longitude);

        req.flash('success_msg', 'Check-in thành công! Buổi tập đang bắt đầu.');
        res.redirect('/pt');
    } catch (err) {
        req.flash('error_msg', err.message);
        res.redirect('/pt');
    }
};

/**
 * PT Check-out (Finish Session)
 * - Sets status to 'Completed'
 * - Decrements contract remaining sessions
 */
exports.checkOutSession = async (req, res, next) => {
    try {
        const sessionId = req.params.id;
        const session = await WorkoutSession.findById(sessionId);

        if (!session) {
            req.flash('error_msg', 'Không tìm thấy buổi tập!');
            return res.redirect('/pt');
        }

        // Verify session status
        if (session.status !== 'In_Progress') {
            req.flash('error_msg', 'Buổi tập không ở trạng thái đang diễn ra!');
            return res.redirect('/pt');
        }

        // Close session
        session.status = 'Completed';
        session.endTime = new Date();
        await session.save();

        // Update contract remaining sessions
        const contract = await Contract.findById(session.contract);
        if (contract && contract.remainingSessions > 0) {
            contract.remainingSessions -= 1;
            await contract.save();
        }

        req.flash('success_msg', 'Chúc mừng! Bạn đã hoàn thành buổi dạy.');
        res.redirect('/pt');
    } catch (err) {
        next(err);
    }
};
