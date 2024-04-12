const { getUserPreferences, updateUserPreferences } = require('./ProfileController');
jest.mock('../db');

const pool = require('../db');

describe('ProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('getUserPreferences', () => {
    it('should fetch and return user preferences', async () => {
      const mockUserId = '1';
      pool.query.mockResolvedValueOnce({ rows: [{ favorite_genre: '1' }] })
        .mockResolvedValueOnce({ rows: [{ genre_name: 'Fantasy' }] })
        .mockResolvedValueOnce({ rows: [{ favorite_book_quote: 'Not all those who wander are lost.' }] });

      const req = { params: { userId: mockUserId }, user: { userId: mockUserId } };
      const json = jest.fn();
      const res = { json };

      await getUserPreferences(req, res);

      expect(json).toHaveBeenCalledWith({
        favoriteGenre: 'Fantasy',
        favoriteBookQuote: 'Not all those who wander are lost.',
      });
    });

    it('should handle database errors gracefully', async () => {
      const mockUserId = '1';
      pool.query.mockRejectedValue(new Error('Database error'));
      const req = { params: { userId: mockUserId }, user: { userId: mockUserId } };
      const status = jest.fn().mockReturnThis(); 
      const json = jest.fn();
      const res = { status, json };

      await getUserPreferences(req, res);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ success: false, message: 'Server error while fetching preferences.' });
    });
  });

  describe('updateUserPreferences', () => {
    const mockUserId = '1';

    it('should update user preferences and return success message', async () => {
      pool.query.mockResolvedValueOnce({}); 
      pool.query.mockResolvedValueOnce({}); 
      pool.query.mockResolvedValueOnce({}); 
      pool.query.mockResolvedValueOnce({}); 

      const req = {
        user: { userId: mockUserId },
        body: { favoriteGenre: '2', favoriteBookQuote: 'To be or not to be.' },
      };
      const json = jest.fn();
      const res = { setHeader: jest.fn(), json };

      await updateUserPreferences(req, res);

      expect(json).toHaveBeenCalledWith({ success: true, message: 'Preferences updated successfully.' });
      
      expect(pool.query).toHaveBeenCalledWith('BEGIN');
      expect(pool.query).toHaveBeenCalledWith('UPDATE users SET favorite_genre = $1 WHERE userid = $2', ['2', mockUserId]);
      expect(pool.query).toHaveBeenCalledWith('UPDATE users SET favorite_book_quote = $1 WHERE userid = $2', ['To be or not to be.', mockUserId]);
      expect(pool.query).toHaveBeenCalledWith('COMMIT');
    });
  })
});