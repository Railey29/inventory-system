"use client";

import { useState } from "react";
import Image from "next/image";

import RegisterHeader from "../components/RegisterHeader";
import RegisterComponents from "../components/RegisterComponents";
import WelcomeIcon from "../components/WelcomeIcon";
import { handleSubmitRegister } from "../controller/registerController";
export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const onSubmit = (e) => {
    handleSubmitRegister(e, { name, email, password, confirmPassword, role });
  };

  return (
    <div className="flex h-screen font-inter overflow-hidden">
      <WelcomeIcon />

      {/* Right Panel - Register Form */}
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
            <RegisterHeader />
          </div>

          {/* Register Form */}
          <div className="animate__animated animate__fadeInUp animate__slow mb-6">
            <RegisterComponents
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
