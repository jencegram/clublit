//backend/models/State.test.js

const State = require('./State');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('State Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should retrieve all states ordered by name', async () => {
      const mockStates = [
        { id: '1', name: 'Alabama' },
        { id: '2', name: 'Alaska' },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockStates });

      const result = await State.findAll();

      expect(result).toEqual(mockStates);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM states ORDER BY name');
    });

    it('should handle errors gracefully', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(State.findAll()).rejects.toThrow('Database error');
    });
  });
});
