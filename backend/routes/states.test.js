const request = require('supertest');
const express = require('express');
const State = require('../models/State');
const statesRouter = require('./states');

jest.mock('../models/State', () => ({
  findAll: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => { });

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/states', statesRouter);
});


it('should get all states', async () => {
  const mockStates = [{ name: 'State1' }, { name: 'State2' }];
  State.findAll.mockResolvedValue(mockStates);

  const response = await request(app).get('/states');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockStates);
});

it('should handle error when fetching states', async () => {
  const errorMessage = 'Failed to fetch states';
  State.findAll.mockRejectedValue(new Error(errorMessage));

  const response = await request(app).get('/states');

  expect(response.statusCode).toBe(500);
  expect(response.text).toBe('Server error');
});
