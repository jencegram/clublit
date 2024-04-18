import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard';
import * as bookApi from '../api/bookApi';
import * as bookClubApi from '../api/bookClubApi';

// Mock the bookApi and bookClubApi modules
jest.mock('../api/bookApi', () => ({
  fetchCurrentlyReading: jest.fn(),
  addBookToCurrentlyReading: jest.fn(),
  markBookAsFinished: jest.fn(),
  removeBookFromCurrentlyReading: jest.fn(),
}));
jest.mock('../api/bookClubApi', () => ({
  fetchMyBookClubs: jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'testuser');
    // Return mock values for the API calls
    bookApi.fetchCurrentlyReading.mockResolvedValue([
      { id: '1', title: 'Book One', author: 'Author One', coverImage: '/path/to/image1.jpg' },
    ]);
    bookClubApi.fetchMyBookClubs.mockResolvedValue([]);
    // Mock the global fetch function to resolve to a successful deletion
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders and handles removing a book from currently reading', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
  
    // Find and click the remove button for "Book One"
    const removeButton = await screen.findByText('Remove');
    userEvent.click(removeButton);
  
    // Mock the fetch call for book removal
    global.fetch.mockResolvedValueOnce({ ok: true });
  
    // Since you clicked "Remove", you expect the fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/currently-reading/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  
    // Mock the fetchCurrentlyReading to return the new state without "Book One"
    bookApi.fetchCurrentlyReading.mockResolvedValueOnce([
      // Assuming the second book is still there
      { id: '2', title: 'Book Two', author: 'Author Two', coverImage: '/path/to/image2.jpg' }
    ]);
  
    // Wait for the state to update after re-fetching
    await waitFor(() => {
      expect(screen.queryByText('Book One')).not.toBeInTheDocument();
    });
  });  