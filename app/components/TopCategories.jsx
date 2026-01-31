import { Download, FolderOpen } from "lucide-react";

export default function TopCategories({ categories }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Top Categories
        </h3>
        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Download size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FolderOpen className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl font-bold text-blue-900">
                {category.percentage}%
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 truncate">
              {category.name}
            </h4>
            <p className="text-sm sm:text-base text-gray-600">
              {category.count} items
            </p>
            <div className="mt-3 sm:mt-4 h-1.5 sm:h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
