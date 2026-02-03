"use client";

import { useState } from "react";
import Image from "next/image";

import WelcomeIcon from "../components/WelcomeIcon";
import LoginHeader from "../components/LoginHeader";
import LoginForm from "../components/LoginForm";
import { handleSubmitLogin } from "../controller/loginController";
import { handleFormSubmit } from "../utils/formHandlers";

import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    handleFormSubmit({
      e,
      controllerFn: handleSubmitLogin,
      data: { email, password },
      setLoading,
      onSuccess: async (response) => {
        try {
          // Set Supabase session
          await supabase.auth.setSession(response.session);

          alert("Login Successful!");
          console.log("Session: ", response.session);

          window.location.href = "/dashboard";
        } catch (err) {
          console.error("Failed to set session:", err);
          alert("Login failed, please try again.");
        }
      },
      onError: (error) => alert(error.message),
    });
  };

  return (
    <div className="flex h-screen font-inter overflow-hidden">
      <WelcomeIcon />

      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-4">
            <div className="mb-2 w-full max-w-md drop-shadow-2xl mt-10 hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeInDown animate__slow">
              <Image
                src="/logo2.png"
                alt="Company Logo"
                width={400}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="animate__animated animate__fadeInDown animate__slow mb-2">
            <LoginHeader />
          </div>

          <div className="animate__animated animate__fadeInUp animate__slow mb-4">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={onSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
