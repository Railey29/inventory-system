import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ stat }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}-100`}>
          <stat.icon
            className={`text-${stat.color}-600 w-5 h-5 sm:w-6 sm:h-6`}
          />
        </div>
        <div
          className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${
            stat.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {stat.trend === "up" ? (
            <TrendingUp size={14} className="sm:w-4 sm:h-4" />
          ) : (
            <TrendingDown size={14} className="sm:w-4 sm:h-4" />
          )}
          <span>{stat.change}</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        {stat.value}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
    </div>
  );
}
