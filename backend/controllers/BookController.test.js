const { addCurrentlyReading, markAsFinished, getCurrentlyReading } = require('./BookController');


jest.mock('../models/Book', () => {
  return {
    addCurrentlyReading: jest.fn(),
    markAsFinished: jest.fn(),
    getCurrentlyReading: jest.fn(),
    fetchCoverImage: jest.fn(),
  };
});

const Book = require('../models/Book');

describe('BookController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });


  describe('addCurrentlyReading', () => {
    it('should add a book to currently reading and return status 201', async () => {
      const mockBook = { id: '123', title: 'Test Book' };
      Book.addCurrentlyReading.mockResolvedValue(mockBook);

      const req = { user: { userId: '1' }, body: mockBook };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      await addCurrentlyReading(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    it('should handle errors and return status 500', async () => {
      Book.addCurrentlyReading.mockRejectedValue(new Error('Server error'));

      const req = { user: { userId: '1' }, body: { title: 'Test Book' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      await addCurrentlyReading(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });


  describe('markAsFinished', () => {
    it('should mark a book as finished and return the updated book', async () => {
      const finishedBook = { id: '123', title: 'Test Book', finished: true };
      Book.markAsFinished.mockResolvedValue(finishedBook);

      const req = { params: { bookId: '123' } };
      const res = { json: jest.fn() };

      await markAsFinished(req, res);

      expect(res.json).toHaveBeenCalledWith(finishedBook);
    });

    it('should handle errors and return status 500', async () => {
      Book.markAsFinished.mockRejectedValue(new Error('Server error'));

      const req = { params: { bookId: '123' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      await markAsFinished(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('getCurrentlyReading', () => {
    it('should return a list of currently reading books with cover images', async () => {
      const books = [{ id: '123', title: 'Test Book' }];
      const booksWithCovers = books.map(book => ({ ...book, coverImage: 'some-url' }));
      Book.getCurrentlyReading.mockResolvedValue(books);
      Book.fetchCoverImage.mockResolvedValue('some-url');

      const req = { user: { userId: '1' } };
      const res = { json: jest.fn() };

      await getCurrentlyReading(req, res);

      expect(res.json).toHaveBeenCalledWith(booksWithCovers);
    });

    it('should handle errors and return status 500', async () => {
      Book.getCurrentlyReading.mockRejectedValue(new Error('Server error'));

      const req = { user: { userId: '1' } };
      const res = { status: jest.fn(() => res), send: jest.fn() };

      await getCurrentlyReading(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
