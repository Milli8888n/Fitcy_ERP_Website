const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Nhân viên là bắt buộc']
    },
    month: {
        type: Number,
        required: [true, 'Tháng tính lương là bắt buộc'],
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: [true, 'Năm tính lương là bắt buộc'],
        min: 2000
    },
    baseSalary: {
        type: Number,
        default: 0
    },
    commission: {
        type: Number,
        default: 0,
        min: [0, 'Hoa hồng không được âm']
    },
    bonus: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    totalSalary: {
        type: Number,
        required: [true, 'Tổng lương thực nhận là bắt buộc']
    },
    status: {
        type: String,
        enum: ['Draft', 'Approved', 'Paid'],
        default: 'Draft'
    },
    paymentDate: Date,
    note: String
}, { timestamps: true });

// Ensure one payroll per staff per month
payrollSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
