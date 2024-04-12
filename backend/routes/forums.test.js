const request = require('supertest');
const express = require('express');
const ForumController = require('../controllers/ForumController');
const authenticateToken = require('../middleware/authenticateToken');
const forumsRouter = require('./forums');

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => {
  req.user = { userId: 'testUserId' };
  next();
}));

jest.mock('../controllers/ForumController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/forums', forumsRouter);
});

it('should get forums by club ID', async () => {
  const clubId = '1';
  const mockForums = [{ title: 'Test Forum', description: 'Test Description' }];
  ForumController.getForumsByClubId.mockImplementation((req, res) => res.status(200).send(mockForums));

  const response = await request(app).get(`/forums/club/${clubId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockForums);
});

it('should get details of a single forum by forum ID', async () => {
  const forumId = '1';
  const mockForumDetails = { title: 'Test Forum', description: 'Test Description' };
  ForumController.getForumDetails.mockImplementation((req, res) => res.status(200).send(mockForumDetails));

  const response = await request(app).get(`/forums/details/${forumId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockForumDetails);
});

it('should create a new forum', async () => {
  const newForumData = { title: 'New Forum', description: 'New Description' };
  ForumController.createForum.mockImplementation((req, res) => res.status(201).send(newForumData));

  const response = await request(app)
    .post('/forums')
    .send(newForumData);

  expect(response.statusCode).toBe(201);
  expect(response.body).toEqual(newForumData);
});