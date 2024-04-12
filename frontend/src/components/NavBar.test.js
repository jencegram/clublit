import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn().mockImplementation(() => () => {}),
}));

describe('Navbar', () => {
  const onLogoutMock = jest.fn();

  it('renders Navbar correctly when logged in', () => {
    render(
      <Router>
        <Navbar isLoggedIn={true} onLogout={onLogoutMock} />
      </Router>
    );

    // Check for specific NavLink texts
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Book Clubs')).toBeInTheDocument();
    expect(screen.getByText('Profile Preferences')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    
    // Use getByRole for the button to clearly differentiate it
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('does not render Navbar when not logged in', () => {
    render(
      <Router>
        <Navbar isLoggedIn={false} onLogout={onLogoutMock} />
      </Router>
    );

    // Ensure that no links or buttons are rendered when not logged in
    expect(screen.queryByText('Home Page')).toBeNull();
    expect(screen.queryByText('Logout')).toBeNull();
  });

  it('calls the onLogout function when logout is clicked', () => {
    render(
      <Router>
        <Navbar isLoggedIn={true} onLogout={onLogoutMock} />
      </Router>
    );

    // Use getByRole to select the logout button
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);
    
    // Verify the onLogout function is called
    expect(onLogoutMock).toHaveBeenCalled();
  });
});
