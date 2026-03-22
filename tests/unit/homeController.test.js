/**
 * Home Controller Unit Tests (Mock DB calls)
 */
const homeController = require('../../src/controllers/homeController');
const Contract = require('../../src/models/contractModel');
const WorkoutSession = require('../../src/models/workoutSessionModel');
const User = require('../../src/models/userModel');
const Expense = require('../../src/models/expenseModel');
const MealPlan = require('../../src/models/mealPlanModel');

describe('Home Controller', () => {

    const mockRes = () => {
        const res = {};
        res.render = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => jest.restoreAllMocks());

    describe('getAdminDashboard', () => {
        it('Should render admin/dashboard with correct data', async () => {
            jest.spyOn(Contract, 'aggregate')
                .mockResolvedValueOnce([{ _id: null, total: 50000000 }])
                .mockResolvedValueOnce([{ _id: null, totalPending: 5000000 }]);
            jest.spyOn(Expense, 'aggregate')
                .mockResolvedValueOnce([{ _id: null, total: 10000000 }]);
            jest.spyOn(User, 'countDocuments').mockResolvedValue(120);
            jest.spyOn(WorkoutSession, 'countDocuments').mockResolvedValue(45);
            jest.spyOn(Contract, 'find').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        sort: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });
            jest.spyOn(WorkoutSession, 'aggregate').mockResolvedValue([]);

            const req = {};
            const res = mockRes();
            const next = jest.fn();

            await homeController.getAdminDashboard(req, res, next);

            expect(res.render).toHaveBeenCalledWith('admin/dashboard', expect.objectContaining({
                totalRevenue: 50000000,
                pendingReceivables: 5000000,
                activeMembers: 120,
                sessionsToday: 45,
                pendingContracts: [],
                activePage: 'dashboard'
            }));
        });

        it('Should call next(error) on DB failure', async () => {
            jest.spyOn(Contract, 'aggregate').mockRejectedValue(new Error('DB Down'));

            const req = {};
            const res = mockRes();
            const next = jest.fn();

            await homeController.getAdminDashboard(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getClientDashboard', () => {
        it('Should render client/dashboard', async () => {
            const req = { session: { user: { id: 'client123' } } };
            const res = mockRes();
            const next = jest.fn();

            jest.spyOn(Contract, 'findOne').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue({ remainingSessions: 10, totalSessions: 22, servicePackage: { name: 'Premium' } })
                })
            });
            jest.spyOn(WorkoutSession, 'countDocuments').mockResolvedValue(12);
            jest.spyOn(WorkoutSession, 'findOne').mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });
            jest.spyOn(MealPlan, 'findOne').mockReturnValue({
                sort: jest.fn().mockResolvedValue(null)
            });

            await homeController.getClientDashboard(req, res, next);
            
            expect(res.render).toHaveBeenCalledWith('client/dashboard', expect.objectContaining({
                sessionsCompleted: 12,
                totalSessions: 22 // 10 remaining + 12 completed
            }));
        });

        it('Should call next(error) on failure', async () => {
            const req = { session: { user: { id: 'client123' } } };
            const res = { render: jest.fn(() => { throw new Error('Render failed'); }) };
            const next = jest.fn();
            
            jest.spyOn(Contract, 'findOne').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(null)
                })
            });
            jest.spyOn(WorkoutSession, 'countDocuments').mockResolvedValue(0);

            await homeController.getClientDashboard(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getPtDashboard', () => {
        it('Should render pt/dashboard', async () => {
            const req = { session: { user: { id: 'pt123' } } };
            const res = mockRes();
            const next = jest.fn();

            jest.spyOn(WorkoutSession, 'find').mockReturnValue({
                populate: jest.fn().mockResolvedValue([])
            });
            jest.spyOn(WorkoutSession, 'countDocuments').mockResolvedValue(5);
            jest.spyOn(User, 'findById').mockResolvedValue({ ptCommissionPerSession: 100000 });

            await homeController.getPtDashboard(req, res, next);
            
            expect(res.render).toHaveBeenCalledWith('pt/dashboard', expect.objectContaining({
                estimatedCommission: 500000, // 5 * 100000
                rosterCount: 0
            }));
        });
    });

    describe('getClientNutrition', () => {
        it('Should render client/nutrition', async () => {
            const req = { session: { user: { id: 'client123' } } };
            const res = mockRes();
            const next = jest.fn();
            jest.spyOn(MealPlan, 'findOne').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(null)
                })
            });
            await homeController.getClientNutrition(req, res, next);
            expect(res.render).toHaveBeenCalledWith('client/nutrition', expect.any(Object));
        });
    });
});
