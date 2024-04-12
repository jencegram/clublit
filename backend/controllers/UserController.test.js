const { signup, login, updatePassword } = require('./UserController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

jest.mock('../models/User', () => ({
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      const mockUser = { userid: '1', username: 'testUser', email: 'test@test.com' };
      User.findByUsername.mockResolvedValue(null);
      User.findByEmail.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('token');

      const req = {
        body: {
          username: 'testUser',
          email: 'test@test.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User created successfully',
        token: 'token',
        user: mockUser,
      }));
    });
  });

  describe('login', () => {
    it('should authenticate user and return a token', async () => {
      const mockUser = { userid: '1', username: 'testUser', password: 'hashedPassword' };
      User.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const req = {
        body: {
          username: 'testUser',
          password: 'password123',
        },
      };
      const res = {
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
        token: 'token',
        username: 'testUser',
        userId: '1',
      }));
    });


    it('should return an error for invalid credentials', async () => {
      User.findByUsername.mockResolvedValue(null); 

      const req = {
        body: {
          username: 'nonexistentUser',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });
  });
});

describe('updatePassword', () => {
  it('should update the user password successfully', async () => {
    const req = {
      user: { userId: '1' },
      body: {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValueOnce({ rows: [{ password: 'hashedOldPassword' }] });
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedNewPassword');
    pool.query.mockResolvedValueOnce();

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
  });

  it('should return an error for incorrect old password', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ password: 'hashedOldPassword' }] });
    bcrypt.compare.mockResolvedValue(false); 

    const req = {
      user: { userId: '1' },
      body: {
        oldPassword: 'incorrectOldPassword',
        newPassword: 'newPassword123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Old password is incorrect' });
  });
});

