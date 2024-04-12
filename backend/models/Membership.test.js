const Membership = require('./Membership');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Membership Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserIdAndClubId', () => {
    it('should find a membership by user ID and club ID', async () => {
      const mockMembership = { userid: '1', clubid: '1' };
      pool.query.mockResolvedValue({ rows: [mockMembership] });

      const membership = await Membership.findByUserIdAndClubId('1', '1');

      expect(membership).toEqual(mockMembership);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['1', '1']);
    });
  });

  describe('findByUserId', () => {
    it('should find all memberships for a given user ID', async () => {
      const mockMemberships = [{ userid: '1', clubid: '1' }, { userid: '1', clubid: '2' }];
      pool.query.mockResolvedValue({ rows: mockMemberships });

      const memberships = await Membership.findByUserId('1');

      expect(memberships).toEqual(mockMemberships);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['1']);
    });
  });

  describe('create', () => {
    it('should create a new membership', async () => {
      const newMembership = { userid: '2', clubid: '2', joindate: '2023-01-01' };
      pool.query.mockResolvedValue({ rows: [newMembership] });

      const membership = await Membership.create(newMembership);

      expect(membership).toEqual(newMembership);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['2', '2', '2023-01-01']);
    });
  });

  describe('remove', () => {
    it('should remove a membership and return true on success', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: '1', userid: '1', clubid: '1' }] });

      const success = await Membership.remove('1', '1');

      expect(success).toBeTruthy();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['1', '1']);
    });

    it('should return false if no membership was removed', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const success = await Membership.remove('1', 'nonexistentClubId');

      expect(success).toBeFalsy();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['1', 'nonexistentClubId']);
    });
  });
});
