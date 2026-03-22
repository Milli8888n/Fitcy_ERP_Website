const mongoose = require('mongoose');
const servicePackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên gói tập là bắt buộc'],
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: [true, 'Loại gói tập là bắt buộc'],
        enum: {
            values: ['Gym', 'PT', 'Yoga', 'Boxing', 'Zumba', 'Dance'],
            message: '{VALUE} không phải là loại gói tập hợp lệ'
        }
    },
    duration: {
        type: Number,
        required: [true, 'Thời hạn gói tập (ngày) là bắt buộc'],
        min: [1, 'Thời hạn tối thiểu là 1 ngày']
    },
    sessions: {
        type: Number,
        default: 0,
        min: [0, 'Số buổi tập không được âm']
    },
    price: {
        type: Number,
        required: [true, 'Giá gói tập là bắt buộc'],
        min: [0, 'Giá gói tập không được âm']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('ServicePackage', servicePackageSchema);
