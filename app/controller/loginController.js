// app/controllers/loginController.js
import { supabase } from "../../lib/supabaseClient";

/**
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<object>} data containing { user, session }
 */
export const handleSubmitLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  // Client-side Supabase login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Return data to be used by handleFormSubmit
  return data; // { user, session }
};
