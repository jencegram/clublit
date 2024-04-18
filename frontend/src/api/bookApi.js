// Define API base URL and external API URL
const API_URL = 'https://clublit.onrender.com/api';
const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

/**
 * Fetches books the user is currently reading.
 */
export const fetchCurrentlyReading = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/currently-reading`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch currently reading books');
  }
  const data = await response.json();
  return data;
};

/**
 * Fetches books the user has finished reading.
 */
export const fetchFinishedBooks = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/finished`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch finished books');
  }
  return response.json();
};

/**
 * Searches for books using the Open Library API based on a query string.
 */
export const searchBooks = async (query) => {
  const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search books');
  }
  return response.json();
};

/**
 * Adds a book to the currently reading list.
 * Requires authorization token and book data.
 */
export const addBookToCurrentlyReading = async (bookData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/currently-reading`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    const errorBody = await response.text(); 
    throw new Error(`Failed to add book to currently reading list: ${errorBody}`);
  }
  return response.json();
};

/**
 * Marks a book as finished.
 * Requires authorization token and book ID.
 */
export const markBookAsFinished = async (bookId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/currently-reading/${bookId}/finish`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to mark book as finished');
  }
  return response.json();
};

/**
 * Fetches finished books for a specific user by their user ID.
 * Requires authorization token and user ID.
 */
export const fetchUsersFinishedBooks = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${userId}/finished`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch finished books for user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchUsersFinishedBooks:", error);
    throw error; 
  }
};


export const fetchCurrentlyReadingForUser = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${userId}/currently-reading`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch currently reading books for user');
  }
  return response.json();
};
