"use client";

import { useState } from "react";
import Image from "next/image";

import WelcomeIcon from "./components/WelcomeIcon";
import LoginHeader from "./components/LoginHeader";
import LoginComponents from "./components/LoginComponents";

import { handleSubmitLogin } from "./controller/loginController";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    handleSubmitLogin(e, { email, password });
  };

  return (
    <div className="flex h-screen font-inter overflow-hidden">
      <WelcomeIcon />

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-4">
            <div className="mb-2 w-full max-w-md drop-shadow-2xl mt-40 hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeInDown animate__slow">
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

          {/* Header */}
          <div className="animate__animated animate__fadeInDown animate__slow mb-4">
            <LoginHeader />
          </div>

          {/* Login Form */}
          <div className="animate__animated animate__fadeInUp animate__slow mb-6">
            <LoginComponents
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
