const Post = require('./Post');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Post Model', () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('create', () => {
    it('should create a new post and return the created post', async () => {
      const newPost = {
        clubId: '1',
        forumId: '1',
        authorUserId: '1',
        content: 'Test Post Content',
      };

      const expectedPost = { ...newPost, postdate: new Date().toISOString(), id: '1' };

      pool.query.mockResolvedValueOnce({ rows: [expectedPost] });

      const result = await Post.create(newPost);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO posts'), [
        newPost.clubId,
        newPost.forumId,
        newPost.authorUserId,
        newPost.content,
      ]);
      expect(result).toEqual(expectedPost);
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(Post.create({
        clubId: '1',
        forumId: '1',
        authorUserId: '1',
        content: 'Test Post Content',
      })).rejects.toThrow('Database error');
    });
  });

  describe('findByForumId', () => {
    it('should find posts by forum ID and order them by date in descending order', async () => {
      const mockPosts = [
        { id: '2', content: 'Second Post', postdate: '2023-01-02', username: 'User2' },
        { id: '1', content: 'First Post', postdate: '2023-01-01', username: 'User1' },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockPosts });

      const result = await Post.findByForumId('1');

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT p.*, u.username'), ['1']);
      expect(result).toEqual(mockPosts);
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(Post.findByForumId('1')).rejects.toThrow('Database error');
    });
  });
});
