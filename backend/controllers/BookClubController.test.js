const {
  createBookClub,
  getAllBookClubs,
  getBookClubDetails,
} = require('./BookClubController');
const BookClub = require('../models/BookClub');
const Membership = require('../models/Membership');
const Forum = require('../models/Forum');

// Mock  dependencies
jest.mock('../models/BookClub');
jest.mock('../models/Membership');
jest.mock('../models/Forum');

describe('BookClubController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('createBookClub', () => {
    it('should return 400 if clubType is "In-Person" and state or city is not provided', async () => {
      const req = {
        user: { userId: '1' },
        body: { clubName: 'New Club', description: 'A new book club', clubType: 'In-Person' },
      };
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const res = { status };

      await createBookClub(req, res);

      expect(status).toHaveBeenCalledWith(400);
      expect(send).toHaveBeenCalledWith('State and city are required for in-person clubs.');
    });

    it('should create a book club and respond with 201 and the new club details', async () => {
      const mockClubData = {
        clubName: 'New Club',
        description: 'A new book club',
        clubType: 'Online',
        state: null,
        city: null,
        clubPrivacy: true,
        adminUserID: '1',
      };
      const mockNewClub = {
        ...mockClubData,
        clubid: '123',
      };

      BookClub.create.mockResolvedValue(mockNewClub);
      Membership.create.mockResolvedValue({});
      Forum.create.mockResolvedValue({});

      const req = {
        user: { userId: '1' },
        body: mockClubData,
      };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));
      const res = { status };

      await createBookClub(req, res);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(mockNewClub);
    });

    describe('getAllBookClubs', () => {
      it('should fetch all book clubs and return a 200 status', async () => {
        const mockBookClubs = [{ clubName: 'Book Club One' }, { clubName: 'Book Club Two' }];
        BookClub.findAll.mockResolvedValue(mockBookClubs);

        const req = {};
        const json = jest.fn();
        const status = jest.fn().mockImplementation(function (statusCode) {
          expect(statusCode).toBe(200);
          return this;
        });
        const res = { json, status };

        await getAllBookClubs(req, res);

        expect(json).toHaveBeenCalledWith(mockBookClubs);
      });

      it('should handle errors and return a 500 status', async () => {
        BookClub.findAll.mockRejectedValue(new Error('Database error'));

        const req = {};
        const send = jest.fn();
        const res = { send, status: jest.fn(() => res) };

        await getAllBookClubs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(send).toHaveBeenCalledWith('Server error');
      });
    });

    describe('getBookClubDetails', () => {
      it('should return a 404 status if the book club is not found', async () => {
        BookClub.findById.mockResolvedValue(null);

        const req = { params: { clubId: '1' }, user: { userId: '1' } };
        const send = jest.fn();
        const res = { send, status: jest.fn(() => res) };

        await getBookClubDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(send).toHaveBeenCalledWith('Book club not found');
      });
    });
  })
});
