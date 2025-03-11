import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export const scheduleTokenRefresh = async () => {
  // Clear any existing timeout to prevent overlaps
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  const { data } = await supabase.auth.getSession();

  let expiresAt = data.session!.expires_at!;
  console.log('Token expiration time:', new Date(expiresAt * 1000).toLocaleString());
  const buffer = 300; // 5 minutes in seconds
  const now = Math.floor(Date.now() / 1000);

  // Check if token is expired or will expire within the buffer period
  if (expiresAt <= now + buffer) {
    console.warn('Token is expiring soon or already expired! Attempting to refresh...');

    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session) {
      console.error('Refresh failed, logging out...');
      await supabase.auth.signOut();
      return;
    }

    console.log('Token refreshed successfully!');
    expiresAt = refreshData.session.expires_at!; // Update with new expiration time
  }

  const newExpiresIn = expiresAt - now;

  if (newExpiresIn <= 0) {
    console.error('Token expiration time is invalid');
    return;
  }

  // Schedule next refresh 5 minutes before the new expiration
  const delay = Math.max(0, newExpiresIn - buffer) * 1000;
  console.log(`Scheduling token refresh in ${Math.floor(delay / 1000)} seconds`);

  refreshTimeout = setTimeout(async () => {
    await scheduleTokenRefresh();
  }, delay);
};

const isFirstGoogleSignIn = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return false;
  }

  // Step 3: Find the Google identity in the user's identities array
  const googleIdentity = user.identities?.find(identity => identity.provider === 'google');

  if (!googleIdentity) {
    console.log('No Google identity found for this user.');
    return false;
  }

  console.log('Google identity found:', googleIdentity);

  // Step 4: Check if the Google identity was created within the last 30 seconds
  const identityCreatedAt = new Date(googleIdentity.created_at as string).getTime();
  const now = Date.now();
  const isFirstTime = now - identityCreatedAt < 30000; // 30 second threshold

  return isFirstTime;
};

export const checkSessionOnStartup = async () => {
  const { data, error } = await supabase.auth.getSession();
  const session = data?.session;

  if (error || !data.session) {
    console.log('No active session');
    return;
  }
  console.log('User session found:', session);

  const isFirstSignIn = await isFirstGoogleSignIn();

  const hasFinancialProfile = async () => {
    const { data, error } = await supabase.from('user_financial_profiles').select().eq('user_id', session?.user.id);
    if (error) {
      console.error('Error fetching financial profile:', error);
      return false;
    }
    return data.length > 0;
  };

  if (isFirstSignIn) {
    if (await hasFinancialProfile()) {
      console.log('User has already completed the onboarding process');
      return;
    }
    if (!location.href.includes('/profile-select')) location.href = '/profile-select';
    return;
  }

  scheduleTokenRefresh();
};

window.addEventListener('load', checkSessionOnStartup);

export default supabase;
