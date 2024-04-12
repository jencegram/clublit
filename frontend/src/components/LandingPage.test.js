import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  test('renders LandingPage with links to log in and sign up', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    // Check if the main welcome message is displayed
    expect(screen.getByText('Welcome to ClubLit')).toBeInTheDocument();

    // Check if the link to log in is rendered
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');

    // Check if the link to sign up is rendered
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
  });
});
