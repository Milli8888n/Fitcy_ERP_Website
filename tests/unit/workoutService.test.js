const workoutService = require('../../src/services/workoutService');
const WorkoutSession = require('../../src/models/workoutSessionModel');

describe('Workout Service - Full Coverage', () => {
    describe('isWithinRange (Geo-fencing)', () => {
        const branchCoords = { lat: 10.7719, lng: 106.6983 };

        it('Should return true if within 500m', () => {
            const ptCoords = { lat: 10.7720, lng: 106.6984 };
            expect(workoutService.isWithinRange(ptCoords, branchCoords, 500)).toBe(true);
        });

        it('Should return false if outside 500m', () => {
            const ptCoords = { lat: 10.8231, lng: 106.6297 };
            expect(workoutService.isWithinRange(ptCoords, branchCoords, 500)).toBe(false);
        });

        it('Should return true for same location (distance = 0)', () => {
            expect(workoutService.isWithinRange(branchCoords, branchCoords, 500)).toBe(true);
        });

        it('Should use default radius of 500m when not specified', () => {
            const ptCoords = { lat: 10.7720, lng: 106.6984 };
            expect(workoutService.isWithinRange(ptCoords, branchCoords)).toBe(true);
        });

        it('Should return true when within custom radius', () => {
            const ptCoords = { lat: 10.7728, lng: 106.6983 };
            expect(workoutService.isWithinRange(ptCoords, branchCoords, 200)).toBe(true);
        });
    });

    describe('validateCheckInLocation', () => {
        it('Should throw error if PT is too far from branch', () => {
            const tooFarCoords = { lat: 0, lng: 0 };
            const branchCoords = { lat: 10, lng: 10 };
            expect(() => {
                workoutService.validateCheckInLocation(tooFarCoords, branchCoords);
            }).toThrow('Bạn đang ở quá xa chi nhánh');
        });

        it('Should return true if PT is within range', () => {
            const closeCoords = { lat: 10.7720, lng: 106.6984 };
            const branchCoords = { lat: 10.7719, lng: 106.6983 };
            expect(workoutService.validateCheckInLocation(closeCoords, branchCoords)).toBe(true);
        });
    });

    describe('ptCheckIn', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(WorkoutSession, 'findOne').mockResolvedValue(null); // Defaults to no double-booking
        });

        it('Should throw if session not found', async () => {
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null)
                })
            });
            await expect(workoutService.ptCheckIn('fakeid', 10, 106)).rejects.toThrow('Buổi tập không tồn tại');
        });

        it('Should throw if PT is too far from branch', async () => {
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue({ _id: 's1', branch: {}, contract: { contractStatus: 'Active' } })
                })
            });
            await expect(workoutService.ptCheckIn('s1', 0, 0)).rejects.toThrow('Bạn đang ở quá xa chi nhánh');
        });

        it('Should handle missing contract status fallback to N/A', async () => {
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue({ _id: 's_no_c', branch: {}, contract: null })
                })
            });
            await expect(workoutService.ptCheckIn('s_no_c', 0, 0)).rejects.toThrow('Hợp đồng đang ở trạng thái: N/A');
        });

        it('Should fallback to default coordinates if branch location missing', async () => {
            const mockSession = {
                _id: 's_no_loc',
                branch: {}, // no location
                contract: { contractStatus: 'Active' },
                startTime: null,
                status: 'Scheduled',
                ptCheckIn: {},
                save: jest.fn().mockResolvedValue(true)
            };
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockSession)
                })
            });
            // Default is 10.77, 106.69. Check-in at 0,0 should still fail distance check but take that path.
            await expect(workoutService.ptCheckIn('s_no_loc', 0, 0)).rejects.toThrow('Bạn đang ở quá xa chi nhánh');
        });

        it('Should update session status to In_Progress on successful check-in', async () => {
            const mockSession = {
                _id: 's1',
                branch: {},
                contract: { contractStatus: 'Active' },
                startTime: null,
                status: 'Scheduled',
                ptCheckIn: {},
                save: jest.fn().mockResolvedValue(true)
            };
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockSession)
                })
            });

            // Coords close to branch (10.7719, 106.6983)
            const result = await workoutService.ptCheckIn('s1', 10.7720, 106.6984);

            expect(result.status).toBe('In_Progress');
            expect(result.startTime).toBeDefined();
            expect(result.ptCheckIn.latitude).toBe(10.7720);
            expect(mockSession.save).toHaveBeenCalled();
        });

        it('Should fallback to default coordinates if branch location is an empty object', async () => {
            const mockSession = {
                _id: 's_empty_loc',
                branch: { location: {} }, // empty location
                contract: { contractStatus: 'Active' }
            };
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockSession)
                })
            });
            await expect(workoutService.ptCheckIn('s_empty_loc', 0, 0)).rejects.toThrow();
        });

        it('Should fallback to default longitude if only latitude is present', async () => {
             const mockSession = {
                _id: 's_lat_only',
                branch: { location: { latitude: 10.123 } },
                contract: { contractStatus: 'Active' }
            };
            jest.spyOn(WorkoutSession, 'findById').mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockSession)
                })
            });
            await expect(workoutService.ptCheckIn('s_lat_only', 0, 0)).rejects.toThrow();
        });
    });
});
