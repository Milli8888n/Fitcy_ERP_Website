const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Mã giảm giá là bắt buộc'],
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Percentage', 'Fixed'],
        default: 'Percentage'
    },
    value: {
        type: Number,
        required: [true, 'Giá trị giảm giá là bắt buộc'],
        min: [0, 'Giá trị không được âm']
    },
    maxDiscount: {
        type: Number, // Only for Percentage
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'Ngày hết hạn là bắt buộc']
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
