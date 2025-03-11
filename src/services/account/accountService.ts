const apiUrl = import.meta.env.VITE_API_URL;

export const createAccounts = async (userProfileId: string, userProfileCurrentIncome: number) => {
  try {
    const response = await fetch(`${apiUrl}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfileId,
        userProfileCurrentIncome,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to create accounts:', error);
    throw error;
  }
};
