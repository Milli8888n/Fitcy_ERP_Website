const contractController = require('../../src/controllers/contractController');
const Contract = require('../../src/models/contractModel');
const ServicePackage = require('../../src/models/servicePackageModel');
const Branch = require('../../src/models/branchModel');
const User = require('../../src/models/userModel');
const contractService = require('../../src/services/contractService');
const pdfService = require('../../src/services/pdfService');
const driveService = require('../../src/services/driveService');
const notificationService = require('../../src/services/notificationService');

jest.mock('../../src/models/contractModel');
jest.mock('../../src/models/servicePackageModel');
jest.mock('../../src/models/branchModel');
jest.mock('../../src/models/userModel');
jest.mock('../../src/services/contractService');
jest.mock('../../src/services/pdfService');
jest.mock('../../src/services/driveService');
jest.mock('../../src/services/notificationService');

describe('Contract Controller Error Handling', () => {
    let req, res, next;
    beforeEach(() => {
        req = { params: {}, body: {}, flash: jest.fn(), session: { user: { id: 'u1', role: 'Admin' } } };
        res = { render: jest.fn(), redirect: jest.fn(), download: jest.fn() };
        next = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => jest.clearAllMocks());

    it('downloadContract should handle missing contract', async () => {
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null)
        };
        // Mocking the chain: findById().populate().populate().populate()
        // Here we just make populate return the query again, and the final behavior is null
        Contract.findById.mockReturnValue(mockQuery);
        mockQuery.populate.mockReturnValue(mockQuery); // Chainable
        
        // Final call in the async chain (even without .exec, Mongoose queries are thenable)
        mockQuery.then = jest.fn().mockImplementation(cb => cb(null)); 

        await contractController.downloadContract(req, res, next);
        expect(req.flash).toHaveBeenCalledWith('error_msg', 'Không tìm thấy hợp đồng!');
    });

    it('storeContract should handle validation error', async () => {
        contractService.createContract.mockRejectedValue({ name: 'ValidationError', errors: { x: { message: 'msg' } } });
        await contractController.storeContract(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/admin/contracts/create');
    });

    it('storeContract should handle general error', async () => {
        contractService.createContract.mockRejectedValue(new Error('general_err'));
        await contractController.storeContract(req, res, next);
        expect(req.flash).toHaveBeenCalledWith('error_msg', 'general_err');
    });

    it('updateContract should handle validation error', async () => {
        req.params.id = 'c1';
        Contract.findByIdAndUpdate.mockRejectedValue({ name: 'ValidationError', errors: { x: { message: 'msg' } } });
        await contractController.updateContract(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/admin/contracts/edit/c1');
    });

    it('deleteContract should handle missing contract', async () => {
        Contract.findById.mockResolvedValue(null);
        await contractController.deleteContract(req, res, next);
        expect(req.flash).toHaveBeenCalledWith('error_msg', 'Không tìm thấy hợp đồng!');
    });

    it('deleteContract should block non-SA on paid contracts', async () => {
        Contract.findById.mockResolvedValue({ paymentStatus: 'Paid' });
        req.session.user.role = 'Admin';
        await contractController.deleteContract(req, res, next);
        expect(req.flash).toHaveBeenCalledWith('error_msg', expect.any(String));
    });
});
