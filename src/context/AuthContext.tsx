// src/services/authService.ts
const API_URL = 'http://localhost:5000/login'; // URL of your back-end server

export const authenticateUser = async (username: string, password: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};