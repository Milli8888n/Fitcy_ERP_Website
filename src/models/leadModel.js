const mongoose = require('mongoose');
const { encrypt, decrypt, hash } = require('../utils/encryption');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên khách hàng là bắt buộc'],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        set: encrypt,
        get: decrypt
    },
    emailHash: {
        type: String,
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc'],
        trim: true,
        set: encrypt,
        get: decrypt
    },
    phoneHash: {
        type: String,
        required: [true, 'Phone hash is required for indexing'],
        index: true
    },
    interestedPackage: {
        type: String,
        enum: ['Gym', 'Yoga', 'PT', 'Kickfit', 'Pilates'],
        default: 'Gym'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'Chi nhánh quan tâm là bắt buộc']
    },
    source: {
        type: String,
        enum: ['Website', 'Facebook', 'Referral', 'Walk-in'],
        default: 'Website'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
        default: 'New'
    },
    notes: String,
    // Initial Body Metrics for conversion comparison
    weight: Number,
    height: Number,
    bodyFat: Number,
    muscleMass: Number,
    targetGoal: {
        type: String,
        enum: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance', 'Other']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Sales rep
    }
}, { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Update Blind Indices BEFORE VALIDATION
leadSchema.pre('validate', async function() {
    if (this.isModified('email') && this.email) {
        this.emailHash = hash(this.email);
    }
    if (this.isModified('phone') && this.phone) {
        this.phoneHash = hash(this.phone);
    }
});

module.exports = mongoose.model('Lead', leadSchema);
