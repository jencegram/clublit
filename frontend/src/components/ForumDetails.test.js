import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import ForumDetails from './ForumDetails';
import * as bookClubApi from '../api/bookClubApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useParams: () => ({
    forumId: '123'
  }),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

jest.mock('../api/bookClubApi', () => ({
  fetchForumDetails: jest.fn(),
  fetchPostsByForumId: jest.fn(),
  checkMembership: jest.fn()
}));

describe('ForumDetails', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'user123');
    bookClubApi.fetchForumDetails.mockResolvedValue({
      title: 'Example Forum',
      description: 'A description here',
      clubid: 'club123'
    });
    bookClubApi.fetchPostsByForumId.mockResolvedValue([
      { postid: '1', username: 'User1', content: 'Post content 1', authoruserid: 'user1', formatted_date: '2022-01-01' },
      { postid: '2', username: 'User2', content: 'Post content 2', authoruserid: 'user2', formatted_date: '2022-01-02' }
    ]);
    bookClubApi.checkMembership.mockResolvedValue({ isMember: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the forum details and posts', async () => {
    render(<Router><ForumDetails /></Router>);

    await waitFor(() => {
      expect(screen.getByText(/Example Forum/i)).toBeInTheDocument();
      expect(screen.getByText(/A description here/i)).toBeInTheDocument();
      expect(screen.getByText(/Post content 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Post content 2/i)).toBeInTheDocument();
    });
  });

});
