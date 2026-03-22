/**
 * Auth Controller Unit Tests (Mock DB + Session + Flash)
 */
const authController = require('../../src/controllers/authController');
const User = require('../../src/models/userModel');

describe('Auth Controller Unit Tests', () => {

    const mockReq = (body = {}, session = {}) => ({
        body,
        session,
        flash: jest.fn()
    });

    const mockRes = () => {
        const res = {};
        res.redirect = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        res.render = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => jest.restoreAllMocks());

    describe('login', () => {
        it('Should redirect if email missing', async () => {
            const req = mockReq({ email: '', password: '123456' });
            const res = mockRes();
            await authController.login(req, res);
            expect(req.flash).toHaveBeenCalledWith('error_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should redirect if password missing', async () => {
            const req = mockReq({ email: 'test@test.com', password: '' });
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should redirect if user not found', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });
            const req = mockReq({ email: 'noone@test.com', password: '123456' });
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should redirect if password is wrong', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    correctPassword: jest.fn().mockResolvedValue(false),
                    status: 'Active'
                })
            });
            const req = mockReq({ email: 'test@test.com', password: 'wrong' });
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should redirect if user is banned', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    correctPassword: jest.fn().mockResolvedValue(true),
                    status: 'Banned'
                })
            });
            const req = mockReq({ email: 'banned@test.com', password: '123456' });
            const res = mockRes();
            await authController.login(req, res);
            expect(req.flash).toHaveBeenCalledWith('error_msg', expect.stringContaining('khóa'));
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should redirect Admin to /admin', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: 'testid', name: 'Admin', email: 'admin@test.com',
                    role: 'Admin', branch: 'b1', avatar: '/img.png',
                    correctPassword: jest.fn().mockResolvedValue(true),
                    status: 'Active', password: 'hash'
                })
            });
            const req = mockReq({ email: 'admin@test.com', password: '123456' }, {});
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/admin');
        });

        it('Should redirect PT to /pt', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: 'testid', name: 'PT', email: 'pt@test.com',
                    role: 'PT', branch: 'b1', avatar: '/img.png',
                    correctPassword: jest.fn().mockResolvedValue(true),
                    status: 'Active', password: 'hash'
                })
            });
            const req = mockReq({ email: 'pt@test.com', password: '123456' }, {});
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/pt');
        });

        it('Should redirect Client to /client', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: 'testid', name: 'Client', email: 'c@test.com',
                    role: 'Client', branch: 'b1', avatar: '/img.png',
                    correctPassword: jest.fn().mockResolvedValue(true),
                    status: 'Active', password: 'hash'
                })
            });
            const req = mockReq({ email: 'c@test.com', password: '123456' }, {});
            const res = mockRes();
            await authController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/client');
        });

        it('Should handle DB error gracefully', async () => {
            jest.spyOn(User, 'findOne').mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('DB Error'))
            });
            const req = mockReq({ email: 'x@x.com', password: '123456' });
            const res = mockRes();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await authController.login(req, res);
            expect(req.flash).toHaveBeenCalledWith('error_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
            consoleSpy.mockRestore();
        });
    });

    describe('logout', () => {
        it('Should destroy session and redirect', () => {
            const req = {
                session: {
                    destroy: jest.fn(cb => cb(null))
                }
            };
            const res = mockRes();
            authController.logout(req, res);
            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('Should handle destroy error gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const req = {
                session: {
                    destroy: jest.fn(cb => cb(new Error('Session Error')))
                }
            };
            const res = mockRes();
            authController.logout(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
            consoleSpy.mockRestore();
        });
    });

    describe('getProfile', () => {
        it('Should render profile with user data', async () => {
            jest.spyOn(User, 'findById').mockReturnValue({
                populate: jest.fn().mockResolvedValue({ name: 'User', email: 'u@test.com' })
            });
            const req = { session: { user: { id: 'testid' } } };
            const res = mockRes();
            await authController.getProfile(req, res);
            expect(res.render).toHaveBeenCalledWith('profile', expect.objectContaining({ user: expect.any(Object) }));
        });

        it('Should handle error in getProfile', async () => {
            jest.spyOn(User, 'findById').mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('DB Error'))
            });
            const req = { session: { user: { id: 'testid' } } };
            const res = mockRes();
            await authController.getProfile(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('error', expect.any(Object));
        });
    });
});
