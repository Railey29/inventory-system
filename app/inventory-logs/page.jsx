"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  Activity,
  User,
  Package,
  TrendingDown,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { recentActivities, lowStockItems } from "../utils/DashboardData";

// Generate logs client-side
const generateLogs = (getTime) => {
  const logs = [];
  let idCounter = 1;

  recentActivities.forEach((activity) => {
    const isIn = activity.type === "IN";
    logs.push({
      id: idCounter++,
      action: isIn ? "Stock Added" : "Stock Removed",
      product: activity.product,
      user: activity.user,
      quantity: `${isIn ? "+" : "-"}${activity.quantity} units`,
      previousStock: isIn ? activity.quantity * 4 : activity.quantity * 6,
      newStock: isIn ? activity.quantity * 5 : activity.quantity * 5,
      timestamp: getTime(),
      date: `Feb 3, 2026 • ${getTime()}`,
      type: isIn ? "add" : "remove",
      icon: isIn ? PlusCircle : TrendingDown,
      color: isIn ? "text-emerald-600" : "text-red-600",
      bgColor: isIn ? "bg-emerald-50" : "bg-red-50",
    });
  });

  lowStockItems.forEach((item) => {
    logs.push({
      id: idCounter++,
      action: "Low Stock Alert",
      product: item.name,
      user: "System",
      quantity: `${item.current} units remaining`,
      previousStock: item.current,
      newStock: item.current,
      timestamp: "2 hours ago",
      date: `Feb 3, 2026 • ${getTime()}`,
      type: "alert",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    });
  });

  return logs;
};

export default function InventoryLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [logs, setLogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLogInput, setNewLogInput] = useState({
    action: "Stock Added",
    product: "",
    user: "",
    quantity: "",
    previousStock: 0,
    newStock: 0,
    type: "add",
  });

  useAuth();

  // Client-only timestamp to fix hydration
  const getClientTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogs(generateLogs(getClientTime));
  }, []);

  const addLog = () => {
    if (!newLogInput.product || !newLogInput.user || !newLogInput.quantity)
      return;

    const qty = parseInt(newLogInput.quantity) || 0;
    const isAdd = newLogInput.action === "Stock Added";
    const log = {
      ...newLogInput,
      previousStock: isAdd ? 10 : 15,
      newStock: isAdd ? 10 + qty : 15 - qty,
      timestamp: getClientTime(),
      date: `Feb 3, 2026 • ${getClientTime()}`,
      icon: isAdd ? PlusCircle : TrendingDown,
      color: isAdd ? "text-emerald-600" : "text-red-600",
      bgColor: isAdd ? "bg-emerald-50" : "bg-red-50",
      id: logs.length + 1,
    };

    setLogs([log, ...logs]);
    setShowAddForm(false);
    setNewLogInput({
      action: "Stock Added",
      product: "",
      user: "",
      quantity: "",
      previousStock: 0,
      newStock: 0,
      type: "add",
    });
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  const statsData = [
    {
      label: "Total Activities",
      value: logs.length.toString(),
      change: `+${recentActivities.length} today`,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Stock Added",
      value: logs.filter((l) => l.type === "add").length.toString(),
      change: "+12 today",
      icon: PlusCircle,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Stock Removed",
      value: logs.filter((l) => l.type === "remove").length.toString(),
      change: "+5 today",
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Alerts Generated",
      value: logs.filter((l) => l.type === "alert").length.toString(),
      change: `${lowStockItems.length} active`,
      icon: AlertCircle,
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm">
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSidebarOpen={setSidebarOpen}
      />

      <main
        className={`pt-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Inventory Logs
            </h1>

            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Log
              </button>
            ) : (
              <div className="flex gap-2 items-center flex-wrap bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <select
                  value={newLogInput.action}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewLogInput({
                      ...newLogInput,
                      action: val,
                      type: val === "Stock Added" ? "add" : "remove",
                    });
                  }}
                  className="px-2 py-1 border rounded-lg"
                >
                  <option>Stock Added</option>
                  <option>Stock Removed</option>
                </select>

                <input
                  type="text"
                  placeholder="Product Name"
                  value={newLogInput.product}
                  onChange={(e) =>
                    setNewLogInput({ ...newLogInput, product: e.target.value })
                  }
                  className="px-2 py-1 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="User"
                  value={newLogInput.user}
                  onChange={(e) =>
                    setNewLogInput({ ...newLogInput, user: e.target.value })
                  }
                  className="px-2 py-1 border rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={newLogInput.quantity}
                  onChange={(e) =>
                    setNewLogInput({ ...newLogInput, quantity: e.target.value })
                  }
                  className="px-2 py-1 border rounded-lg w-20"
                />

                <button
                  onClick={addLog}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>

                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <div key={index}>
                <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                    >
                      <stat.icon className="text-white" size={20} />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Showing {filteredLogs.length} of {logs.length} activities
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 ${log.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <log.icon className={log.color} size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {log.action}
                          </h3>
                          <p className="text-slate-600">{log.product}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-slate-900">
                            {log.timestamp}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {log.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <span className="text-slate-600">{log.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-slate-400" />
                          <span className={`font-semibold ${log.color}`}>
                            {log.quantity}
                          </span>
                        </div>
                        {log.previousStock !== log.newStock && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                            <span className="text-slate-500">
                              {log.previousStock}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="font-semibold text-slate-900">
                              {log.newStock}
                            </span>
                            <span className="text-xs text-slate-500">
                              units
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
