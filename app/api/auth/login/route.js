import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("Missing email or password", { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response("Invalid email or password", { status: 401 });
    }

    return new Response(
      JSON.stringify({
        message: "Login Successful",
        user: data.user,
        session: data.session, // contains access_token and refresh_token
      }),
    );
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
