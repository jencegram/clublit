/**
 * Updates the user's password with new credentials provided by the user.
 * This function requires the user to be authenticated and have a valid token.
 */
const API_URL = 'http://clublit.onrender.com/api';

export const updatePassword = async ({ oldPassword, newPassword }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/updatePassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message);
  }

  return await response.json();
};
