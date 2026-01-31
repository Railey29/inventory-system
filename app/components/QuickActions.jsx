import { Plus, FolderOpen, ShoppingCart, Download } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: Plus, label: "Add Product", primary: true },
    { icon: FolderOpen, label: "Add Category", primary: false },
    { icon: ShoppingCart, label: "New Transaction", primary: false },
    { icon: Download, label: "Generate Report", primary: false },
  ];

  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 font-semibold rounded-lg shadow-lg transition-all text-sm sm:text-base ${
            action.primary
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
          }`}
        >
          <action.icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">{action.label}</span>
          <span className="sm:hidden text-xs">
            {action.label.split(" ")[0]}
          </span>
        </button>
      ))}
    </div>
  );
}
