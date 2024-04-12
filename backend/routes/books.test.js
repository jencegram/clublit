const request = require('supertest');
const express = require('express');
const BookController = require('../controllers/BookController');
const authenticateToken = require('../middleware/authenticateToken');
const booksRouter = require('./books');

jest.mock('../middleware/authenticateToken', () => jest.fn((req, res, next) => {
  req.user = { userId: 'testUserId' };
  next();
}));

jest.mock('../controllers/BookController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(booksRouter);
});

it('should add a book to currently reading list', async () => {
  const bookData = { title: 'Test Book', author: 'Test Author' };
  BookController.addCurrentlyReading.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app)
    .post('/currently-reading')
    .send(bookData);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});

it('should mark a book as finished', async () => {
  const bookId = '1';
  BookController.markAsFinished.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app).patch(`/currently-reading/${bookId}/finish`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});

it('should get currently reading books', async () => {
  const mockBooks = [{ title: 'Test Book', author: 'Test Author' }];
  BookController.getCurrentlyReading.mockImplementation((req, res) => res.status(200).send(mockBooks));

  const response = await request(app).get('/currently-reading');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockBooks);
});

it('should get finished books', async () => {
  const mockBooks = [{ title: 'Test Book', author: 'Test Author' }];
  BookController.getFinishedBooks.mockImplementation((req, res) => res.status(200).send(mockBooks));

  const response = await request(app).get('/finished');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockBooks);
});

it('should remove a book from currently reading list', async () => {
  const bookId = '1';
  BookController.removeCurrentlyReading.mockImplementation((req, res) => res.status(200).send({ success: true }));

  const response = await request(app).delete(`/currently-reading/${bookId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ success: true });
});

it('should get currently reading books for a specific user', async () => {
  const userId = 'testUserId';
  const mockBooks = [{ title: 'Test Book', author: 'Test Author' }];
  BookController.getCurrentlyReadingForUser.mockImplementation((req, res) => res.status(200).send(mockBooks));

  const response = await request(app).get(`/users/${userId}/currently-reading`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockBooks);
});