const BookClub = require('./BookClub');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('BookClub Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new book club and return its details', async () => {
      const mockBookClub = {
        clubName: 'Book Club 1',
        description: 'A book club for testing',
        clubType: 'Online',
        state: '',
        city: '',
        clubPrivacy: true,
        adminUserID: '1',
      };
      const mockResult = { ...mockBookClub, clubid: '123', createddate: '2021-01-01' };
      pool.query.mockResolvedValue({ rows: [mockResult] });

      const result = await BookClub.create(mockBookClub);

      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
    });

  });

  describe('findAll', () => {
    it('should return all public book clubs', async () => {
      const mockBookClubs = [
        { clubid: '123', clubName: 'Public Club 1', clubprivacy: true },
        { clubid: '456', clubName: 'Public Club 2', clubprivacy: true },
      ];
      pool.query.mockResolvedValue({ rows: mockBookClubs });

      const result = await BookClub.findAll();

      expect(result).toEqual(mockBookClubs);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

  });

  describe('findByAdminUserId', () => {
    it('should return book clubs managed by a specific admin user ID', async () => {
      const mockAdminUserId = '1';
      const mockBookClubs = [
        { clubid: '123', adminuserid: mockAdminUserId, clubName: 'Admin Club 1' },
        { clubid: '456', adminuserid: mockAdminUserId, clubName: 'Admin Club 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockBookClubs });

      const result = await BookClub.findByAdminUserId(mockAdminUserId);

      expect(result).toEqual(mockBookClubs);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockAdminUserId]);
    });
  });

  describe('findById', () => {
    it('should return a book club by its ID', async () => {
      const mockClubId = '123';
      const mockBookClub = { clubid: mockClubId, clubName: 'Specific Club', clubprivacy: true };
      pool.query.mockResolvedValue({ rows: [mockBookClub] });

      const result = await BookClub.findById(mockClubId);

      expect(result).toEqual(mockBookClub);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockClubId]);
    });
  });

  describe('findByState', () => {
    it('should return book clubs located in a specific state', async () => {
      const mockState = 'CA';
      const mockBookClubs = [
        { clubid: '123', state: mockState, clubName: 'State Club 1' },
        { clubid: '456', state: mockState, clubName: 'State Club 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockBookClubs });

      const result = await BookClub.findByState(mockState);

      expect(result).toEqual(mockBookClubs);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockState]);
    });
  });

  describe('findByUserId', () => {
    it('should return book clubs related to a specific user ID', async () => {
      const mockUserId = '1';
      const mockBookClubs = [
        { clubid: '123', adminuserid: mockUserId, clubName: 'User Club 1' },
        { clubid: '456', member: mockUserId, clubName: 'User Club 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockBookClubs });

      const result = await BookClub.findByUserId(mockUserId);

      expect(result).toEqual(mockBookClubs);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockUserId]);
    });
  });

  describe('update', () => {
    it('should update a book club\'s meeting info and announcements', async () => {
      const mockClubId = '123';
      const updates = { meetinginfo: 'New meeting info', announcements: 'New announcements' };
      const mockUpdatedClub = { ...updates, clubid: mockClubId };
      pool.query.mockResolvedValue({ rows: [mockUpdatedClub] });

      const result = await BookClub.update(mockClubId, updates);

      expect(result).toEqual(mockUpdatedClub);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockClubId, updates.meetinginfo, updates.announcements]);
    });
  });

});

