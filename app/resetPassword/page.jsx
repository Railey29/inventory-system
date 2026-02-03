// app/reset-password/page.jsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import WelcomeIcon from "../components/WelcomeIcon";
import ResetPasswordFormComponent from "../components/ResetPasswordForm";
import ResetPasswordHeader from "../components/ResetPasswordHeader";
import { handleResetPassword } from "../controller/resetPasswordController";
import { handleFormSubmit } from "../utils/formHandlers";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get the token from URL
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  // ✅ Check validity directly, no useEffect
  const isValidResetLink = token && type === "recovery";

  const onSubmit = (e) => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Use the utility function
    handleFormSubmit({
      e,
      controllerFn: handleResetPassword,
      data: newPassword,
      setLoading,
      onSuccess: (response) => {
        setSuccess(
          response.message ||
            "Password updated successfully! Redirecting to login...",
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      },
      onError: (error) => setError(error.message),
    });
  };

  return (
    <div className="flex h-screen font-inter overflow-hidden bg-gray-50">
      <WelcomeIcon />

      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
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

          {/* Header */}
          <div className="animate__animated animate__fadeInDown animate__slow mb-6">
            <ResetPasswordHeader />
          </div>

          {/* ✅ Show error if invalid reset link */}
          {!isValidResetLink && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg animate__animated animate__fadeIn">
              Invalid or expired reset link
            </div>
          )}

          {/* Error Message from form validation */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg animate__animated animate__fadeIn">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg animate__animated animate__fadeIn">
              {success}
            </div>
          )}

          {/* ✅ Show form only if valid reset link and no success */}
          {isValidResetLink && !success && (
            <div className="animate__animated animate__fadeInUp animate__slow">
              <ResetPasswordFormComponent
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={onSubmit}
                loading={loading}
              />
            </div>
          )}

          {/* Back to Login Link */}
          {!isValidResetLink && (
            <div className="mt-4 text-center animate__animated animate__fadeIn">
              <button
                onClick={() => router.push("/")}
                className="text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
