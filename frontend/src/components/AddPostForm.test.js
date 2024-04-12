import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPostForm from './AddPostForm'; 
import * as bookClubApi from '../api/bookClubApi';

jest.mock('../api/bookClubApi', () => ({
  createPost: jest.fn(),
}));

describe('AddPostForm', () => {
  const mockOnPostAdded = jest.fn();
  const forumId = 'test-forum-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form', () => {
    render(<AddPostForm forumId={forumId} onPostAdded={mockOnPostAdded} />);
    expect(screen.getByPlaceholderText('Write your post here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add post/i })).toBeInTheDocument();
  });

  it('calls createPost with the correct arguments on form submission', async () => {
    bookClubApi.createPost.mockResolvedValueOnce({}); 
    render(<AddPostForm forumId={forumId} onPostAdded={mockOnPostAdded} />);

    const input = screen.getByPlaceholderText('Write your post here...');
    const button = screen.getByRole('button', { name: /add post/i });

    await userEvent.type(input, 'Test post content');
    fireEvent.click(button);

    await waitFor(() => expect(bookClubApi.createPost).toHaveBeenCalledWith(forumId, 'Test post content'));
  });

  it('calls onPostAdded after successful form submission', async () => {
    bookClubApi.createPost.mockResolvedValueOnce({});
    render(<AddPostForm forumId={forumId} onPostAdded={mockOnPostAdded} />);

    const input = screen.getByPlaceholderText('Write your post here...');
    const button = screen.getByRole('button', { name: /add post/i });

    await userEvent.type(input, 'Test post content');
    userEvent.click(button);

    await waitFor(() => expect(mockOnPostAdded).toHaveBeenCalled());
  });

});

