"use client";

export default function ResetPasswordFormComponent({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Enter new password"
          className="w-full px-4 py-2 border rounded-lg
            border-gray-600 md:border-gray-300
            bg-gray-800 md:bg-white
            text-white md:text-black
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={loading}
          minLength={8}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
          title="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
        />
        <p className="text-xs text-gray-400 md:text-gray-500 mt-1">
          At least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 md:text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm new password"
          className="w-full px-4 py-2 border rounded-lg
            border-gray-600 md:border-gray-300
            bg-gray-800 md:bg-white
            text-white md:text-black
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={loading}
          minLength={8}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
          title="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
