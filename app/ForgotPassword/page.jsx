"use client";

import { useState } from "react";
import Image from "next/image";

import WelcomeIcon from "../components/WelcomeIcon";
import ResetPasswordHeader from "../components/ResetPasswordHeader";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function Page() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = (e) => {
    handleResetPassword(e, { email, newPassword, confirmPassword });
  };

  return (
    <div className="flex h-screen font-inter overflow-hidden bg-gray-50">
      <WelcomeIcon />

      {/* Right Panel - Reset Password Form */}
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
            <ResetPasswordHeader />
          </div>

          {/* Reset Password Form */}
          <div className="animate__animated animate__fadeInUp animate__slow mb-6">
            <ResetPasswordForm
              email={email}
              setEmail={setEmail}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
