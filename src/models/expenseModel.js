const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'Chi nhánh là bắt buộc']
    },
    category: {
        type: String,
        required: [true, 'Loại chi phí là bắt buộc'],
        enum: {
            values: ['Rent', 'Electricity', 'Water', 'Equipment', 'Maintenance', 'Marketing', 'Supplies', 'Other'],
            message: '{VALUE} không phải là loại chi phí hợp lệ'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Số tiền là bắt buộc'],
        min: [0, 'Số tiền không được âm']
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invoiceImage: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Approved' // For simplicity in MVP, but can be for approval flow
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
