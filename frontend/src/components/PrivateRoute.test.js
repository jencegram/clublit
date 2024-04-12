import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const setup = (isAuthenticated, initialEntries = ['/']) => {
  localStorage.clear();
  if (isAuthenticated) {
    localStorage.setItem('token', 'fake-token');
  }

  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<h1>Protected Content</h1>} />
        </Route>
        <Route path="/login" element={<h1>Login Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute Component', () => {
  it('should redirect to login if not authenticated', () => {
    setup(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should allow access to the protected route if authenticated', () => {
    setup(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
