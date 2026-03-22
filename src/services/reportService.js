const ExcelJS = require('exceljs');
const Contract = require('../models/contractModel');
const Expense = require('../models/expenseModel');

/**
 * Generate Quarterly Financial Report in Excel
 */
exports.generateQuarterlyReport = async (year, quarter) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Quarter ${quarter} - ${year}`);

    // Define columns
    sheet.columns = [
        { header: 'Hạng mục', key: 'category', width: 25 },
        { header: 'Tháng 1', key: 'm1', width: 15 },
        { header: 'Tháng 2', key: 'm2', width: 15 },
        { header: 'Tháng 3', key: 'm3', width: 15 },
        { header: 'Tổng Quý', key: 'total', width: 20 }
    ];

    // Styling the header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    const startMonth = (quarter - 1) * 3; // 0, 3, 6, 9
    const months = [startMonth, startMonth + 1, startMonth + 2];

    const reportData = {
        revenue: [0, 0, 0],
        expense: [0, 0, 0]
    };

    // Aggregate Revenue
    for (let i = 0; i < 3; i++) {
        const m = months[i];
        const startDate = new Date(year, m, 1);
        const endDate = new Date(year, m + 1, 0, 23, 59, 59);

        const revenue = await Contract.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        reportData.revenue[i] = revenue[0] ? revenue[0].total : 0;

        const expenses = await Expense.aggregate([
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        reportData.expense[i] = expenses[0] ? expenses[0].total : 0;
    }

    // Add Rows
    sheet.addRow({
        category: 'Doanh thu (Revenue)',
        m1: reportData.revenue[0],
        m2: reportData.revenue[1],
        m3: reportData.revenue[2],
        total: reportData.revenue.reduce((a, b) => a + b, 0)
    });

    sheet.addRow({
        category: 'Chi phí (Expenses)',
        m1: reportData.expense[0],
        m2: reportData.expense[1],
        m3: reportData.expense[2],
        total: reportData.expense.reduce((a, b) => a + b, 0)
    });

    sheet.addRow({
        category: 'Lợi nhuận ròng (Net Profit)',
        m1: reportData.revenue[0] - reportData.expense[0],
        m2: reportData.revenue[1] - reportData.expense[1],
        m3: reportData.revenue[2] - reportData.expense[2],
        total: (reportData.revenue.reduce((a, b) => a + b, 0)) - (reportData.expense.reduce((a, b) => a + b, 0))
    });

    // Coloring the Profit row
    const lastRow = sheet.lastRow;
    lastRow.font = { bold: true, color: { argb: 'FF008000' } };

    return workbook;
};
