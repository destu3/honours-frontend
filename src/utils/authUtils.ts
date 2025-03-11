import supabase from '../services/supabase/supabase';

export async function getUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return;
  }

  return user?.id; // Returns the authenticated user's UUID
}
