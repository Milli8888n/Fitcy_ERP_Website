const homeController = require('../../src/controllers/homeController');
const Contract = require('../../src/models/contractModel');
const User = require('../../src/models/userModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
const MealPlan = require('../../src/models/mealPlanModel');
const Expense = require('../../src/models/expenseModel');

describe('Home Controller Error Coverage', () => {
    let req, res, next;

    beforeEach(() => {
        req = { session: { user: { id: 'test_id' } }, flash: jest.fn() };
        res = { render: jest.fn(), redirect: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it('getAdminDashboard should handle errors', async () => {
        jest.spyOn(Contract, 'aggregate').mockRejectedValue(new Error('DB Error'));
        await homeController.getAdminDashboard(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getPtDashboard should handle errors', async () => {
        jest.spyOn(WorkoutSession, 'find').mockImplementation(() => ({
            populate: jest.fn().mockRejectedValue(new Error('DB Error'))
        }));
        await homeController.getPtDashboard(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getClientDashboard should handle errors', async () => {
        jest.spyOn(Contract, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockRejectedValue(new Error('DB Error'))
        }));
        await homeController.getClientDashboard(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('getClientNutrition should handle errors', async () => {
        jest.spyOn(MealPlan, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockRejectedValue(new Error('DB Error'))
        }));
        await homeController.getClientNutrition(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
