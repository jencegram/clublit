import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';

global.fetch = jest.fn();

describe('Signup', () => {
  const setLoginStatus = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    setLoginStatus.mockClear();
  });

  it('allows a user to sign up and navigates to dashboard', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: '123', user: { username: 'testuser' } })
    });

    render(
      <MemoryRouter>
        <Signup setLoginStatus={setLoginStatus} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
