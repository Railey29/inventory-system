import {
  BarChart3,
  Package,
  FolderOpen,
  Activity,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  activeTab,
  setActiveTab,
  setSidebarOpen,
}) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: FolderOpen },
    { id: "logs", label: "Inventory Logs", icon: Activity },
    { id: "users", label: "Users", icon: Users },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
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
        className={`fixed left-0 top-14 sm:top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 overflow-hidden ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {sidebarOpen && (
          <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 h-full overflow-y-auto pb-20">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            ))}

            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
              <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm sm:text-base">
                <LogOut size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        )}
      </aside>
    </>
  );
}
