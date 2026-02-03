// app/api/auth/resetPassword/route.js
import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Update the user's password
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Password updated successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
