const BodyMetric = require('../models/bodyMetricModel');
const Contract = require('../models/contractModel');
const notificationService = require('../services/notificationService');

/**
 * [PT] Lấy danh sách khách hàng của tôi để nhập chỉ số
 */
exports.getMyClientsForMetrics = async (req, res, next) => {
    try {
        const ptId = req.session.user.id;
        const contracts = await Contract.find({ pt: ptId, contractStatus: 'Active' })
            .populate('client', 'name avatar email phone')
            .populate('servicePackage', 'name');
        
        // Lấy danh sách khách hàng duy nhất + đính kèm gói tập đầu tiên tìm thấy
        const clients = [];
        const seenIds = new Set();
        
        contracts.forEach(contract => {
            if (contract.client && !seenIds.has(contract.client._id.toString())) {
                // Thêm thuộc tínhgetPackageName để hiển thị gói tập mẫu trong UI
                const clientObj = contract.client.toObject();
                clientObj.activePackageName = contract.servicePackage ? contract.servicePackage.name : 'N/A';
                
                clients.push(clientObj);
                seenIds.add(contract.client._id.toString());
            }
        });

        res.render('pt/metrics/clients', { clients, activePage: 'metrics' });
    } catch (err) {
        next(err);
    }
};

/**
 * [PT] Hiển thị form nhập chỉ số cho 1 khách hàng cụ thể
 */
exports.getAddMetricForm = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const client = await Contract.findOne({ client: clientId }).populate('client', 'name avatar');
        
        res.render('pt/metrics/form', { client: client.client, activePage: 'metrics' });
    } catch (err) {
        next(err);
    }
};

/**
 * [PT] Lưu chỉ số cơ thể mới
 */
exports.saveBodyMetric = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const ptId = req.session.user.id;
        
        await BodyMetric.create({
            client: clientId,
            pt: ptId,
            weight: Number(req.body.weight),
            height: Number(req.body.height),
            bodyFat: Number(req.body.bodyFat),
            muscleMass: Number(req.body.muscleMass),
            visceralFat: Number(req.body.visceralFat),
            water: Number(req.body.water) || 0,
            minerals: Number(req.body.minerals) || 0,
            protein: Number(req.body.protein) || 0,
            measurements: {
                chest: Number(req.body.chest) || 0,
                waist: Number(req.body.waist) || 0,
                hips: Number(req.body.hips) || 0,
                bicep: Number(req.body.bicep) || 0,
                thigh: Number(req.body.thigh) || 0
            },
            notes: req.body.notes
        });

        // NOTIFY CLIENT: InBody update
        await notificationService.pushNotification(
            clientId,
            'Chỉ số cơ thể mới đã cập nhật',
            'PT của bạn vừa cập nhật kết quả đo InBody mới nhất. Hãy kiểm tra ngay biểu đồ tiến độ nhé!',
            'Info',
            '/client/progress'
        );

        req.flash('success_msg', 'Đã lưu chỉ số cơ thể thành công cho khách hàng.');
        res.redirect('/pt/metrics');
    } catch (err) {
        next(err);
    }
};

/**
 * [Client] Xem biểu đồ tiến độ của mình
 */
exports.getMyProgress = async (req, res, next) => {
    try {
        const clientId = req.session.user.id;
        const metrics = await BodyMetric.find({ client: clientId }).sort({ date: 1 });
        
        res.render('client/progress', { metrics, activePage: 'progress' });
    } catch (err) {
        next(err);
    }
};
