const Payroll = require('../models/payrollModel');

/**
 * Calculate PT Commission based on completed and confirmed sessions (Tiered logic)
 * <20 buổi: 100k, 20-50 buổi: 120k, >50 buổi: 150k
 * @param {Array} sessions - Array of completed and confirmed workout sessions
 * @returns {number} Total PT commission
 */
exports.calculatePTCommission = (sessions = []) => {
    const validSessions = sessions.filter(session => session.status === 'Completed');
    const count = validSessions.length;
    let ratePerSession;
    if (count > 50) ratePerSession = 150000;
    else if (count >= 20) ratePerSession = 120000;
    else ratePerSession = 100000;
    
    return count * ratePerSession;
};

/**
 * Calculate Sales Commission based on contract revenue
 * @param {Array} contracts - Array of active/paid contracts
 * @param {number} rate - Percentage rate (e.g., 5 for 5%)
 * @returns {number} Total sales commission rounded to VND
 */
exports.calculateSalesCommission = (contracts = [], rate = 0) => {
    const totalRevenue = contracts.reduce((sum, contract) => sum + (contract.totalAmount || 0), 0);
    return Math.round(totalRevenue * (rate / 100));
};

/**
 * Utility to calculate total salary
 */
exports.calculateTotalSalary = (baseSalary = 0, commission = 0, bonus = 0, deductions = 0) => {
    const total = baseSalary + commission + bonus - deductions;
    return Math.max(0, total); // Salary cannot be negative
};
