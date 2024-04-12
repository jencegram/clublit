import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ForumList from './ForumList';
import * as bookClubApi from '../api/bookClubApi';

jest.mock('../api/bookClubApi');

describe('ForumList', () => {
  const mockForums = [
    { forumid: '1', title: 'Forum One', description: 'Description One' },
    { forumid: '2', title: 'Forum Two', description: 'Description Two' }
  ];

  beforeEach(() => {
    bookClubApi.fetchForumsByClubId.mockResolvedValue(mockForums);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders forums based on the club ID', async () => {
    render(<ForumList clubId="123" />);

    await waitFor(() => {
      expect(bookClubApi.fetchForumsByClubId).toHaveBeenCalledWith("123");
      expect(screen.getByText('Forum One')).toBeInTheDocument();
      expect(screen.getByText('Description One')).toBeInTheDocument();
      expect(screen.getByText('Forum Two')).toBeInTheDocument();
      expect(screen.getByText('Description Two')).toBeInTheDocument();
    });
  });

  it('displays an error message when the API call fails', async () => {
    bookClubApi.fetchForumsByClubId.mockRejectedValue(new Error('Failed to fetch forums'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<ForumList clubId="123" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch forums", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});

