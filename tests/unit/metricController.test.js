const metricController = require('../../src/controllers/metricController');
const BodyMetric = require('../../src/models/bodyMetricModel');
const Contract = require('../../src/models/contractModel');

describe('Metric Controller', () => {
    const mockRes = () => {
        const res = {};
        res.render = jest.fn().mockReturnValue(res);
        res.redirect = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => jest.restoreAllMocks());

    describe('getMyClientsForMetrics', () => {
        it('Should render pt/metrics/clients', async () => {
            jest.spyOn(Contract, 'find').mockReturnValue({
                populate: jest.fn().mockResolvedValue([])
            });
            
            const req = { session: { user: { id: 'pt123' } } };
            const res = mockRes();
            const next = jest.fn();

            await metricController.getMyClientsForMetrics(req, res, next);
            expect(res.render).toHaveBeenCalled();
        });
    });

    describe('saveBodyMetric', () => {
        it('Should create body metric and redirect with success message', async () => {
            jest.spyOn(BodyMetric, 'create').mockResolvedValue({ id: 'metric123' });
            
            const req = { 
                params: { clientId: 'client123' },
                session: { user: { id: 'pt123' } },
                body: { weight: 75, height: 175 },
                flash: jest.fn()
            };
            const res = mockRes();
            const next = jest.fn();

            await metricController.saveBodyMetric(req, res, next);

            expect(BodyMetric.create).toHaveBeenCalled();
            expect(req.flash).toHaveBeenCalledWith('success_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/pt/metrics');
        });
    });

    describe('getMyProgress', () => {
        it('Should render client/progress', async () => {
            jest.spyOn(BodyMetric, 'find').mockReturnValue({
                sort: jest.fn().mockResolvedValue([])
            });
            
            const req = { session: { user: { id: 'client123' } } };
            const res = mockRes();
            const next = jest.fn();

            await metricController.getMyProgress(req, res, next);
            expect(res.render).toHaveBeenCalled();
        });
    });
});
