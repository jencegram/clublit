const User = require('./User');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['testuser']);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    });
  });

  describe('create', () => {
    it('should create a new user and return the created user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedpassword',
        profileprivacy: true,
      };

      const expectedUser = { ...newUser, id: '2' };

      pool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await User.create(newUser);

      expect(result).toEqual(expectedUser);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password, profileprivacy) VALUES ($1, $2, $3, $4) RETURNING *',
        [newUser.username, newUser.email, newUser.password, newUser.profileprivacy]
      );
    });
  });
});
