
/**
 * BỘ TEST CASE TÍCH HỢP: TƯƠNG TÁC PT & CLIENT (FITCITY)
 * Bao gồm các trường hợp chuẩn và trường hợp biên (Edge Cases)
 */
const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = require('../../src/app');
const User = require('../../src/models/userModel');
const Branch = require('../../src/models/branchModel');
const Contract = require('../../src/models/contractModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
const MealPlan = require('../../src/models/mealPlanModel');

describe('Full PT-Client Interaction Suite', () => {
    let pt, client, otherPt, branch, contract, activeSession, pausedContract, exhaustedContract;
    let ptCookie, clientCookie, otherPtCookie, ptId, clientId, otherPtId;

    beforeAll(async () => {
        try {
            // Kết nối DB và chuẩn bị dữ liệu mẫu
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Fitcity');
            }

            // 1. Dọn dẹp dữ liệu cũ của test (Dựa trên Hash vì Email đã bị mã hoá)
            const { hash } = require('../../src/utils/encryption');
            const ptEmail = 'pt_test_flow@fitcity.com';
            const clientEmail = 'client_test_flow@fitcity.com';
            const otherPtEmail = 'other_pt_test_flow@fitcity.com';

            await User.deleteMany({ emailHash: { $in: [hash(ptEmail), hash(clientEmail), hash(otherPtEmail)] } });
            await Branch.deleteMany({ name: 'Test Branch Flow' });
            await ServicePackage.deleteMany({ name: 'Test Pack Flow' });

            // 2. Thiết lập Chi nhánh (Toạ độ Quận 1)
            branch = await Branch.create({
                name: 'Test Branch Flow',
                location: { latitude: 10.7719, longitude: 106.6983 },
                address: '123 District 1',
                phone: '0901234567',
                status: 'Open'
            });

            // 3. Thiết lập PT và Client
            pt = await User.create({ name: 'PT Master', email: ptEmail, password: 'password123', role: 'PT', branch: branch._id, status: 'Active' });
            otherPt = await User.create({ name: 'Other PT', email: otherPtEmail, password: 'password123', role: 'PT', branch: branch._id, status: 'Active' });
            client = await User.create({ name: 'VIP Client', email: clientEmail, password: 'password123', role: 'Client', branch: branch._id, status: 'Active' });

            ptId = pt._id;
            clientId = client._id;
            otherPtId = otherPt._id;

            const pkg = await ServicePackage.create({ name: 'Test Pack Flow', type: 'PT', price: 1000000, duration: 30, sessions: 10 });

            // 4. Các loại Hợp đồng (Active, Paused, Exhausted)
            contract = await Contract.create({ 
                client: clientId, pt: ptId, branch: branch._id, servicePackage: pkg._id, 
                remainingSessions: 10, totalSessions: 10, contractStatus: 'Active', paymentStatus: 'Paid',
                startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
                totalAmount: 1000000, basePrice: 1000000, paidAmount: 1000000, sales: ptId
            });

            pausedContract = await Contract.create({ 
                client: clientId, pt: ptId, branch: branch._id, servicePackage: pkg._id, 
                remainingSessions: 5, totalSessions: 10, contractStatus: 'Paused', paymentStatus: 'Paid',
                startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
                totalAmount: 1000000, basePrice: 1000000, paidAmount: 1000000, sales: ptId
            });

            exhaustedContract = await Contract.create({ 
                client: clientId, pt: ptId, branch: branch._id, servicePackage: pkg._id, 
                remainingSessions: 0, totalSessions: 10, contractStatus: 'Active', paymentStatus: 'Paid',
                startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
                totalAmount: 1000000, basePrice: 1000000, paidAmount: 1000000, sales: ptId
            });

            // 5. Buổi tập mẫu
            activeSession = await WorkoutSession.create({ client: clientId, pt: ptId, contract: contract._id, branch: branch._id, scheduledTime: new Date(), status: 'Scheduled' });

            // 6. Đăng nhập để lấy cookies
            const ptLogin = await request(app).post('/auth/login').send({ email: ptEmail, password: 'password123' });
            ptCookie = ptLogin.headers['set-cookie'];

            const clientLogin = await request(app).post('/auth/login').send({ email: clientEmail, password: 'password123' });
            clientCookie = clientLogin.headers['set-cookie'];

            const otherPtLogin = await request(app).post('/auth/login').send({ email: otherPtEmail, password: 'password123' });
            otherPtCookie = otherPtLogin.headers['set-cookie'];

        } catch (error) {
            console.error('❌ SETUP ERROR:', error);
            throw error;
        }
    });

    afterAll(async () => {
        // Cleanup and close
        await User.deleteMany({ email: /test_flow@fitcity/ });
        await Branch.deleteMany({ name: 'Test Branch Flow' });
        await ServicePackage.deleteMany({ name: 'Test Pack Flow' });
        await Contract.deleteMany({ _id: { $in: [contract._id, pausedContract._id, exhaustedContract._id] } });
        await WorkoutSession.deleteMany({ $or: [{ pt: ptId }, { client: clientId }] });
        await MealPlan.deleteMany({ pt: ptId });
        await mongoose.connection.close();
    });

    // --- NHÓM 1: LUỒNG ĐIỂM DANH (ATTENDANCE) ---
    describe('1. Attendance Flows', () => {
        
        test('TC-01: PT Check-In thành công khi ở đúng vị trí (GPS OK)', async () => {
            const res = await request(app)
                .post(`/pt/sessions/check-in/${activeSession._id}`)
                .set('Cookie', ptCookie)
                .send({ latitude: 10.7719, longitude: 106.6983 });
            
            expect(res.statusCode).toBe(302); // Redirect về /pt
            const session = await WorkoutSession.findById(activeSession._id);
            expect(session.status).toBe('In_Progress');
        });

        test('TC-05: PT Check-In thất bại khi ở quá xa chi nhánh (>500m)', async () => {
            const farSession = await WorkoutSession.create({ client: clientId, pt: ptId, contract: contract._id, branch: branch._id, scheduledTime: new Date(), status: 'Scheduled' });
            const res = await request(app)
                .post(`/pt/sessions/check-in/${farSession._id}`)
                .set('Cookie', ptCookie)
                .send({ latitude: 12.0, longitude: 108.0 }); // Vị trí giả lập ở xa
            
            expect(res.statusCode).toBe(302);
            const session = await WorkoutSession.findById(farSession._id);
            expect(session.status).toBe('Scheduled'); // Không đổi vì middleware chặn
        });

        test('TC-09: Chặn Check-In khi hợp đồng đang bị BẢO LƯU (Paused)', async () => {
            const pausedSession = await WorkoutSession.create({ client: clientId, pt: ptId, contract: pausedContract._id, branch: branch._id, scheduledTime: new Date(), status: 'Scheduled' });
            const res = await request(app)
                .post(`/pt/sessions/check-in/${pausedSession._id}`)
                .set('Cookie', ptCookie)
                .send({ latitude: 10.7719, longitude: 106.6983 });
            
            const session = await WorkoutSession.findById(pausedSession._id);
            expect(session.status).toBe('Scheduled'); // Không đổi
        });

        test('TC-02: PT Check-Out và hệ thống tính toán thời gian, trừ buổi tập', async () => {
            const res = await request(app)
                .post(`/pt/sessions/check-out/${activeSession._id}`)
                .set('Cookie', ptCookie);
            
            expect(res.statusCode).toBe(302);
            const session = await WorkoutSession.findById(activeSession._id);
            expect(session.status).toBe('Completed');
            expect(session.endTime).toBeDefined();
            
            const updatedContract = await Contract.findById(contract._id);
            expect(updatedContract.remainingSessions).toBe(9); // 10 - 1 = 9
        });
    });

    // --- NHÓM 2: LUỒNG DINH DƯỠNG (MEAL PLAN) ---
    describe('2. Meal Plan Flows', () => {
        test('TC-11: PT tạo thực đơn mới cho học viên', async () => {
            const res = await request(app)
                .post('/pt/meal-plans/store')
                .set('Cookie', ptCookie)
                .send({
                    contractId: contract._id,
                    goal: 'Muscle Gain',
                    calories: 2500,
                    protein: 40,
                    carbs: 40,
                    fat: 20,
                    mealsJson: JSON.stringify([
                        { time: 'Bữa sáng', foodItems: [{ name: 'Trứng, Yến mạch', quantity: '200g', calories: 450 }] },
                        { time: 'Bữa trưa', foodItems: [{ name: 'Bò bít tết', quantity: '300g', calories: 600 }] }
                    ])
                });
            
            expect(res.statusCode).toBe(302);
            const mp = await MealPlan.findOne({ contract: contract._id });
            expect(mp).toBeDefined();
            expect(mp.dailyCalories).toBe(2500);
        });

        test('TC-12: Hội viên truy cập Dashboard thấy báo cáo dinh dưỡng', async () => {
            const res = await request(app)
                .get('/client/nutrition')
                .set('Cookie', clientCookie);
            
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('Muscle Gain');
        });
    });

    // --- NHÓM 3: LUỒNG TRẠNG THÁI BIÊN (EDGE CASES) ---
    describe('3. Edge Cases & Constraints', () => {
        test('TC-10: Chặn Check-In khi khách hàng hết buổi tập (Remaining = 0)', async () => {
            const lastSession = await WorkoutSession.create({ client: clientId, pt: ptId, contract: exhaustedContract._id, branch: branch._id, scheduledTime: new Date(), status: 'Scheduled' });
            
            const res = await request(app)
                .post(`/pt/sessions/check-in/${lastSession._id}`)
                .set('Cookie', ptCookie)
                .send({ latitude: 10.7719, longitude: 106.6983 });
            
            const session = await WorkoutSession.findById(lastSession._id);
            expect(session.status).toBe('Scheduled'); // Bị chặn bởi contract checks
        });

        test('TC-14: PT khác không được sửa thực đơn khách hàng không phải của mình', async () => {
            // Thử lấy form tạo thực đơn cho client này bằng tài khoản otherPt
            const res = await request(app)
                .get('/pt/meal-plans/create')
                .set('Cookie', otherPtCookie);
            
            // Other PT sẽ không thấy contract của client này trong list contracts được gán
            expect(res.text).not.toContain(clientId.toString());
        });
    });
});
