const Book = require('./Book');
const pool = require('../db');
const axios = require('axios');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

jest.mock('axios');

describe('Book Model', () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();

    originalConsoleError = console.error;

    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('addCurrentlyReading', () => {
    it('should add a book to the currently reading list for a user', async () => {
      const mockBook = { id: '1', title: 'Test Book', author: 'Test Author', openLibraryId: 'OL12345M', finished: false };
      pool.query.mockResolvedValue({ rows: [mockBook] });

      const book = await Book.addCurrentlyReading('user123', mockBook);

      expect(book).toEqual(mockBook);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO user_books (user_id, title, author, open_library_id, finished) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        ['user123', 'Test Book', 'Test Author', 'OL12345M', false]
      );
    });
  });

  describe('getCurrentlyReading', () => {
    it('should retrieve books a user is currently reading', async () => {
      const mockBooks = [{ id: '1', title: 'Test Book', author: 'Test Author', finished: false }];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const books = await Book.getCurrentlyReading('user123');

      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM user_books WHERE user_id = $1 AND finished = FALSE',
        ['user123']
      );
    });
  });

  describe('markAsFinished', () => {
    it('should mark a book as finished', async () => {
      const mockBook = { id: '1', finished: true };
      pool.query.mockResolvedValue({ rows: [mockBook] });

      const book = await Book.markAsFinished('1');

      expect(book).toEqual(mockBook);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE user_books SET finished = TRUE WHERE id = $1 RETURNING *',
        ['1']
      );
    });
  });

  describe('fetchCoverImage', () => {
    it('should fetch a cover image for a book title', async () => {
      const mockCoverImageUrl = 'https://example.com/cover.jpg';
      axios.get.mockResolvedValue({
        data: {
          items: [
            { volumeInfo: { imageLinks: { thumbnail: mockCoverImageUrl } } }
          ]
        }
      });

      const coverImage = await Book.fetchCoverImage('Test Book');

      expect(coverImage).toBe(mockCoverImageUrl);
      expect(axios.get).toHaveBeenCalled();
    });

    it('should return default image URL on error', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      const defaultImageUrl = 'http://localhost:3000/images/notavailablebook.png';

      const coverImage = await Book.fetchCoverImage('Test Book');

      expect(coverImage).toBe(defaultImageUrl);
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe('getFinishedBooks', () => {
    it('should retrieve books a user has finished reading', async () => {
      const mockFinishedBooks = [
        { id: '1', title: 'Finished Book 1', author: 'Author 1', finished: true },
        { id: '2', title: 'Finished Book 2', author: 'Author 2', finished: true },
      ];
      pool.query.mockResolvedValue({ rows: mockFinishedBooks });

      const books = await Book.getFinishedBooks('user123');

      expect(books).toEqual(mockFinishedBooks);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM user_books WHERE user_id = $1 AND finished = TRUE',
        ['user123']
      );
    });

    it('should handle errors when fetching finished books', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      await expect(Book.getFinishedBooks('user123')).rejects.toThrow('Database error');
    });
  });

  describe('removeCurrentlyReading', () => {
    it('should remove a book from the currently reading list', async () => {
      const mockBookId = '1';
      const mockDeletedBook = { id: '1', title: 'Removed Book', author: 'Author', finished: false };
      pool.query.mockResolvedValue({ rows: [mockDeletedBook], rowCount: 1 });

      const result = await Book.removeCurrentlyReading(mockBookId);

      expect(result).toEqual({ rows: [mockDeletedBook], rowCount: 1 });
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM user_books WHERE id = $1 RETURNING *', [mockBookId]
      );
    });

    it('should return null if no book is removed', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });
      const result = await Book.removeCurrentlyReading('nonexistent');

      expect(result).toEqual({ rowCount: 0 });
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM user_books WHERE id = $1 RETURNING *', ['nonexistent']
      );
    });

    it('should handle errors when removing currently reading book', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      await expect(Book.removeCurrentlyReading('1')).rejects.toThrow('Database error');
    });
  });
})
