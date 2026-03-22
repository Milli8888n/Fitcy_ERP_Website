/**
 * Auth Middleware Unit Tests
 */
describe('Auth Middleware', () => {
    const { protect, restrictTo } = require('../../src/middlewares/authMiddleware');

    const mockRes = () => {
        const res = {};
        res.redirect = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        res.render = jest.fn().mockReturnValue(res);
        return res;
    };

    describe('protect', () => {
        it('Should redirect to /auth/login if no session user', () => {
            const req = { session: {} };
            const res = mockRes();
            const next = jest.fn();
            protect(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
            expect(next).not.toHaveBeenCalled();
        });

        it('Should call next() if session user exists', () => {
            const req = { session: { user: { role: 'Admin' } } };
            const res = mockRes();
            const next = jest.fn();
            protect(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.redirect).not.toHaveBeenCalled();
        });
    });

    describe('restrictTo', () => {
        it('Should call next() if user role is allowed', () => {
            const req = { session: { user: { role: 'Admin' } } };
            const res = mockRes();
            const next = jest.fn();
            restrictTo('Admin', 'Manager')(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('Should return 403 if user role is NOT allowed', () => {
            const req = { session: { user: { role: 'Client' } } };
            const res = mockRes();
            const next = jest.fn();
            restrictTo('Admin', 'Manager')(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.render).toHaveBeenCalledWith('error', expect.objectContaining({ message: expect.any(String) }));
            expect(next).not.toHaveBeenCalled();
        });
    });
});
