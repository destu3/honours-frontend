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

export const getAccountIdFromUserId = async (userId: string | undefined) => {
  try {
    const response = await fetch(`${apiUrl}/accounts/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to get account id:', error);
    throw error;
  }
};

export const getCurrentAccountBalance = async (accountId: string) => {
  try {
    const response = await fetch(`${apiUrl}/accounts/${accountId}/balance`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to get account balance:', error);
    throw error;
  }
};
