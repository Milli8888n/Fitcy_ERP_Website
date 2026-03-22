const mongoose = require('mongoose');
const User = require('../../src/models/userModel');
const bcrypt = require('bcryptjs');

describe('User Model Unit Test', () => {
    const validBranchId = new mongoose.Types.ObjectId();

    it('Should be valid for a Client with a Branch', () => {
        const user = new User({
            name: 'Client A', email: 'client@example.com', password: 'password123',
            role: 'Client', branch: validBranchId, phone: '0901112223'
        });
        expect(user.validateSync()).toBeUndefined();
    });

    it('Should be valid for SA without a Branch', () => {
        const user = new User({
            name: 'Super Admin', email: 'sa@fitcity.com', password: 'password123', role: 'SA'
        });
        expect(user.validateSync()).toBeUndefined();
    });

    it('Should be valid for Admin without a Branch', () => {
        const user = new User({
            name: 'Admin', email: 'admin@fitcity.com', password: 'password123', role: 'Admin'
        });
        expect(user.validateSync()).toBeUndefined();
    });

    it('Should fail if PT does not have a Branch', () => {
        const user = new User({
            name: 'PT John', email: 'pt@fitcity.com', password: 'password123', role: 'PT'
        });
        expect(user.validateSync().errors.branch).toBeDefined();
    });

    it('Should fail if email format is invalid', () => {
        const user = new User({
            name: 'User', email: 'invalid-email', password: 'password123', role: 'SA'
        });
        expect(user.validateSync().errors.email).toBeDefined();
    });

    it('Should fail if role is not in enum', () => {
        const user = new User({
            name: 'User', email: 'user@example.com', password: 'password123', role: 'Hacker'
        });
        expect(user.validateSync().errors.role).toBeDefined();
    });

    it('Should fail if phone format is invalid', () => {
        const user = new User({
            name: 'User', email: 'user@example.com', password: 'password123',
            role: 'SA', phone: '123'
        });
        expect(user.validateSync().errors.phone).toBeDefined();
    });

    it('Should accept valid Vietnam phone +84', () => {
        const user = new User({
            name: 'User', email: 'user@example.com', password: 'password123',
            role: 'SA', phone: '+84901112223'
        });
        expect(user.validateSync()).toBeUndefined();
    });

    it('Should accept empty phone (phone is optional)', () => {
        const user = new User({
            name: 'User', email: 'user@example.com', password: 'password123', role: 'SA'
        });
        expect(user.validateSync()).toBeUndefined();
    });

    it('Should fail if name is not provided', () => {
        const user = new User({ email: 'user@example.com', password: 'password123', role: 'SA' });
        expect(user.validateSync().errors.name).toBeDefined();
    });

    it('Should fail if password is too short', () => {
        const user = new User({
            name: 'User', email: 'user@example.com', password: '123', role: 'SA'
        });
        expect(user.validateSync().errors.password).toBeDefined();
    });

    it('Should default role to Client', () => {
        const user = new User({
            name: 'User', email: 'user@test.com', password: '123456', branch: validBranchId
        });
        expect(user.role).toBe('Client');
    });

    it('Should default status to Active', () => {
        const user = new User({
            name: 'User', email: 'user@test.com', password: '123456', role: 'SA'
        });
        expect(user.status).toBe('Active');
    });

    it('Should default avatar to /images/default-avatar.png', () => {
        const user = new User({
            name: 'User', email: 'user@test.com', password: '123456', role: 'SA'
        });
        expect(user.avatar).toBe('/images/default-avatar.png');
    });

    describe('Password Hashing (pre-save hook)', () => {
        it('correctPassword should return true for matching passwords', async () => {
            const user = new User({
                name: 'Test', email: 'hash@test.com', password: '123456', role: 'SA'
            });
            const hashedPassword = await bcrypt.hash('123456', 12);
            const result = await user.correctPassword('123456', hashedPassword);
            expect(result).toBe(true);
        });

        it('correctPassword should return false for wrong passwords', async () => {
            const user = new User({
                name: 'Test', email: 'hash@test.com', password: '123456', role: 'SA'
            });
            const hashedPassword = await bcrypt.hash('123456', 12);
            const result = await user.correctPassword('wrongpassword', hashedPassword);
            expect(result).toBe(false);
        });
    });
});
