const WorkoutSession = require('../models/workoutSessionModel');
const Branch = require('../models/branchModel');

/**
 * Haversine formula to calculate distance between two lat/lng points in meters
 * @param {object} p1 - {lat, lng}
 * @param {object} p2 - {lat, lng}
 * @returns {number} Distance in meters
 */
const calculateDistance = (p1, p2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = p1.lat * (Math.PI / 180);
    const phi2 = p2.lat * (Math.PI / 180);
    const delPhi = (p2.lat - p1.lat) * (Math.PI / 180);
    const delLam = (p2.lng - p1.lng) * (Math.PI / 180);

    const a = Math.sin(delPhi / 2) * Math.sin(delPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(delLam / 2) * Math.sin(delLam / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
};

/**
 * Check if PT is within radius (in meters) of branch
 */
exports.isWithinRange = (ptCoords, branchCoords, radius = 500) => {
    const distance = calculateDistance(ptCoords, branchCoords);
    return distance <= radius;
};

/**
 * Validation function for check-in process
 */
exports.validateCheckInLocation = (ptCoords, branchCoords) => {
    const inRange = exports.isWithinRange(ptCoords, branchCoords, 500); // 500m Limit
    if (!inRange) {
        throw new Error('Bạn đang ở quá xa chi nhánh. Vui lòng di chuyển đến chi nhánh để điểm danh.');
    }
    return true;
};

/**
 * PT Check-in Business Logic
 * - Validate Location
 * - Set Start Time
 * - Set Status to 'In_Progress'
 */
exports.ptCheckIn = async (sessionId, lat, lng) => {
    const session = await WorkoutSession.findById(sessionId).populate('branch').populate('contract');
    if (!session) throw new Error('Buổi tập không tồn tại');

    // PAUSE & QUOTA GUARD: Không cho phép điểm danh nếu hợp đồng đang bảo lưu hoặc hết buổi tập
    if (!session.contract || session.contract.contractStatus !== 'Active') {
        const status = session.contract ? session.contract.contractStatus : 'N/A';
        throw new Error(`Không thể điểm danh. Hợp đồng đang ở trạng thái: ${status}. Vui lòng liên hệ Admin/Kế toán.`);
    }

    if (session.contract.remainingSessions <= 0) {
        throw new Error('Hợp đồng đã hết số buổi tập. Vui lòng gia hạn hoặc đóng thêm phí để tiếp tục.');
    }

    // DOUBLE-BOOKING GUARD: Không cho khách tập 2 buổi cùng lúc
    const activeSession = await WorkoutSession.findOne({
        client: session.client,
        status: 'In_Progress',
        _id: { $ne: sessionId }
    });
    if (activeSession) {
        throw new Error('Khách hàng này đang có một buổi tập khác diễn ra (In Progress).');
    }

    // Ensure branch location exists, fallback to default if not set
    const branchCoords = { 
        lat: session.branch && session.branch.location && session.branch.location.latitude ? session.branch.location.latitude : 10.7719, 
        lng: session.branch && session.branch.location && session.branch.location.longitude ? session.branch.location.longitude : 106.6983 
    }; 

    exports.validateCheckInLocation({ lat, lng }, branchCoords);

    session.startTime = new Date();
    session.status = 'In_Progress';
    session.ptCheckIn = {
        latitude: lat,
        longitude: lng,
        time: new Date()
    };

    await session.save();
    return session;
};
