//backend/controllers/PostController.test.js

const { createPost, getPostsByForumId } = require('./PostController');
const Post = require('../models/Post');
const Forum = require('../models/Forum');


jest.mock('../models/Post', () => ({
  create: jest.fn(),
  findByForumId: jest.fn(),
}));
jest.mock('../models/Forum', () => ({
  findById: jest.fn(),
}));

describe('PostController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post and return status 201', async () => {
      const mockForum = { clubid: '123' };
      const mockPost = { id: '1', content: 'Test Post', forumId: '456', authorUserId: '789' };
      Forum.findById.mockResolvedValue(mockForum);
      Post.create.mockResolvedValue(mockPost);

      const req = {
        user: { userId: '789' },
        body: { forumId: '456', content: 'Test Post' },
      };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await createPost(req, res);

      expect(Forum.findById).toHaveBeenCalledWith(req.body.forumId);
      expect(Post.create).toHaveBeenCalledWith({ clubId: mockForum.clubid, forumId: '456', authorUserId: '789', content: 'Test Post' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 404 if forum not found', async () => {
      Forum.findById.mockResolvedValue(null);

      const req = { user: { userId: '1' }, body: { forumId: 'nonexistent', content: 'Test Post' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Forum not found');
    });

  });

  describe('getPostsByForumId', () => {
    it('should return posts for a given forumId and status 200', async () => {
      const mockPosts = [{ id: '1', content: 'Test Post' }];
      Post.findByForumId.mockResolvedValue(mockPosts);

      const req = { params: { forumId: '456' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await getPostsByForumId(req, res);

      expect(Post.findByForumId).toHaveBeenCalledWith('456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

  });
});
