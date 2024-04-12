const request = require('supertest');
const express = require('express');
const PostController = require('../controllers/PostController');
const authenticateToken = require('../middleware/authenticateToken');
const postsRouter = require('./posts');

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => {
  req.user = { userId: 'testUserId' };
  next();
}));

jest.mock('../controllers/PostController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/posts', postsRouter);
});

it('should create a post', async () => {
  const postData = { title: 'Test Post', content: 'Lorem ipsum' };
  PostController.createPost.mockImplementation((req, res) => res.status(201).send({ success: true }));

  const response = await request(app)
    .post('/posts')
    .send(postData);

  expect(response.statusCode).toBe(201);
  expect(response.body).toEqual({ success: true });
});

it('should get posts by forum ID', async () => {
  const forumId = '1';
  const mockPosts = [{ title: 'Test Post 1', content: 'Lorem ipsum 1' }, { title: 'Test Post 2', content: 'Lorem ipsum 2' }];
  PostController.getPostsByForumId.mockImplementation((req, res) => res.status(200).send(mockPosts));

  const response = await request(app).get(`/posts/forum/${forumId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockPosts);
});
