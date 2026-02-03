"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm({
  email,
  setEmail,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Email"}
      </button>

      {/* Footer */}
      <p className="text-sm text-center text-gray-600">
        Remembered your password?{" "}
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
