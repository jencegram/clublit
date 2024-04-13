import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard';
import * as bookApi from '../api/bookApi';
import * as bookClubApi from '../api/bookClubApi';


jest.mock('../api/bookApi');
jest.mock('../api/bookClubApi');

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'testuser');
    bookApi.fetchCurrentlyReading.mockResolvedValue([
      { id: '1', title: 'Book One', author: 'Author One', coverImage: '/path/to/image1.jpg' },
      { id: '2', title: 'Book Two', author: 'Author Two', coverImage: '/path/to/image2.jpg' }
    ]);
    bookClubApi.fetchMyBookClubs.mockResolvedValue([
      { clubid: '1', clubname: 'Club One', description: 'Description One', meetinginfo: 'Meeting Info One', announcements: 'Announcements One' }
    ]);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ some: 'data' })
      })
    );
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  
  it('handles removing a book from currently reading', async () => {
    render(<Router><Dashboard /></Router>);

    const removeButton = await screen.findAllByText('Remove');
    userEvent.click(removeButton[0]);

    await waitFor(() => {
      expect(bookApi.fetchCurrentlyReading).toHaveBeenCalled();
      expect(screen.queryByText('Book One')).not.toBeInTheDocument();
    });
  });
});
