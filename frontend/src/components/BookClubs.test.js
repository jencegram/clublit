import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookClubs from './BookClubs';
import * as bookClubApi from '../api/bookClubApi';

jest.mock('../api/bookClubApi');

describe('BookClubs', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });


  it('navigates to "/in-person-clubs" when the In-Person Clubs button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BookClubs />
      </MemoryRouter>
    );

    const inPersonClubsButton = screen.getByText('In-Person Clubs');
    fireEvent.click(inPersonClubsButton);
  });

  it('navigates to "/createbookclub" when the Create Your Book Club button is clicked', async () => {
    bookClubApi.fetchMyBookClubs.mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={['/']}>
        <BookClubs />
      </MemoryRouter>
    );

    const createButton = await screen.findByText('Create Your Book Club');
    fireEvent.click(createButton);
  });
});
