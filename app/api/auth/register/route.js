import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response("Missing fields", { status: 400 });
    }

    // Supabase Auth Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }, // custom user metadata
      },
    });

    if (error) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      JSON.stringify({ message: "Account Created", user: data.user }),
      { status: 201 },
    );
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
