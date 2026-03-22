const Lead = require('../models/leadModel');
const Branch = require('../models/branchModel');
const ExcelJS = require('exceljs');

/**
 * Hiển thị Landing Page với form thu thập Leads
 */
exports.getLandingPage = async (req, res, next) => {
    try {
        const branches = await Branch.find({ status: 'Open' });
        res.render('landing', { branches });
    } catch (err) {
        next(err);
    }
};

/**
 * Xử lý đăng ký tập thử từ Landing Page (Leads generation)
 */
exports.registerLead = async (req, res, next) => {
    try {
        const { name, phone, email, branchId, interestedPackage, notes, weight, height, bodyFat, targetGoal } = req.body;
        
        await Lead.create({
            name,
            phone,
            email,
            branch: branchId,
            interestedPackage,
            notes,
            weight: Number(weight) || 0,
            height: Number(height) || 0,
            bodyFat: Number(bodyFat) || 0,
            targetGoal,
            source: 'Website'
        });

        req.flash('success_msg', 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24h tới để tư vấn chi tiết.');
        res.redirect('/#trial');
    } catch (err) {
        // Simple error handling for trial form
        req.flash('error_msg', 'Vui lòng kiểm tra lại thông tin. Đảm bảo số điện thoại chính xác.');
        res.redirect('/');
    }
};

/**
 * [Admin] Xem danh sách Leads (có hỗ trợ lọc qua query string)
 */
exports.getAllLeads = async (req, res, next) => {
    try {
        const { status, interestedPackage, source } = req.query;

        // Build dynamic filter
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (interestedPackage && interestedPackage !== 'all') filter.interestedPackage = interestedPackage;
        if (source && source !== 'all') filter.source = source;

        const leads = await Lead.find(filter).populate('branch', 'name').sort({ createdAt: -1 });

        // Pass current filter values back to view for active state
        res.render('admin/leads/list', { 
            leads, 
            activePage: 'leads',
            currentFilter: { status: status || 'all', interestedPackage: interestedPackage || 'all', source: source || 'all' }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * [Admin] Xuất Excel danh sách Leads
 */
exports.exportLeadsExcel = async (req, res, next) => {
    try {
        const { status, interestedPackage, source } = req.query;

        // Same filter logic as getAllLeads
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (interestedPackage && interestedPackage !== 'all') filter.interestedPackage = interestedPackage;
        if (source && source !== 'all') filter.source = source;

        const leads = await Lead.find(filter).populate('branch', 'name').sort({ createdAt: -1 });

        // Build Excel workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'FitCity System';
        const sheet = workbook.addWorksheet('Leads');

        // Header row
        sheet.columns = [
            { header: 'STT', key: 'stt', width: 6 },
            { header: 'Ngày đăng ký', key: 'date', width: 18 },
            { header: 'Họ tên', key: 'name', width: 25 },
            { header: 'SĐT', key: 'phone', width: 18 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Gói quan tâm', key: 'package', width: 14 },
            { header: 'Chi nhánh', key: 'branch', width: 22 },
            { header: 'Nguồn', key: 'source', width: 12 },
            { header: 'Trạng thái', key: 'status', width: 16 },
            { header: 'Ghi chú', key: 'notes', width: 30 },
        ];

        // Style header
        sheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Map status to Vietnamese
        const statusMap = { 'New': 'Mới', 'Contacted': 'Đã liên hệ', 'Qualified': 'Đạt tiêu chuẩn', 'Lost': 'Mất', 'Converted': 'Đã chuyển đổi' };

        // Data rows
        leads.forEach((lead, idx) => {
            sheet.addRow({
                stt: idx + 1,
                date: new Date(lead.createdAt).toLocaleDateString('vi-VN'),
                name: lead.name,
                phone: lead.phone,
                email: lead.email || '',
                package: lead.interestedPackage,
                branch: lead.branch ? lead.branch.name : 'N/A',
                source: lead.source,
                status: statusMap[lead.status] || lead.status,
                notes: lead.notes || ''
            });
        });

        // Set response headers for download
        const fileName = `Leads_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
};
