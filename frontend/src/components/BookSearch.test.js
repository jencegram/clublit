import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookSearch from './BookSearch';

global.fetch = jest.fn();

const mockOnAdd = jest.fn();
const mockSetShowResults = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  fetch.mockClear();
});


it('calls onAdd when the "Add" button is clicked next to a book', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({
      docs: [
        { title: "Example Book", author_name: ["Author"] }
      ]
    })
  });

  render(
    <BookSearch
      onAdd={mockOnAdd}
      showResults={true}
      setShowResults={mockSetShowResults}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Search books...'), {
    target: { value: 'example' }
  });
  fireEvent.click(screen.getByText('Search'));

  await waitFor(() => {
    const addBtn = screen.getByText('Add');
    fireEvent.click(addBtn);
    expect(mockOnAdd).toHaveBeenCalledWith({ title: "Example Book", author_name: ["Author"] });
  });
});


