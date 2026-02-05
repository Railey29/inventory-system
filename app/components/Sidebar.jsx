"use client";
import {
  BarChart3,
  Package,
  FolderOpen,
  Activity,
  Users,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogout } from "../controller/logoutController";
import { handleFormSubmit } from "../utils/formHandlers";

export default function Sidebar({
  sidebarOpen,
  activeTab,
  setActiveTab,
  setSidebarOpen,
  darkMode,
}) {
  const router = useRouter();

  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      id: "Parcel Shipped",
      label: "Parcel Shipped",
      icon: Package,
      path: "/parcel-shipped",
    },
    {
      id: "Parcel Delivery",
      label: "Parcel Delivery",
      icon: FolderOpen,
      path: "/parcel-delivery",
    },
    {
      id: "Out of Stock",
      label: "Out of Stock",
      icon: Activity,
      path: "/out-of-stock",
    },
    { id: "users", label: "Users", icon: Users, path: "/users" },
  ];

  const handleMenuClick = (id, path) => {
    setActiveTab(id);

    // Navigate to the page
    router.push(path);

    // Close sidebar on mobile after clicking
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 sm:top-16 h-full border-r transition-all duration-300 z-20 overflow-hidden ${
          sidebarOpen ? "w-64 sm:w-72 lg:w-64" : "w-0"
        } ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {sidebarOpen && (
          <nav className="p-4 sm:p-5 lg:p-4 space-y-2 h-full overflow-y-auto pb-20">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`w-full flex items-center space-x-3 sm:space-x-4 lg:space-x-3 px-4 sm:px-5 lg:px-4 py-3 sm:py-3.5 lg:py-3 rounded-lg transition-all text-base sm:text-lg lg:text-base ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}

            <div
              className={`pt-4 mt-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={(e) =>
                  handleFormSubmit({
                    e,
                    controllerFn: handleLogout,
                    onSuccess: () => {
                      // Redirect to login page after logout
                      window.location.href = "/";
                    },
                    onError: (err) => alert(err.message),
                  })
                }
                className={`w-full flex items-center space-x-3 sm:space-x-4 lg:space-x-3 px-4 sm:px-5 lg:px-4 py-3 sm:py-3.5 lg:py-3 rounded-lg transition-all text-base sm:text-lg lg:text-base cursor-pointer ${
                  darkMode
                    ? "text-red-400 hover:bg-red-900/20"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        )}
      </aside>
    </>
  );
}
