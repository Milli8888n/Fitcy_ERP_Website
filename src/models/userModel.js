const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt, hash } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Họ tên là bắt buộc'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        trim: true,
        // Encryption: store encrypted, return decrypted
        set: encrypt,
        get: decrypt
    },
    emailHash: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ['SA', 'Admin', 'CEO', 'Manager', 'PT', 'Accountant', 'Marketing', 'Sales', 'Client'],
            message: '{VALUE} không phải là vai trò hợp lệ'
        },
        default: 'Client'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [function() {
            return !['SA', 'Admin'].includes(this.role);
        }, 'Chi nhánh là bắt buộc đối với vai trò này']
    },
    phone: {
        type: String,
        trim: true,
        set: encrypt,
        get: decrypt
    },
    phoneHash: {
        type: String,
        index: true
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Resigned'],
        default: 'Active'
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    jobDescription: [{
        type: String
    }],
    avatar: {
        type: String,
        default: '/images/default-avatar.png'
    },
    // Affiliate / Referral System
    referralCode: {
        type: String,
        unique: true,
        sparse: true, // Only if set
        index: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Payroll & Commission Settings
    baseSalary: {
        type: Number,
        default: 5000000 // VND
    },
    ptCommissionPerSession: {
        type: Number,
        default: 150000 // VND per session
    },
    salesCommissionRate: {
        type: Number,
        default: 5 // 5% of contact totalAmount
    },
    // Compliance & HR Documents (Google Drive IDs)
    taxDocumentId: {
        type: String
    },
    insuranceDocumentId: {
        type: String
    }
}, { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Hash PII indices for search/login BEFORE VALIDATION
userSchema.pre('validate', async function() {
    if (this.isModified('email') && this.email) {
        this.emailHash = hash(this.email);
    }
    if (this.isModified('phone') && this.phone) {
        this.phoneHash = hash(this.phone);
    }
});

// Hash password before saving + Generate Referral Code
userSchema.pre('save', async function() {
    // 1. Generate unique referralCode for Clients if not exists
    if (this.role === 'Client' && !this.referralCode) {
        let unique = false;
        while (!unique) {
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            const existing = await this.constructor.findOne({ referralCode: code });
            if (!existing) {
                this.referralCode = code;
                unique = true;
            }
        }
    }
    // 2. Hash Password
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
