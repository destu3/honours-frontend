const apiUrl = import.meta.env.VITE_API_URL;

export const getGoals = async (userId: string) => {
  try {
    const response = await fetch(`${apiUrl}/goals/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    throw error;
  }
};
