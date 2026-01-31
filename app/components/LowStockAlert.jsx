import { AlertTriangle } from "lucide-react";

export default function LowStockAlert({ items }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Low Stock Alert
        </h3>
        <AlertTriangle className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
      </div>

      <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base truncate">
              {item.name}
            </p>
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
              <span className="text-gray-600">Current</span>
              <span className="font-semibold text-yellow-700">
                {item.current}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Minimum</span>
              <span className="font-semibold text-gray-700">
                {item.minimum}
              </span>
            </div>
            <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{
                  width: `${Math.min((item.current / item.minimum) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 sm:mt-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors flex-shrink-0">
        Restock Items
      </button>
    </div>
  );
}
