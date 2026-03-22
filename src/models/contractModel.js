const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    contractCode: {
        type: String,
        unique: true,
        index: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Khách hàng là bắt buộc']
    },
    servicePackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServicePackage',
        required: [true, 'Gói tập là bắt buộc']
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'Chi nhánh là bắt buộc']
    },
    sales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Nhân viên kinh doanh là bắt buộc']
    },
    pt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Optional because not all contracts (Gym) need a PT
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'Ngày hết hạn là bắt buộc'],
        validate: {
            validator: function(value) {
                // Ensure we have a startDate to compare with
                const start = this.startDate || new Date();
                return value >= start;
            },
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
        }
    },
    basePrice: {
        type: Number,
        required: [true, 'Giá gốc là bắt buộc']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Giảm giá không được âm'],
        validate: {
            validator: function(value) {
                return value <= this.basePrice;
            },
            message: 'Giảm giá không được vượt quá giá gốc'
        }
    },
    vat: {
        type: Number,
        default: 10, // 10% VAT
        min: [0, 'Thuế không được âm']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Tổng tiền là bắt buộc']
    },
    netAmount: {
        type: Number
    },
    ptCommission: {
        type: Number,
        default: 0
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    remainingSessions: {
        type: Number,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: [0, 'Số tiền đã trả không được âm']
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Deposit', 'Unpaid', 'Pending_Paid'],
        default: 'Unpaid'
    },
    contractStatus: {
        type: String,
        enum: ['Draft', 'Active', 'Expired', 'Paused', 'Cancelled'],
        default: 'Draft'
    },
    originalEndDate: {
        type: Date
    },
    currentEndDate: {
        type: Date
    },
    pauseHistory: [{
        startDate: Date,
        endDate: Date,
        reason: String,
        duration: Number
    }],
    paymentMethods: [{
        type: String,
        enum: ['Cash', 'Transfer', 'Card', 'Installment']
    }],
    notes: String,
    googleDriveFileId: String,
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    deleted: {
        type: Boolean,
        default: false,
        select: false
    }
}, { timestamps: true });

// Auto-generate contractCode using FMS-YYYY-MM-XXXX format
contractSchema.pre('save', async function() {
    if (!this.contractCode) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        // Find the last contract created in this month
        const lastContract = await this.constructor.findOne(
            { contractCode: new RegExp(`^FMS-${year}-${month}-`) },
            { contractCode: 1 }
        ).sort({ contractCode: -1 });

        let sequenceNumber = 1;
        if (lastContract && lastContract.contractCode) {
            const parts = lastContract.contractCode.split('-');
            sequenceNumber = parseInt(parts[3], 10) + 1;
        }

        const formattedSequence = String(sequenceNumber).padStart(4, '0');
        this.contractCode = `FMS-${year}-${month}-${formattedSequence}`;
    }
    
    // Set EndDates initially if they are not set. Note: Validation ensures endDate exists.
    if (this.isModified('endDate') && !this.originalEndDate) {
        this.originalEndDate = this.endDate;
        this.currentEndDate = this.endDate;
    }
});

module.exports = mongoose.model('Contract', contractSchema);
