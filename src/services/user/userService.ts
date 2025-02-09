const API_URL = import.meta.env.VITE_API_URL;

export const signUp = async (email: string, fullName: string, password: string, google = false) => {
  const endpoint = google ? 'auth/register?method=google' : 'auth/register';
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name: fullName }),
  });

  if (!response.ok) {
    const responseData = await response.json();
    const message = responseData.message || 'A registration error occurred';
    throw new Error(message);
  }

  return response.json();
};
