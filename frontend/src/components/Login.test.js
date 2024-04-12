import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  let setLoginStatusMock;

  beforeEach(() => {
    setLoginStatusMock = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'fakeToken',
          userId: 'userId123',
          username: 'testUser'
        })
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    render(
      <Router>
        <Login setLoginStatus={setLoginStatusMock} />
      </Router>
    );

    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  it('submits credentials and calls setLoginStatus on success', async () => {
    render(
      <Router>
        <Login setLoginStatus={setLoginStatusMock} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
      expect(setLoginStatusMock).toHaveBeenCalledWith(true);
    });
  });

  it('displays an error message when login fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      })
    );

    render(
      <Router>
        <Login setLoginStatus={setLoginStatusMock} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
