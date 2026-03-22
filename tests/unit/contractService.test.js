const mongoose = require('mongoose');
const contractService = require('../../src/services/contractService');
const ServicePackage = require('../../src/models/servicePackageModel');
const Contract = require('../../src/models/contractModel');
const Coupon = require('../../src/models/couponModel');

// MOCKING MONGOOSE FOR UNIT TESTING
jest.mock('../../src/models/servicePackageModel');
jest.mock('../../src/models/contractModel');
jest.mock('../../src/models/couponModel');

describe('Contract Service - Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('calculateTotalAmount', () => {
        it('Should calculate correctly: (1,000,000 - 200,000) * 1.1 = 880,000', () => {
            const result = contractService.calculateTotalAmount(1000000, 200000, 10);
            expect(result).toBe(880000);
        });

        it('Should calculate correctly with zero discount', () => {
            const result = contractService.calculateTotalAmount(1000000, 0, 10);
            expect(result).toBe(1100000);
        });

        it('Should cap the discount at basePrice if higher', () => {
            const result = contractService.calculateTotalAmount(1000000, 1500000, 10);
            expect(result).toBe(0); // 1M - 1M = 0; 0 * 1.1 = 0
        });

        it('Should use default parameters correctly', () => {
            const result = contractService.calculateTotalAmount(1000000);
            expect(result).toBe(1100000); // 1M * 1.1
        });
    });

    describe('createContract', () => {
        it('Should create contract with auto-calculated endDate and totalAmount', async () => {
            const mockPackage = {
                _id: new mongoose.Types.ObjectId(),
                price: 50000000,
                duration: 365, // 1 Year
                sessions: 30, // Mock number of sessions
                name: 'Diamond Member'
            };
            
            // Setup Mocks
            ServicePackage.findById.mockResolvedValue(mockPackage);
            Contract.create.mockImplementation(data => Promise.resolve({ ...data, _id: 'mock_id' }));

            const contractInput = {
                packageId: mockPackage._id,
                clientId: new mongoose.Types.ObjectId(),
                branchId: new mongoose.Types.ObjectId(),
                salesId: new mongoose.Types.ObjectId(),
                discount: 5000000,
                startDate: new Date('2026-03-01T00:00:00Z')
            };

            const result = await contractService.createContract(contractInput);

            // Verification
            expect(ServicePackage.findById).toHaveBeenCalledWith(contractInput.packageId);
            expect(Contract.create).toHaveBeenCalled();
            
            // Check Financials: (50M - 5M) * 1.1 = 49.5M
            expect(result.totalAmount).toBe(49500000);
            expect(result.totalSessions).toBe(mockPackage.sessions);
            expect(result.remainingSessions).toBe(mockPackage.sessions);
            
            // Check Dates: End date should be March 1, 2027 (exactly 365 days later)
            const expectedEnd = new Date('2026-03-01T00:00:00Z');
            expectedEnd.setDate(expectedEnd.getDate() + 365);
            expect(result.endDate.toISOString()).toBe(expectedEnd.toISOString());
            
            expect(result.contractStatus).toBe('Draft');
        });

        it('Should throw error if package not found', async () => {
            ServicePackage.findById.mockResolvedValue(null);
            
            await expect(contractService.createContract({ packageId: 'bad_id' }))
                .rejects.toThrow('Gói tập không tồn tại');
        });

        it('Should apply Percentage Coupon correctly', async () => {
            const mockPackage = { _id: 'p1', price: 1000000, duration: 30, sessions: 10 };
            const mockCoupon = { 
                _id: 'c1', type: 'Percentage', value: 10, maxDiscount: 50000, 
                usageCount: 0, usageLimit: 10, save: jest.fn().mockResolvedValue(true) 
            };
            ServicePackage.findById.mockResolvedValue(mockPackage);
            Coupon.findOne.mockResolvedValue(mockCoupon);
            Contract.create.mockImplementation(d => d);

            const result = await contractService.createContract({ 
                packageId: 'p1', couponCode: 'SAVE10' 
            });

            expect(result.discount).toBe(50000); // 10% of 1M is 100k, capped at 50k
            expect(mockCoupon.usageCount).toBe(1);
            expect(mockCoupon.save).toHaveBeenCalled();
        });

        it('Should apply Flat Coupon correctly', async () => {
            const mockPackage = { _id: 'p1', price: 1000000, duration: 30, sessions: 10 };
            const mockCoupon = { 
                _id: 'c2', type: 'Flat', value: 200000, 
                usageCount: 5, usageLimit: 10, save: jest.fn().mockResolvedValue(true) 
            };
            ServicePackage.findById.mockResolvedValue(mockPackage);
            Coupon.findOne.mockResolvedValue(mockCoupon);
            Contract.create.mockImplementation(d => d);

            const result = await contractService.createContract({ 
                packageId: 'p1', couponCode: 'FLAT200' 
            });

            expect(result.discount).toBe(200000);
        });

        it('Should throw error if coupon invalid', async () => {
            const mockPackage = { _id: 'p1', price: 1000000, duration: 30 };
            ServicePackage.findById.mockResolvedValue(mockPackage);
            Coupon.findOne.mockResolvedValue(null);

            await expect(contractService.createContract({ 
                packageId: 'p1', couponCode: 'INVALID' 
            })).rejects.toThrow('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        });

        it('Should apply Percentage Coupon without maxDiscount cap', async () => {
            const mockPackage = { _id: 'p1', price: 1000000, duration: 30, sessions: 10 };
            const mockCoupon = { 
                _id: 'c3', type: 'Percentage', value: 10, maxDiscount: 0, 
                usageCount: 0, usageLimit: 1, save: jest.fn().mockResolvedValue(true) 
            };
            ServicePackage.findById.mockResolvedValue(mockPackage);
            Coupon.findOne.mockResolvedValue(mockCoupon);
            Contract.create.mockImplementation(d => d);

            const result = await contractService.createContract({ 
                packageId: 'p1', couponCode: 'PCT10' 
            });

            expect(result.discount).toBe(100000); // 10% of 1M, no cap
        });
    });
});
