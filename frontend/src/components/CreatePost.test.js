import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreatePost from './CreatePost';
import { createPost } from '../api/bookClubApi';

jest.mock('../api/bookClubApi');

describe('CreatePost', () => {
  const forumId = '123';

  beforeEach(() => {
    createPost.mockClear();
  });

  it('renders the post form if canPost is true', () => {
    render(<CreatePost forumId={forumId} canPost={true} />);
    expect(screen.getByPlaceholderText('Write your post here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
  });

  it('does not render the post form if canPost is false', () => {
    render(<CreatePost forumId={forumId} canPost={false} />);
    expect(screen.queryByPlaceholderText('Write your post here...')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Post' })).toBeNull();
  });

  it('calls createPost with correct parameters when a post is submitted', async () => {
    render(<CreatePost forumId={forumId} canPost={true} />);
    const textarea = screen.getByPlaceholderText('Write your post here...');
    const submitButton = screen.getByRole('button', { name: 'Post' });

    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'Test post content' } });
      fireEvent.click(submitButton);
    });

    expect(createPost).toHaveBeenCalledWith(forumId, 'Test post content');
    expect(textarea.value).toBe('');
  });

  it('does not submit empty content', () => {
    render(<CreatePost forumId={forumId} canPost={true} />);
    const submitButton = screen.getByRole('button', { name: 'Post' });

    fireEvent.click(submitButton);

    expect(createPost).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    createPost.mockRejectedValue(new Error('Failed to create post'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<CreatePost forumId={forumId} canPost={true} />);
    const textarea = screen.getByPlaceholderText('Write your post here...');
    const submitButton = screen.getByRole('button', { name: 'Post' });

    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'Test post content' } });
      fireEvent.click(submitButton);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create post', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
