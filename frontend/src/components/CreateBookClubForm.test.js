import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateBookClubForm from './CreateBookClubForm';
import { createBookClub, fetchStates } from '../api/bookClubApi';

jest.mock('../api/bookClubApi');

describe('CreateBookClubForm', () => {
  beforeEach(() => {
    fetchStates.mockResolvedValue([
      { id: 1, name: 'California' },
      { id: 2, name: 'Texas' }
    ]);
    createBookClub.mockClear();
  });

  it('submits the form and navigates on successful book club creation', async () => {
    createBookClub.mockResolvedValue({ clubid: '123' });

    const { container } = render(
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route path="/create" element={<CreateBookClubForm />} />
          <Route path="/bookclubs/:id" element={<h1>Book Club Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchStates).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText('Club Name'), { target: { value: 'New Club' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A great club' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'California' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Los Angeles' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Book Club' }));

    await waitFor(() => expect(createBookClub).toHaveBeenCalledWith({
      clubName: 'New Club',
      description: 'A great club',
      clubType: 'In-Person',
      state: 'California',
      city: 'Los Angeles'
    }));

    expect(container.innerHTML).toContain('Book Club Page');
  });


});
