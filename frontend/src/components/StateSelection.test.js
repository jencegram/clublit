import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StateSelection from './StateSelection';

global.fetch = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('StateSelection', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', name: 'California' },
        { id: '2', name: 'Texas' }
      ])
    });
  });

  it('renders states fetched from an API', async () => {
    render(<Router><StateSelection /></Router>);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/states");
    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument();
      expect(screen.getByText('Texas')).toBeInTheDocument();
    });
  });
});
