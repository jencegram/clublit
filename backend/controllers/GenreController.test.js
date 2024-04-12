const { getGenres } = require('./GenreController');
const pool = require('../db');


jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('GenreController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('getGenres', () => {
    it('should fetch genres and return them', async () => {
      const mockGenres = [
        { genre_name: 'Fantasy' },
        { genre_name: 'Science Fiction' },
      ];
      pool.query.mockResolvedValue({ rows: mockGenres });

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      await getGenres(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM genres ORDER BY genre_name');
      expect(res.json).toHaveBeenCalledWith(mockGenres);
    });

    it('should handle errors and return status 500', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      await getGenres(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM genres ORDER BY genre_name');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
