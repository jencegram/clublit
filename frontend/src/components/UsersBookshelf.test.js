import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UsersBookshelf from './UsersBookshelf';
import * as bookApi from '../api/bookApi';
import * as bookClubApi from '../api/bookClubApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ userId: '123' }),
}));

jest.mock('../api/bookApi', () => ({
  fetchUsersFinishedBooks: jest.fn(),
  fetchCurrentlyReadingForUser: jest.fn(),
}));
jest.mock('../api/bookClubApi', () => ({
  getUserPreferences: jest.fn(),
}));

describe('UsersBookshelf', () => {
  beforeEach(() => {
    bookApi.fetchUsersFinishedBooks.mockResolvedValue([
      { id: '1', title: 'Book One', author: 'Author One' },
    ]);
    bookApi.fetchCurrentlyReadingForUser.mockResolvedValue([
      { id: '2', title: 'Book Two', author: 'Author Two', coverImage: 'http://example.com/book2.jpg' },
    ]);
    bookClubApi.getUserPreferences.mockResolvedValue({
      favoriteGenre: 'Fantasy',
      favoriteBookQuote: 'To the stars who listen—and the dreams that are answered.'
    });
  });

  it('displays books and user preferences after fetching data', async () => {
    render(
      <Router>
        <UsersBookshelf />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Book One by Author One')).toBeInTheDocument();
      expect(screen.getByText('Book Two by Author Two')).toBeInTheDocument();
      expect(screen.getByText(/fantasy/i)).toBeInTheDocument();
      expect(screen.getByText(/the dreams that are answered/i)).toBeInTheDocument();
    });

    expect(screen.getByAltText('Cover of Book Two')).toHaveAttribute('src', 'http://example.com/book2.jpg');
  });
});
