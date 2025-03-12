const apiUrl = import.meta.env.VITE_API_URL;

export const generateTransactions = async (accountId: string) => {
  try {
    const response = await fetch(`${apiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to create transactions:', error);
    throw error;
  }
};

export const getTransactions = async (accountId: string) => {
  try {
    const response = await fetch(`${apiUrl}/transactions/account/${accountId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to get transactions:', error);
    throw error;
  }
};
