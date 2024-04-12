const request = require('supertest');
const express = require('express');
const profileController = require('../controllers/ProfileController');
const authenticateToken = require('../middleware/authenticateToken');
const profileRouter = require('./profile');

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => {
  req.user = { userId: 'testUserId' };
  next();
}));

jest.mock('../controllers/ProfileController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/profile', profileRouter);
});

it('should get user preferences', async () => {
  const mockPreferences = { theme: 'dark', language: 'en' };
  profileController.getUserPreferences.mockImplementation((req, res) => res.status(200).send(mockPreferences));

  const response = await request(app)
    .get('/profile/preferences');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockPreferences);
});

it('should update user preferences', async () => {
  const updatedPreferences = { theme: 'light', language: 'fr' };
  profileController.updateUserPreferences.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app)
    .put('/profile/preferences')
    .send(updatedPreferences);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});
