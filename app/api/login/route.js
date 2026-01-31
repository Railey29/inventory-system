import { supabase } from "../../../lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("Missing email or Password", { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return new Response("Invalid email or Password", { status: 401 });
    }
    // remove the password from response
    const { password: _, ...userWithoutPassword } = user;
    return new Response(
      JSON.stringify({
        message: "Login Successful",
        user: userWithoutPassword,
      }),
    );
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
