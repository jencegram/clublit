// Define the base API URL for local development.
const API_URL = 'http://localhost:5000/api';

/**
 * Creates a new book club using the provided book club data.
 */
export const createBookClub = async (bookClubData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookclubs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookClubData)
    });

    if (!response.ok) {
      const errorBody = await response.json();  
      throw new Error(errorBody.message);  
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating book club:', error);
    throw error;
  }
};

/**
 * Fetches all book clubs accessible to the user.
 * Requires authentication.
 */
export const fetchBookClubs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookclubs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book clubs');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book clubs:', error);
    throw error;
  }
};

/**
 * Fetches details of a specific book club identified by clubId.
 * Requires authentication.
 */
export const fetchBookClubDetails = async (clubId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookclubs/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book club details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book club details:', error);
    throw error;
  }
};

/**
 * Fetches the book clubs that the logged-in user has joined.
 * Requires authentication.
 */
export const fetchMyBookClubs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/bookclubs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorDetails = await response.text(); 
      throw new Error(`Failed to fetch my book clubs: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching my book clubs:', error);
    throw error; 
  }
};

/**
 * Fetches a list of states from the server.
 */
export const fetchStates = async () => {
  const response = await fetch(`${API_URL}/states`, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }

  return await response.json();
};

/**
 * Fetches book clubs specific to a given state.
 */
export const fetchStateSpecificBookClubs = async (stateName) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookclubs/state/${encodeURIComponent(stateName)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch state-specific book clubs');
  }

  return await response.json();
};

/**
 * Fetches the list of all available genres from the server.
 */
export const fetchGenres = async () => {
  try {
    const response = await fetch(`${API_URL}/genres`);
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const genres = await response.json();
    return genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

/**
 * Fetches user preferences either for a specified user or the currently logged-in user.
 */
export const getUserPreferences = async (userId = '') => {
  const token = localStorage.getItem('token');
  const endpoint = userId ? `/profile/preferences/${userId}` : `/profile/preferences`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user preferences');
  }
  return await response.json();
};

/**
 * Updates user preferences with the provided data.
 */
export const updateUserPreferences = async (preferences) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/profile/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) {
    throw new Error('Failed to update user preferences');
  }
  return await response.json();
};

/**
 * Updates details for a specific book club.
 */
export const updateBookClubDetails = async (clubId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookclubs/${clubId}/update`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json(); 
      throw new Error(error.message || 'Failed to update book club details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating book club details:', error);
    throw error;
  }
};



/**
 * Fetches details of a specific forum by its ID.
 */
export const fetchForumDetails = async (forumId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forums/details/${forumId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch forum details');
  }

  return await response.json();
};

/**
 * Fetches all forums associated with a given book club ID.
 */
export const fetchForumsByClubId = async (clubId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forums/club/${clubId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch forums');
  }
  return await response.json();
};

/**
 * Fetches all posts associated with a given forum ID.
 */
export const fetchPostsByForumId = async (forumId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/posts/forum/${forumId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Creates a new post in a specific forum.
 */
export const createPost = async (forumId, content) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ forumId, content })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error('Failed to create post: ' + error);
    }

    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Joins a book club.
 */
export const joinBookClub = async (clubId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookclubs/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ clubId }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType.includes("application/json")) {
        const result = await response.json();
        throw new Error(result.message);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in joinBookClub: ${error}`);
    throw error;
  }
};



/**
 * Checks if the user is a member of a specified book club.
 */
export const checkMembership = async (clubId,) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookclubs/${clubId}/check-membership`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Failed to check membership: ' + error);
  }

  return await response.json();
};

/**
 * Leaves a book club.
 */
export const leaveBookClub = async (clubId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookclubs/${clubId}/leave`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to leave book club');
  }
};