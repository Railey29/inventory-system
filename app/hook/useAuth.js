"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export const useAuth = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1️⃣ Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/"); // Not authenticated → redirect
          return;
        }

        setUserEmail(session.user.email);

        // 2️⃣ Fetch user from auth.users to get display_name
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error.message);
          setDisplayName(null);
        } else {
          // Get display_name from user metadata
          setDisplayName(user?.user_metadata?.display_name || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error.message);
        router.push("/"); // fallback
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.push("/");
        setUserEmail(null);
        setDisplayName(null);
        setLoading(false);
      } else {
        setUserEmail(session.user.email);

        // Fetch user to get display_name
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          setDisplayName(null);
        } else {
          setDisplayName(user?.user_metadata?.display_name || null);
        }

        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return { userEmail, displayName, loading };
};
