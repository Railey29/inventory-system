import bcrypt from "bcryptjs";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response("Missing fields", { status: 400 });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new Response("Email already registered", { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, role }]);

    if (error) return new Response(error.message, { status: 500 });
    return new Response(JSON.stringify({ message: "Account Created", data }), {
      status: 201,
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
