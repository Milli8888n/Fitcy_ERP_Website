const leadController = require('../../src/controllers/leadController');
const Lead = require('../../src/models/leadModel');
const Branch = require('../../src/models/branchModel');

describe('Lead Controller', () => {
    const mockRes = () => {
        const res = {};
        res.render = jest.fn().mockReturnValue(res);
        res.redirect = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => jest.restoreAllMocks());

    describe('getLandingPage', () => {
        it('Should render landing page with branches', async () => {
            jest.spyOn(Branch, 'find').mockResolvedValue([{ name: 'Branch 1' }]);
            
            const req = { flash: jest.fn().mockReturnValue([]) };
            const res = mockRes();
            const next = jest.fn();

            await leadController.getLandingPage(req, res, next);

            expect(res.render).toHaveBeenCalledWith('landing', expect.objectContaining({
                branches: expect.any(Array)
            }));
        });
    });

    describe('registerLead', () => {
        it('Should create a lead and redirect with success message', async () => {
            jest.spyOn(Lead, 'create').mockResolvedValue({ id: 'lead123' });
            
            const req = { 
                body: { name: 'John', phone: '0912345678', branchId: '507f1f77bcf86cd799439011' },
                flash: jest.fn()
            };
            const res = mockRes();
            const next = jest.fn();

            await leadController.registerLead(req, res, next);

            expect(Lead.create).toHaveBeenCalled();
            expect(req.flash).toHaveBeenCalledWith('success_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/#trial');
        });
    });

    describe('getAllLeads', () => {
        it('Should render leads list for admin', async () => {
            jest.spyOn(Lead, 'find').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue([])
                })
            });
            
            const req = {};
            const res = mockRes();
            const next = jest.fn();

            await leadController.getAllLeads(req, res, next);

            expect(res.render).toHaveBeenCalledWith('admin/leads/list', expect.objectContaining({
                leads: [],
                activePage: 'leads'
            }));
        });
    });
});
