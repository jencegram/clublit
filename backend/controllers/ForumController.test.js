const { createForum, getForumsByClubId, getForumDetails } = require('./ForumController');
const Forum = require('../models/Forum');

jest.mock('../models/Forum', () => ({
  create: jest.fn(),
  findByClubId: jest.fn(),
  findById: jest.fn(),
}));

describe('ForumController', () => {
  let consoleErrorMock;


  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('createForum', () => {
    it('should create a forum and return status 201', async () => {
      const req = {
        body: { clubId: '1', title: 'Test Forum', description: 'Test Description', isAdminOnly: false },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };
      const mockForum = { ...req.body, id: '123' };

      Forum.create.mockResolvedValue(mockForum);

      await createForum(req, res);

      expect(Forum.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockForum);
    });

    it('should return status 500 on error', async () => {
      const req = { body: { title: 'Error Case', description: 'This will fail' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      Forum.create.mockRejectedValue(new Error('Server error'));

      await createForum(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('getForumsByClubId', () => {
    it('should return forums for a given clubId and status 200', async () => {
      const mockForums = [{ id: '123', title: 'Forum One' }, { id: '456', title: 'Forum Two' }];
      Forum.findByClubId.mockResolvedValue(mockForums);

      const req = { params: { clubId: '1' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await getForumsByClubId(req, res);

      expect(Forum.findByClubId).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockForums);
    });

    it('should return status 500 on error', async () => {
      const req = { params: { clubId: '1' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      Forum.findByClubId.mockRejectedValue(new Error('Server error'));

      await getForumsByClubId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('getForumDetails', () => {
    it('should return forum details for a given forumId and status 200', async () => {
      const mockForum = { id: '123', title: 'Forum Details', description: 'Details of the forum' };
      Forum.findById.mockResolvedValue(mockForum);

      const req = { params: { forumId: '123' } };
      const res = { json: jest.fn() };

      await getForumDetails(req, res);

      expect(Forum.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockForum);
    });

    it('should return status 404 if forum is not found', async () => {
      Forum.findById.mockResolvedValue(null);

      const req = { params: { forumId: 'nonexistent' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      await getForumDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Forum not found');
    });

    it('should return status 500 on error', async () => {
      const req = { params: { forumId: '123' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      Forum.findById.mockRejectedValue(new Error('Server error'));

      await getForumDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
