const payrollService = require('../../src/services/payrollService');

describe('Payroll Service - Full Coverage', () => {
    describe('calculatePTCommission', () => {
        it('Should calculate correctly: 10 completed * 100k = 1,000,000', () => {
            const sessions = Array(10).fill({ status: 'Completed' });
            expect(payrollService.calculatePTCommission(sessions)).toBe(1000000); // Tier 1: 100k
        });

        it('Should calculate correctly: 25 completed * 120k = 3,000,000', () => {
            const sessions = Array(25).fill({ status: 'Completed' });
            expect(payrollService.calculatePTCommission(sessions)).toBe(3000000); // Tier 2: 120k
        });

        it('Should calculate correctly: 55 completed * 150k = 8,250,000', () => {
            const sessions = Array(55).fill({ status: 'Completed' });
            expect(payrollService.calculatePTCommission(sessions)).toBe(8250000); // Tier 3: 150k
        });

        it('Should return 0 for empty sessions array', () => {
            expect(payrollService.calculatePTCommission([])).toBe(0);
        });

        it('Should return 0 when called with defaults (no args)', () => {
            expect(payrollService.calculatePTCommission()).toBe(0);
        });
    });

    describe('calculateSalesCommission', () => {
        it('Should calculate 100M revenue * 5% = 5,000,000', () => {
            const contracts = [{ totalAmount: 50000000 }, { totalAmount: 50000000 }];
            expect(payrollService.calculateSalesCommission(contracts, 5)).toBe(5000000);
        });

        it('Should return 0 for empty contracts', () => {
            expect(payrollService.calculateSalesCommission([], 5)).toBe(0);
        });

        it('Should return 0 when called with defaults (no args)', () => {
            expect(payrollService.calculateSalesCommission()).toBe(0);
        });

        it('Should handle contracts with missing totalAmount', () => {
            const contracts = [{ totalAmount: 1000000 }, {}];
            expect(payrollService.calculateSalesCommission(contracts, 10)).toBe(100000);
        });
    });

    describe('calculateTotalSalary', () => {
        it('Should calculate base + commission + bonus - deductions', () => {
            expect(payrollService.calculateTotalSalary(5000000, 2000000, 500000, 200000)).toBe(7300000);
        });

        it('Should never return negative salary', () => {
            expect(payrollService.calculateTotalSalary(1000000, 0, 0, 5000000)).toBe(0);
        });

        it('Should return 0 when called with defaults (no args)', () => {
            expect(payrollService.calculateTotalSalary()).toBe(0);
        });
    });
});
