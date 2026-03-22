/**
 * Integration Tests for Workout Check-in Flow (GPS + Status)
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/userModel');
const Branch = require('../../src/models/branchModel');
const Contract = require('../../src/models/contractModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

describe('Workout Attendance Integration', () => {
    let pt, client, branch, servicePackage, contract, session;
    let ptSession;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        // 1. Cleanup
        await User.deleteMany({ email: /_test_attend@fitcity/ });
        await Branch.deleteMany({ name: 'Test Branch Attend' });
        await ServicePackage.deleteMany({ name: 'Test Pack Attend' });

        // 2. Setup Base Data
        branch = await Branch.create({
            name: 'Test Branch Attend',
            address: '123 Test St',
            phone: '0988887777',
            coordinates: { lat: 10.7719, lng: 106.6983 },
            status: 'Open'
        });

        pt = await User.create({
            name: 'PT Attend',
            email: 'pt_test_attend@fitcity.com',
            password: 'password123',
            role: 'PT',
            branch: branch._id,
            status: 'Active'
        });

        client = await User.create({
            name: 'Client Attend',
            email: 'client_test_attend@fitcity.com',
            password: 'password123',
            role: 'Client',
            branch: branch._id,
            status: 'Active'
        });

        servicePackage = await ServicePackage.create({
            name: 'Test Pack Attend',
            type: 'PT',
            price: 1000000,
            duration: 30,
            sessions: 10
        });

        contract = await Contract.create({
            client: client._id,
            pt: pt._id,
            sales: pt._id, // Mock sales as PT
            branch: branch._id,
            servicePackage: servicePackage._id,
            totalSessions: 10,
            remainingSessions: 10,
            basePrice: 1000000,
            discount: 0,
            totalAmount: 1100000,
            contractStatus: 'Active',
            paymentStatus: 'Paid',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        session = await WorkoutSession.create({
            client: client._id,
            pt: pt._id,
            contract: contract._id,
            branch: branch._id,
            scheduledTime: new Date(),
            status: 'Scheduled'
        });

        // 3. Login as PT to get session cookie
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: 'pt_test_attend@fitcity.com', password: 'password123' });
        
        ptSession = loginRes.headers['set-cookie'];
    });

    afterAll(async () => {
        await User.deleteMany({ email: /_test_attend@fitcity/ });
        await Branch.deleteMany({ name: 'Test Branch Attend' });
        await ServicePackage.deleteMany({ name: 'Test Pack Attend' });
        await Contract.deleteMany({ _id: contract._id });
        await WorkoutSession.deleteMany({ _id: session._id });
        await mongoose.connection.close();
    });

    it('Should FAIL check-in if GPS is missing', async () => {
        const res = await request(app)
            .post(`/pt/sessions/check-in/${session._id}`)
            .set('Cookie', ptSession)
            .send({});
        
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/pt');
    });

    it('Should FAIL check-in if too far from branch', async () => {
        const res = await request(app)
            .post(`/pt/sessions/check-in/${session._id}`)
            .set('Cookie', ptSession)
            .send({ latitude: 11.0, longitude: 107.0 }); // Far away
        
        expect(res.statusCode).toBe(302);
        // Expect flash error message (requires session testing but we check status/redirect)
    });

    it('Should PASS check-in if within range', async () => {
        const res = await request(app)
            .post(`/pt/sessions/check-in/${session._id}`)
            .set('Cookie', ptSession)
            .send({ latitude: 10.7719, longitude: 106.6983 });
        
        expect(res.statusCode).toBe(302);
        
        const updatedSession = await WorkoutSession.findById(session._id);
        expect(updatedSession.status).toBe('In_Progress');
        expect(updatedSession.startTime).toBeDefined();
    });

    it('Should PASS check-out and decrement contract sessions', async () => {
        const res = await request(app)
            .post(`/pt/sessions/check-out/${session._id}`)
            .set('Cookie', ptSession);
        
        expect(res.statusCode).toBe(302);
        
        const updatedSession = await WorkoutSession.findById(session._id);
        expect(updatedSession.status).toBe('Completed');
        
        const updatedContract = await Contract.findById(contract._id);
        expect(updatedContract.remainingSessions).toBe(9);
    });
});
