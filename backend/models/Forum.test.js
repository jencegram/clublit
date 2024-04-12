const Forum = require('./Forum');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Forum Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a forum into the database and return the created forum', async () => {
      const mockForum = { clubId: '1', title: 'New Forum', description: 'Description of the new forum', isAdminOnly: false };
      pool.query.mockResolvedValue({ rows: [mockForum] });

      const result = await Forum.create(mockForum);

      expect(result).toEqual(mockForum);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockForum.clubId, mockForum.title, mockForum.description, mockForum.isAdminOnly]);
    });
  });

  describe('findById', () => {
    it('should return a forum by its ID', async () => {
      const mockForumId = '123';
      const mockForum = { forumId: mockForumId, title: 'Existing Forum', description: 'Existing forum description', isAdminOnly: false };
      pool.query.mockResolvedValue({ rows: [mockForum] });

      const result = await Forum.findById(mockForumId);

      expect(result).toEqual(mockForum);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockForumId]);
    });

    it('should return undefined if forum is not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Forum.findById('nonexistent');

      expect(result).toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['nonexistent']);
    });
  });

  describe('findByClubId', () => {
    it('should return all forums for a given club ID', async () => {
      const mockClubId = '1';
      const mockForums = [
        { forumId: '123', clubId: mockClubId, title: 'Forum One', isAdminOnly: false },
        { forumId: '456', clubId: mockClubId, title: 'Forum Two', isAdminOnly: true }
      ];
      pool.query.mockResolvedValue({ rows: mockForums });

      const result = await Forum.findByClubId(mockClubId);

      expect(result).toEqual(mockForums);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockClubId]);
    });
  });
});
