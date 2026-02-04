// app/register/page.jsx
"use client";

// ✅ Force this route to be dynamic (server-rendered)
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";
import Image from "next/image";

import WelcomeIcon from "../components/WelcomeIcon";
import RegisterHeader from "../components/RegisterHeader";
import RegisterForm from "../components/RegisterForm";
import { handleFormSubmit } from "../utils/formHandlers";
import { handleSubmitRegister } from "../controller/registerController";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    handleFormSubmit({
      e,
      controllerFn: handleSubmitRegister,
      data: { name, email, password, role },
      setLoading,
      onSuccess: (response) => {
        alert(response.message || "Account Created successfully!");
        window.location.href = "/";
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
            <RegisterHeader />
          </div>

          <div className="animate__animated animate__fadeInUp animate__slow mb-4">
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              role={role}
              setRole={setRole}
              onSubmit={onSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
