const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Contract = require('../../src/models/contractModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const Branch = require('../../src/models/branchModel');
const User = require('../../src/models/userModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

describe('Contract & Billing Controller Integration', () => {

    let adminCookie;
    let mockClient, mockPackage, mockBranch, mockSales, mockPt;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
        
        // Clean old data
        await Contract.deleteMany({});
        await ServicePackage.deleteMany({ name: /^TEST_PKG_BILL_/ });
        await Branch.deleteMany({ name: /^TEST_BR_BILL_/ });
        await User.deleteMany({ email: /@testbill\.com$/ });

        mockBranch = await Branch.create({ name: 'TEST_BR_BILL_1', address: '123 ABC', phone: '0901234567' });

        // Create Mocks (Mandatory branch for non-SA/Admin)
        mockClient = await User.create({ name: 'Client Bill', email: 'client@testbill.com', password: 'password123', role: 'Client', status: 'Active', branch: mockBranch._id });
        mockSales = await User.create({ name: 'Sales Bill', email: 'sales@testbill.com', password: 'password123', role: 'Sales', status: 'Active', branch: mockBranch._id });
        mockPt = await User.create({ name: 'PT Bill', email: 'pt@testbill.com', password: 'password123', role: 'PT', status: 'Active', branch: mockBranch._id });
        
        const adminUser = await User.create({ name: 'Admin Bill', email: 'admin@testbill.com', password: 'password123', role: 'Admin', status: 'Active' });
        
        mockPackage = await ServicePackage.create({ name: 'TEST_PKG_BILL_1', type: 'Gym', price: 1000000, duration: 30, description: 'Desc' });

        // Authenticate as Admin
        const res = await request(app).post('/auth/login').send({ email: 'admin@testbill.com', password: 'password123' });
        adminCookie = res.headers['set-cookie'];
    });

    afterAll(async () => {
        await Contract.deleteMany({});
        await ServicePackage.deleteMany({ name: /^TEST_PKG_BILL_/ });
        await Branch.deleteMany({ name: /^TEST_BR_BILL_/ });
        await User.deleteMany({ email: /@testbill\.com$/ });
        await mongoose.connection.close();
    });

    describe('GET /admin/contracts/list', () => {
        it('Should render the contract list table', async () => {
            const res = await request(app).get('/admin/contracts/list').set('Cookie', adminCookie);
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('Doanh thu & Hợp đồng Hội viên');
        });
    });

    describe('GET /admin/contracts/create', () => {
        it('Should render form with predefined dropdown options', async () => {
            const res = await request(app).get('/admin/contracts/create').set('Cookie', adminCookie);
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('Client Bill');
            expect(res.text).toContain('TEST_PKG_BILL_1');
        });
    });

    describe('POST /admin/contracts/store', () => {
        it('Should create a contract, calculate VAT, and handle Paid status', async () => {
            const res = await request(app)
                .post('/admin/contracts/store')
                .set('Cookie', adminCookie)
                .send({
                    client: mockClient._id,
                    servicePackage: mockPackage._id,
                    branch: mockBranch._id,
                    sales: mockSales._id,
                    pt: mockPt._id,
                    discount: 100000, // discount 100k
                    paymentStatus: 'Paid',
                    paymentMethods: 'Cash'
                });

            expect(res.statusCode).toBe(302);
            expect(res.header.location).toBe('/admin/contracts/list');

            const contract = await Contract.findOne({ client: mockClient._id });
            expect(contract).not.toBeNull();
            
            // Formula Test: Package Price = 1,000,000. Discount = 100,000.
            // After discount = 900,000. VAT 10% = 90,000. Total = 990,000.
            expect(contract.totalAmount).toBe(990000);
            expect(contract.paymentStatus).toBe('Paid');
            expect(contract.paidAmount).toBe(990000); // Fully paid updates paidAmount
            expect(contract.contractStatus).toBe('Active'); // Paid makes it Active immediately
        });

        it('Should redirect back on missing client id (Validation Failure)', async () => {
            const res = await request(app)
                .post('/admin/contracts/store')
                .set('Cookie', adminCookie)
                .send({
                    servicePackage: mockPackage._id,
                    branch: mockBranch._id,
                    sales: mockSales._id
                }); // Missing client
            expect(res.statusCode).toBe(302);
            expect(res.header.location).toBe('/admin/contracts/create');
        });
    });

    describe('GET /admin/contracts/edit/:id', () => {
        it('Should load edit form for an existing contract', async () => {
            const c = await Contract.findOne({ client: mockClient._id });
            const res = await request(app).get(`/admin/contracts/edit/${c._id}`).set('Cookie', adminCookie);
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('Cập nhật Thanh toán');
        });
    });

    describe('POST /admin/contracts/update/:id', () => {
        it('Should update payment status from Unpaid to Paid and auto sync paidAmount', async () => {
            // Create a fake Unpaid contract
            const unpaid = await Contract.create({
                client: mockClient._id,
                servicePackage: mockPackage._id,
                branch: mockBranch._id,
                sales: mockSales._id,
                totalAmount: 1100000,
                basePrice: 1000000,
                discount: 0,
                vat: 10,
                paymentStatus: 'Unpaid',
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            const res = await request(app)
                .post(`/admin/contracts/update/${unpaid._id}`)
                .set('Cookie', adminCookie)
                .send({ paymentStatus: 'Paid' });

            expect(res.statusCode).toBe(302);
            expect(res.header.location).toBe('/admin/contracts/list');

            const check = await Contract.findById(unpaid._id);
            expect(check.paymentStatus).toBe('Paid');
            expect(check.paidAmount).toBe(1100000); // Should auto sync
            expect(check.contractStatus).toBe('Active');
        });
    });

    describe('POST /admin/contracts/delete/:id', () => {
        it('Should prevent non-SA users from deleting a Paid contract', async () => {
            // Because adminCookie belongs to 'Admin' and not 'SA'
            const c = await Contract.findOne({ paymentStatus: 'Paid' });
            const res = await request(app).post(`/admin/contracts/delete/${c._id}`).set('Cookie', adminCookie);
            
            expect(res.statusCode).toBe(302);
            expect(res.header.location).toBe('/admin/contracts/list'); // Redirected with error flash
            
            const check = await Contract.findById(c._id);
            expect(check).not.toBeNull(); // Should not be deleted
        });

        it('Should allow Admin to delete an Unpaid contract', async () => {
            const unpaid = await Contract.create({
                client: mockClient._id,
                servicePackage: mockPackage._id,
                branch: mockBranch._id,
                sales: mockSales._id,
                totalAmount: 1100000,
                basePrice: 1000000,
                paymentStatus: 'Unpaid',
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            const res = await request(app).post(`/admin/contracts/delete/${unpaid._id}`).set('Cookie', adminCookie);
            expect(res.statusCode).toBe(302);
            
            const check = await Contract.findById(unpaid._id);
            expect(check).toBeNull(); // Successfully deleted
        });
    });
});
