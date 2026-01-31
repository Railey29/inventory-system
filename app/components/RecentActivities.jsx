import { Filter } from "lucide-react";

export default function RecentActivities({ activities }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Recent Activities
        </h3>
        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Filter size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
          >
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 ${
                  activity.type === "IN"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {activity.type}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {activity.product}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {activity.category} • {activity.user}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                {activity.quantity} units
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 sm:mt-4 py-2 sm:py-3 text-sm sm:text-base text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
        View All Activities
      </button>
    </div>
  );
}
