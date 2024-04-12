const jwt = require('jsonwebtoken');
const authenticateToken = require('./authenticateToken');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('authenticateToken Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      sendStatus: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    process.env.JWT_SECRET = 'secret'; 
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(mockReq, mockRes, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should return 403 if an invalid token is provided', () => {
    mockReq.headers['authorization'] = 'Bearer invalidtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), undefined);
    });

    authenticateToken(mockReq, mockRes, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should call next() for a valid token', () => {
    mockReq.headers['authorization'] = 'Bearer validtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: '123', username: 'testUser' }); 
    });

    authenticateToken(mockReq, mockRes, mockNext);
    expect(mockReq.user).toEqual({ userId: '123', username: 'testUser' });
    expect(mockNext).toHaveBeenCalled();
  });
});
