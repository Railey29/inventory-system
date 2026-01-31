import { Search, Bell, Settings, X, Menu } from "lucide-react";

export default function TopNavbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X size={20} className="sm:w-6 sm:h-6" />
              ) : (
                <Menu size={20} className="sm:w-6 sm:h-6" />
              )}
            </button>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent whitespace-nowrap">
              Inventory System
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            {/* Search - Desktop only */}
            <div className="relative hidden lg:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-48 xl:w-64"
              />
            </div>

            {/* Search Icon - Mobile */}
            <button className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings - Hidden on mobile */}
            <button className="hidden sm:block p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings size={20} />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-xs lg:text-sm font-medium text-gray-900">
                  Admin User
                </p>
                <p className="text-[10px] lg:text-xs text-gray-500">
                  Administrator
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
