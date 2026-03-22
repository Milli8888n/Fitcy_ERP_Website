const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const User = require('../../src/models/userModel');
const Contract = require('../../src/models/contractModel');
const Branch = require('../../src/models/branchModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
require('dotenv').config();

describe('Contract Pause & Check-in Protection', () => {
    let ptToken, ptUser, branch, contract, session;

    beforeAll(async () => {
        if (!process.env.MONGODB_URI) {
            process.env.MONGODB_URI = 'mongodb://localhost:27017/Fitcity';
        }
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
        await Contract.deleteMany({});
        await WorkoutSession.deleteMany({});
        await Branch.deleteMany({});
        await ServicePackage.deleteMany({});

        // Setup environment
        branch = await Branch.create({ name: 'FitCity D1', address: 'D1 HCM', phone: '0123456789', status: 'Open' });
        
        ptUser = await User.create({
            name: 'Coach Test',
            email: 'pt@test.com',
            password: 'password123',
            role: 'PT',
            branch: branch._id,
            status: 'Active'
        });

        const client = await User.create({ 
            name: 'Client Test', 
            email: 'client@test.com', 
            password: 'password123', 
            role: 'Client',
            branch: branch._id
        });
        
        const pkg = await ServicePackage.create({
            name: 'Test Pkg Pause',
            type: 'PT',
            price: 1000,
            sessions: 10,
            duration: 30
        });

        contract = await Contract.create({
            client: client._id,
            pt: ptUser._id,
            branch: branch._id,
            servicePackage: pkg._id,
            sales: ptUser._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            basePrice: 1000,
            totalAmount: 1100,
            contractStatus: 'Paused' // START AS PAUSED
        });

        session = await WorkoutSession.create({
            client: client._id,
            pt: ptUser._id,
            branch: branch._id,
            contract: contract._id,
            scheduledTime: new Date(),
            status: 'Scheduled'
        });

        // Login to get session
        const loginRes = await request(app).post('/auth/login').send({ email: 'pt@test.com', password: 'password123' });
        ptToken = loginRes.header['set-cookie'];
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('Should fail PT Check-in if contract is Paused', async () => {
        const res = await request(app)
            .post(`/pt/sessions/check-in/${session._id}`)
            .set('Cookie', ptToken)
            .send({ latitude: 10.7719, longitude: 106.6983 });

        // Should redirect back with flash message error
        expect(res.status).toBe(302);
        
        // Final state in DB should still be Scheduled
        const updatedSession = await WorkoutSession.findById(session._id);
        expect(updatedSession.status).toBe('Scheduled');
    });

    it('Should allow PT Check-in after contract is resumed (Active)', async () => {
        // Resume contract
        contract.contractStatus = 'Active';
        await contract.save();

        const res = await request(app)
            .post(`/pt/sessions/check-in/${session._id}`)
            .set('Cookie', ptToken)
            .send({ latitude: 10.7719, longitude: 106.6983 });

        expect(res.status).toBe(302);
        
        const updatedSession = await WorkoutSession.findById(session._id);
        expect(updatedSession.status).toBe('In_Progress');
    });
});
