const Contract = require('../models/contractModel');
const ServicePackage = require('../models/servicePackageModel');
const Coupon = require('../models/couponModel');

/**
 * Calculate total amount for contract including VAT (after discount)
 * Formula: Math.round((basePrice - discount) * (1 + vat / 100))
 */
exports.calculateTotalAmount = (basePrice, discount = 0, vat = 10) => {
    const finalDiscount = Math.min(discount, basePrice);
    const afterDiscount = basePrice - finalDiscount;
    const total = afterDiscount * (1 + vat / 100);
    return Math.round(total);
};

/**
 * Business Logic to create a new Contract
 */
exports.createContract = async (data) => {
    const { 
        packageId, clientId, branchId, salesId, ptId, 
        discount = 0, couponCode, startDate = new Date() 
    } = data;

    // 1. Fetch package
    const pkg = await ServicePackage.findById(packageId);
    if (!pkg) throw new Error('Gói tập không tồn tại');

    let finalDiscount = Number(discount) || 0;
    let appliedCoupon = null;

    // 2. Process Coupon if provided
    if (couponCode) {
        const coupon = await Coupon.findOne({ 
            code: couponCode.toUpperCase(), 
            active: true,
            endDate: { $gte: new Date() },
            usageLimit: { $gt: 0 }
        });

        if (coupon) {
            if (coupon.type === 'Percentage') {
                let couponDiscount = (pkg.price * coupon.value) / 100;
                if (coupon.maxDiscount > 0) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
                finalDiscount += couponDiscount;
            } else {
                finalDiscount += coupon.value;
            }
            appliedCoupon = coupon._id;
            
            // Increment usage
            coupon.usageCount += 1;
            coupon.usageLimit -= 1;
            await coupon.save();
        } else {
            throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        }
    }

    // 3. Calculate financial values
    const finalDiscountBounded = Math.min(finalDiscount, pkg.price);
    const netAmount = pkg.price - finalDiscountBounded;
    const ptCommission = netAmount * 0.1; // Assume 10% PT commission rate based on netAmount
    const totalAmount = this.calculateTotalAmount(pkg.price, finalDiscountBounded, 10);

    // 4. Calculate dates
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + pkg.duration);

    // 5. Create record
    const contract = await Contract.create({
        client: clientId,
        servicePackage: packageId,
        branch: branchId,
        sales: salesId,
        pt: ptId,
        startDate: start,
        endDate: end,
        basePrice: pkg.price,
        discount: finalDiscountBounded,
        coupon: appliedCoupon,
        vat: 10,
        netAmount: netAmount,
        ptCommission: ptCommission,
        totalAmount: totalAmount,
        totalSessions: pkg.sessions || 0,
        remainingSessions: pkg.sessions || 0,
        contractStatus: 'Draft',
        paymentStatus: 'Unpaid'
    });

    return contract;
};
