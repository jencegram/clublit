const express = require('express');
const request = require('supertest');
const userRouter = require('./users');
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const authenticateToken = require('../middleware/authenticateToken');

jest.mock('../controllers/UserController', () => ({
  signup: jest.fn((req, res) => res.status(201).send({ user: { userid: 1 } })),
  login: jest.fn((req, res) => res.status(200).send({ token: 'fake-token' })),
  updatePassword: jest.fn((req, res) => res.status(200).send({ success: true })),
}));

jest.mock('../controllers/BookController', () => ({
  getUsersFinishedBooks: jest.fn((req, res) => res.status(200).send({ books: [] })),
}));

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Routes', () => {
  test('POST /signup should create a new user', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({ username: 'newuser', password: 'newpassword', email: 'newemail@example.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toHaveProperty('userid');
  });

  test('POST /login should authenticate a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'existinguser', password: 'existingpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('GET /:userId/finished should return finished books for authenticated user', async () => {
    const response = await request(app).get('/users/1/finished');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('books');
  });

  test('PUT /updatePassword should update the password for an authenticated user', async () => {
    const response = await request(app)
      .put('/users/updatePassword')
      .send({ password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success');
  });
});
