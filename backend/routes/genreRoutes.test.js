const request = require('supertest');
const express = require('express');
const GenreController = require('../controllers/GenreController');
const genreRoutes = require('./genreRoutes');

jest.mock('../controllers/GenreController');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/genres', genreRoutes);
});

it('should get genres', async () => {
  const mockGenres = ['Fantasy', 'Science Fiction', 'Mystery'];
  GenreController.getGenres.mockImplementation((req, res) => res.status(200).send(mockGenres));

  const response = await request(app).get('/genres');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockGenres);
});
