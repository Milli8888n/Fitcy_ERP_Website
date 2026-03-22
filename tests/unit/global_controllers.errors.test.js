const authController = require('../../src/controllers/authController');
const ptController = require('../../src/controllers/ptController');
const metricController = require('../../src/controllers/metricController');
const mealPlanController = require('../../src/controllers/mealPlanController');
const leadController = require('../../src/controllers/leadController');
const userController = require('../../src/controllers/userController');
const User = require('../../src/models/userModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
const Contract = require('../../src/models/contractModel');
const BodyMetric = require('../../src/models/bodyMetricModel');
const MealPlan = require('../../src/models/mealPlanModel');
const Lead = require('../../src/models/leadModel');
const Branch = require('../../src/models/branchModel');
const workoutService = require('../../src/services/workoutService');
const notificationService = require('../../src/services/notificationService');

jest.mock('../../src/models/userModel');
jest.mock('../../src/models/workoutSessionModel');
jest.mock('../../src/models/contractModel');
jest.mock('../../src/models/bodyMetricModel');
jest.mock('../../src/models/mealPlanModel');
jest.mock('../../src/models/leadModel');
jest.mock('../../src/models/branchModel');
jest.mock('../../src/services/workoutService');
jest.mock('../../src/services/notificationService');

describe('Unified Controllers Error Coverage', () => {
    let req, res, next;
    beforeEach(() => {
        req = { params: {}, body: {}, flash: jest.fn(), session: { user: { id: 'u1' } }, logout: jest.fn() };
        res = { render: jest.fn(), redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    describe('authController Error Handling', () => {
        it('login general error should catch', async () => {
            User.findOne.mockReturnValue({ select: jest.fn().mockRejectedValue(new Error('err')) });
            req.body = { email: 'e', password: 'p' };
            await authController.login(req, res);
            expect(req.flash).toHaveBeenCalled();
        });

        it('logout error should log', async () => {
            req.session.destroy = jest.fn(cb => cb(new Error('err')));
            authController.logout(req, res);
            expect(console.error).toHaveBeenCalled();
        });

        it('getProfile error', async () => {
            User.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('err')) });
            await authController.getProfile(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('ptController Error Handling', () => {
        it('checkInSession err', async () => {
            workoutService.ptCheckIn.mockRejectedValue(new Error('service_err'));
            req.body = { latitude: 1, longitude: 1 };
            await ptController.checkInSession(req, res, next);
            expect(req.flash).toHaveBeenCalledWith('error_msg', 'service_err');
        });

        it('checkOutSession err', async () => {
            WorkoutSession.findById.mockRejectedValue(new Error('err'));
            await ptController.checkOutSession(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('metricController Error Handling', () => {
        it('getMyClientsForMetrics err', async () => {
            Contract.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('err')) });
            await metricController.getMyClientsForMetrics(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('getAddMetricForm err', async () => {
            Contract.findOne.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('err')) });
            await metricController.getAddMetricForm(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('saveBodyMetric err', async () => {
            BodyMetric.create.mockRejectedValue(new Error('err'));
            await metricController.saveBodyMetric(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('getMyProgress err', async () => {
            BodyMetric.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('err')) });
            await metricController.getMyProgress(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('mealPlanController Error Handling', () => {
        it('getMyClientsMealPlans err', async () => {
            MealPlan.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockRejectedValue(new Error('err')) });
            await mealPlanController.getMyClientsMealPlans(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('getCreateForm err', async () => {
            Contract.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('err')) });
            await mealPlanController.getCreateForm(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('saveMealPlan err', async () => {
            Contract.findById.mockRejectedValue(new Error('err'));
            await mealPlanController.saveMealPlan(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('leadController Error Handling', () => {
        it('getLandingPage err', async () => {
            Branch.find.mockRejectedValue(new Error('err'));
            await leadController.getLandingPage(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('getAllLeads err', async () => {
            Lead.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockRejectedValue(new Error('err')) });
            await leadController.getAllLeads(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('userController More Error Handling', () => {
        it('getUserList err', async () => {
            User.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockRejectedValue(new Error('err')) });
            await userController.getUserList(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('getEditForm err', async () => {
            User.findById.mockRejectedValue(new Error('err'));
            await userController.getEditForm(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('updateUser err', async () => {
            User.findOne.mockReturnValue(null);
            const mockUser = { save: jest.fn().mockRejectedValue(new Error('err')) };
            User.findById.mockResolvedValue(mockUser);
            await userController.updateUser(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('deleteUser err', async () => {
            User.findByIdAndDelete.mockRejectedValue(new Error('err'));
            await userController.deleteUser(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
