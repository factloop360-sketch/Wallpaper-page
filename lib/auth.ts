import { supabase } from "./supabase";

/**
 * Initiates a Google OAuth sign-in flow.
 * Redirects the user to the Google login page.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // For Next.js 15 App Router, ensure this matches your Supabase redirect URI whitelist
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Signs out the current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Retrieves the current user session.
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Retrieves the current user data.
 */
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};