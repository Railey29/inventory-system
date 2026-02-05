"use client";

import { useState } from "react";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function RegisterComponents({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg
            border-gray-600 md:border-gray-300
            bg-gray-800 md:bg-white
            text-white md:text-black
            focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100
            transition-all"
          required
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-2">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg
            border-gray-600 md:border-gray-300
            bg-gray-800 md:bg-white
            text-white md:text-black
            focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100
            transition-all"
          required
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg
            border-gray-600 md:border-gray-300
            bg-gray-800 md:bg-white
            text-white md:text-black
            focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100
            transition-all"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border rounded-lg
              border-gray-600 md:border-gray-300
              bg-gray-800 md:bg-white
              text-white md:text-black
              focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100
              transition-all"
            required
            minLength={8}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 md:text-gray-600 hover:text-blue-400 md:hover:text-blue-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <p className="text-xs text-gray-400 md:text-gray-500 mt-1">
          At least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border rounded-lg
              border-gray-600 md:border-gray-300
              bg-gray-800 md:bg-white
              text-white md:text-black
              focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100
              transition-all"
            required
            minLength={8}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 md:text-gray-600 hover:text-blue-400 md:hover:text-blue-600"
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>

      {/* Sign Up button */}
      <button
        type="submit"
        className="w-full py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200"
      >
        Sign Up
      </button>

      {/* Already have an account link */}
      <p className="text-center text-sm text-gray-400 md:text-gray-600">
        Already have an account?{" "}
        <Link
          href="/"
          className="font-medium text-blue-400 md:text-blue-600 hover:text-blue-500 md:hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
