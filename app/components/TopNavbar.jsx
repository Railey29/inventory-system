"use client";

import { X, Menu, Sun, Moon } from "lucide-react";
import { useAuth } from "../hook/useAuth";
import { getDisplayName, getAvatarLetter } from "../utils/userHelper";
import { useEffect } from "react";

// Import Animate.css
import "animate.css";

export default function TopNavbar({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
}) {
  const { userEmail, displayName, loading } = useAuth();

  const displayedName = getDisplayName(null, userEmail);
  const avatarLetter = getAvatarLetter(null, userEmail);

  // Load dark mode from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, [setDarkMode]);

  // Save dark mode to localStorage when it changes
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <nav
      className={`fixed w-full z-30 top-0 shadow-sm border-b ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo - changes based on dark mode */}
            <img
              src={darkMode ? "/logo.png" : "/logo2.png"}
              alt="logo"
              className="h-8 sm:h-10 w-auto animate__animated animate__fadeIn animate__slow"
            />
          </div>

          {/* Right side - User Profile + Dark Mode Toggle */}
          <div
            className={`flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* User Profile */}
            <div className="text-right hidden md:block">
              {loading ? (
                <p className="text-xs lg:text-sm font-medium text-gray-400">
                  Loading...
                </p>
              ) : (
                <>
                  <p
                    className={`text-xs lg:text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {displayedName}
                  </p>
                  <p
                    className={`text-[10px] lg:text-xs ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Admin
                  </p>
                </>
              )}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm sm:text-base font-semibold">
              {avatarLetter}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
