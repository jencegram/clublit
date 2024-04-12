import React from "react";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePreferences from './ProfilePreferences';
import { getUserPreferences, fetchGenres, updateUserPreferences } from '../api/bookClubApi';

jest.mock('../api/bookClubApi');

beforeEach(() => {
  getUserPreferences.mockResolvedValue({
    favoriteGenre: 'Fiction',
    favoriteBookQuote: 'Not all those who wander are lost.'
  });
  fetchGenres.mockResolvedValue([
    { genre_id: 1, genre_name: 'Fiction' },
    { genre_id: 2, genre_name: 'Non-Fiction' }
  ]);
  updateUserPreferences.mockResolvedValue({ success: true });
});

test('ProfilePreferences loads and displays user preferences and genres', async () => {
  render(<ProfilePreferences />);
  
  await waitFor(() => {
    expect(screen.getByLabelText('Favorite Genre:').value).toBe('1');
    expect(screen.getByLabelText('Favorite Book Quote:').value).toBe('Not all those who wander are lost.');
  });
});

test('allows the user to change preferences and submit the form', async () => {
  render(<ProfilePreferences />);
  
  const genreSelect = await screen.findByLabelText('Favorite Genre:');
  const quoteTextarea = await screen.findByLabelText('Favorite Book Quote:');
  const saveButton = screen.getByRole('button', { name: 'Save Preferences' });

  fireEvent.change(genreSelect, { target: { value: '2' } });
  fireEvent.change(quoteTextarea, { target: { value: 'Change is the only constant.' } });
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(updateUserPreferences).toHaveBeenCalledWith({
      favoriteGenre: 2,
      favoriteBookQuote: 'Change is the only constant.'
    });
  });
});


