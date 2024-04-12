const request = require('supertest');
const express = require('express');
const BookClubController = require('../controllers/BookClubController');
const authenticateToken = require('../middleware/authenticateToken');
const bookClubsRouter = require('./bookClubs');

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => {
  req.user = { userId: 'testUserId' };
  next();
}));

jest.mock('../controllers/BookClubController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(bookClubsRouter);
});

it('should retrieve details for a specific book club', async () => {
  const mockDetails = { id: '1', clubName: 'Test Detail Club' };
  BookClubController.getBookClubDetails.mockImplementation((req, res) => res.json(mockDetails));

  const clubId = '1';
  const response = await request(app).get(`/bookclubs/${clubId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockDetails);
});

it('should retrieve book clubs by state', async () => {
  const mockStateClubs = [{ id: '1', clubName: 'State Club' }];
  BookClubController.getBookClubsByState.mockImplementation((req, res) => res.json(mockStateClubs));

  const stateName = 'TestState';
  const response = await request(app).get(`/bookclubs/state/${stateName}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockStateClubs);
});

it('should create a new book club', async () => {
  const newClubData = {
    clubName: 'New Club',
    description: 'A new book club',
  };

  BookClubController.createBookClub.mockImplementation((req, res) => res.status(201).send({ id: '2', ...newClubData }));

  const response = await request(app)
    .post('/bookclubs')
    .send(newClubData);

  expect(response.statusCode).toBe(201);
  expect(response.body).toEqual({ id: expect.any(String), ...newClubData });
});

it('should handle a user joining a book club', async () => {
  const clubId = '1';
  BookClubController.joinBookClub.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app)
    .post('/bookclubs/join')
    .send({ clubId });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});


it('should check if a user is a member of a book club', async () => {
  const clubId = '1';
  BookClubController.checkMembership.mockImplementation((req, res) => res.status(200).send({ isMember: true }));

  const response = await request(app).get(`/bookclubs/${clubId}/check-membership`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ isMember: true });
});

it('should handle a user leaving a book club', async () => {
  const clubId = '1';
  BookClubController.leaveBookClub.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app).delete(`/bookclubs/${clubId}/leave`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});

it('should update book club info', async () => {
  BookClubController.updateClubInfo.mockImplementation((req, res) => res.status(200).send({ updated: true }));

  const clubId = '1';
  const updateData = { meetinginfo: 'New Info', announcements: 'New Announcements' };
  const response = await request(app)
    .put(`/bookclubs/${clubId}/update`)
    .send(updateData);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ updated: true });
});