import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountSettings from './AccountSettings';
import * as userApi from '../api/userApi';

jest.mock('../api/userApi', () => ({
  updatePassword: jest.fn(),
}));

describe('AccountSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields for old password, new password, and confirm new password', () => {
    render(<AccountSettings />);
    expect(screen.getByTestId('oldPassword')).toBeInTheDocument();
    expect(screen.getByTestId('newPassword')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
  });

  it('shows a feedback message when new passwords do not match', async () => {
    render(<AccountSettings />);

    await userEvent.type(screen.getByTestId('oldPassword'), 'oldpass');
    await userEvent.type(screen.getByTestId('newPassword'), 'newpass');
    await userEvent.type(screen.getByTestId('confirmPassword'), 'newpass2');
    userEvent.click(screen.getByRole('button', { name: /change password/i }));

    const feedbackMessage = await screen.findByText("New passwords don't match!");
    expect(feedbackMessage).toBeInTheDocument();
  });

  it('shows a success message on successful password update', async () => {
    userApi.updatePassword.mockResolvedValue({ message: 'Password successfully updated!' });
    render(<AccountSettings />);

    await userEvent.type(screen.getByTestId('oldPassword'), 'oldpass');
    await userEvent.type(screen.getByTestId('newPassword'), 'newpass');
    await userEvent.type(screen.getByTestId('confirmPassword'), 'newpass');
    userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await screen.findByText('Password successfully updated!');
    expect(screen.getByText('Password successfully updated!')).toBeInTheDocument();
  });

  it('shows an error message on failed password update', async () => {
    userApi.updatePassword.mockRejectedValue(new Error('Failed to update password'));
    render(<AccountSettings />);

    await userEvent.type(screen.getByTestId('oldPassword'), 'oldpass');
    await userEvent.type(screen.getByTestId('newPassword'), 'newpass');
    await userEvent.type(screen.getByTestId('confirmPassword'), 'newpass');
    userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await screen.findByText('Failed to update password');
    expect(screen.getByText('Failed to update password')).toBeInTheDocument();
  });
});
