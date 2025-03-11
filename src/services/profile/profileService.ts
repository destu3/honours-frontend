const apiUrl = import.meta.env.VITE_API_URL;

export const getBaseProfiles = async () => {
  try {
    const response = await fetch(`${apiUrl}/profiles`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    throw error;
  }
};

export const createUserFinancialProfile = async (selectedProfileId: number, userId: string | undefined) => {
  try {
    const response = await fetch(`${apiUrl}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, selectedProfileId }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to create profile:', error);
    throw error;
  }
};
