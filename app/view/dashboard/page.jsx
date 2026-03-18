/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import AuthGuard from "../../components/AuthGuard";
import {
  PackageCheck,
  PackageOpen,
  Package,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Box,
  Boxes,
  CalendarDays,
  Filter,
} from "lucide-react";
import "animate.css";

import { fetchParcelItems } from "../../utils/parcelShippedHelper"; // parcel_in
import { fetchParcelOutItems } from "../../utils/parcelOutHelper"; // parcel_out
import {
  fetchProductInController,
  fetchProductOutController,
} from "../../controller/productController"; // Product IN/OUT
import { buildProductCode, buildSku } from "../../utils/inventoryMeta";

export default function page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);

  const [parcelShipped, setParcelShipped] = useState([]);
  const [parcelDelivery, setParcelDelivery] = useState([]);
  const [stockItems, setStockItems] = useState([]); // Items from parcel_in

  // Product IN/OUT states
  const [productIn, setProductIn] = useState([]);
  const [productOut, setProductOut] = useState([]);

  // Search
  const [inventorySearch, setInventorySearch] = useState("");

  // Calendar filter states
  const [calendarView, setCalendarView] = useState("month"); // day | week | month
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    const weekNumber = getISOWeek(today);
    return `${today.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
  });

  const router = useRouter();

  // Helper to get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) return "out";
    if (quantity <= 5) return "critical";
    if (quantity < 10) return "low";
    return "available";
  };

  // Helper to get status label
  const getStatusLabel = (quantity) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Critical Level";
    if (quantity < 10) return "Low Stock";
    return "Available";
  };

  // Helper to get status color
  const getStatusColor = (quantity, darkMode) => {
    if (quantity === 0) {
      return darkMode
        ? "bg-red-900/30 text-red-400 border border-red-800"
        : "bg-red-50 text-red-700 border border-red-200";
    }
    if (quantity <= 5) {
      return darkMode
        ? "bg-orange-900/30 text-orange-400 border border-orange-800"
        : "bg-orange-50 text-orange-700 border border-orange-200";
    }
    if (quantity < 10) {
      return darkMode
        ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
        : "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
    return darkMode
      ? "bg-green-900/30 text-green-400 border border-green-800"
      : "bg-green-50 text-green-700 border border-green-200";
  };

  // Helper to get status icon
  const getStatusIcon = (quantity) => {
    if (quantity === 0) return <XCircle className="w-4 h-4" />;
    if (quantity <= 5)
      return <AlertTriangle className="w-4 h-4 animate-pulse" />;
    if (quantity < 10) return <TrendingDown className="w-4 h-4" />;
    return <Box className="w-4 h-4" />;
  };

  // Date helpers
  function parseLocalDate(dateString) {
    if (!dateString) return null;
    const parts = `${dateString}`.split("-");
    if (parts.length < 3) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    return new Date(year, month, day);
  }

  function isSameDay(dateA, dateB) {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  }

  function getISOWeek(date) {
    const tempDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
  }

  function getStartOfISOWeek(year, week) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay() || 7;
    if (dayOfWeek <= 4) {
      simple.setDate(simple.getDate() - dayOfWeek + 1);
    } else {
      simple.setDate(simple.getDate() + 8 - dayOfWeek);
    }
    simple.setHours(0, 0, 0, 0);
    return simple;
  }

  function getEndOfISOWeek(year, week) {
    const start = getStartOfISOWeek(year, week);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  const isDateInSelectedRange = (dateString) => {
    const itemDate = parseLocalDate(dateString);
    if (!itemDate) return false;

    if (calendarView === "day") {
      const chosenDate = parseLocalDate(selectedDate);
      if (!chosenDate) return true;
      return isSameDay(itemDate, chosenDate);
    }

    if (calendarView === "week") {
      if (!selectedWeek) return true;
      const [yearPart, weekPart] = selectedWeek.split("-W");
      const year = Number(yearPart);
      const week = Number(weekPart);
      if (!year || !week) return true;

      const weekStart = getStartOfISOWeek(year, week);
      const weekEnd = getEndOfISOWeek(year, week);
      return itemDate >= weekStart && itemDate <= weekEnd;
    }

    if (calendarView === "month") {
      if (!selectedMonth) return true;
      const [yearPart, monthPart] = selectedMonth.split("-");
      const year = Number(yearPart);
      const month = Number(monthPart) - 1;

      return (
        itemDate.getFullYear() === year && itemDate.getMonth() === month
      );
    }

    return true;
  };

  const getCurrentRangeLabel = () => {
    if (calendarView === "day") {
      return selectedDate || "Selected day";
    }
    if (calendarView === "week") {
      return selectedWeek || "Selected week";
    }
    return selectedMonth || "Selected month";
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");

    const fetchData = async () => {
      const shippedRes = await fetchParcelItems();
      const deliveryRes = await fetchParcelOutItems();
      const productInRes = await fetchProductInController();
      const productOutRes = await fetchProductOutController();

      setParcelShipped(shippedRes || []);
      setStockItems(shippedRes || []);
      setParcelDelivery(deliveryRes || []);

      setProductIn(productInRes || []);
      setProductOut(productOutRes || []);
    };

    fetchData();
  }, []);

  const filteredParcelShipped = useMemo(() => {
    return parcelShipped.filter((item) => isDateInSelectedRange(item.date));
  }, [parcelShipped, calendarView, selectedDate, selectedWeek, selectedMonth]);

  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => isDateInSelectedRange(item.date));
  }, [stockItems, calendarView, selectedDate, selectedWeek, selectedMonth]);

  const filteredParcelDelivery = useMemo(() => {
    return parcelDelivery.filter((item) => isDateInSelectedRange(item.date));
  }, [parcelDelivery, calendarView, selectedDate, selectedWeek, selectedMonth]);

  const filteredProductIn = useMemo(() => {
    return productIn.filter((item) => isDateInSelectedRange(item.date));
  }, [productIn, calendarView, selectedDate, selectedWeek, selectedMonth]);

  const filteredProductOut = useMemo(() => {
    return productOut.filter((item) => isDateInSelectedRange(item.date));
  }, [productOut, calendarView, selectedDate, selectedWeek, selectedMonth]);

  const parcelShippedCount =
    filteredParcelShipped.filter((item) => item.quantity > 0).length || 0;

  const parcelDeliveryCount = filteredParcelDelivery.length || 0;

  const productInCount =
    filteredProductIn.filter((item) => item.quantity > 0).length || 0;

  const productOutCount = filteredProductOut.length || 0;

  const statusCounts = useMemo(() => {
    const counts = { out: 0, critical: 0, low: 0, available: 0 };
    filteredStockItems.forEach((item) => {
      const status = getStockStatus(item.quantity);
      counts[status]++;
    });
    return counts;
  }, [filteredStockItems]);

  const productStatusCounts = useMemo(() => {
    const counts = { out: 0, critical: 0, low: 0, available: 0 };
    filteredProductIn.forEach((item) => {
      const status = getStockStatus(item.quantity);
      counts[status]++;
    });
    return counts;
  }, [filteredProductIn]);

  const handleCardClick = (route, status = null, type = null) => {
    if (status && type) {
      router.push(`${route}?status=${status}&type=${type}&focus=${type}-table`);
    } else if (status) {
      router.push(`${route}?status=${status}`);
    } else {
      router.push(route);
    }
  };

  const searchKey = inventorySearch.trim().toLowerCase();

  const itemsNeedingAttention = filteredStockItems.filter((item) => {
    return item.quantity < 10;
  });

  const productsNeedingAttention = filteredProductIn.filter((item) => {
    if (item.quantity >= 10) return false;
    if (!searchKey) return true;

    return (
      (item.product_name || "").toLowerCase().includes(searchKey) ||
      buildProductCode(item).toLowerCase().includes(searchKey) ||
      buildSku(item).toLowerCase().includes(searchKey)
    );
  });

  const totalAlertsCount =
    statusCounts.out +
    statusCounts.critical +
    productStatusCounts.out +
    productStatusCounts.critical;

  return (
    <AuthGuard darkMode={darkMode}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-black"
        }`}
      >
        <TopNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
        />

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "ml-0"
          } pt-16`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Calendar Filter Section */}
            <div
              className={`rounded-xl border p-4 sm:p-6 mb-8 ${
                darkMode
                  ? "bg-[#1F2937] border-[#374151]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Calendar</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    View Mode
                  </label>
                  <select
                    value={calendarView}
                    onChange={(e) => setCalendarView(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "border-[#374151] focus:ring-[#60A5FA] bg-[#111827] text-white"
                        : "border-[#D1D5DB] focus:ring-[#1E40AF] bg-white text-black"
                    }`}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>

                {calendarView === "day" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Select Day
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        darkMode
                          ? "border-[#374151] focus:ring-[#60A5FA] bg-[#111827] text-white"
                          : "border-[#D1D5DB] focus:ring-[#1E40AF] bg-white text-black"
                      }`}
                    />
                  </div>
                )}

                {calendarView === "week" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Select Week
                    </label>
                    <input
                      type="week"
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        darkMode
                          ? "border-[#374151] focus:ring-[#60A5FA] bg-[#111827] text-white"
                          : "border-[#D1D5DB] focus:ring-[#1E40AF] bg-white text-black"
                      }`}
                    />
                  </div>
                )}

                {calendarView === "month" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Select Month
                    </label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        darkMode
                          ? "border-[#374151] focus:ring-[#60A5FA] bg-[#111827] text-white"
                          : "border-[#D1D5DB] focus:ring-[#1E40AF] bg-white text-black"
                      }`}
                    />
                  </div>
                )}

                <div
                  className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
                    darkMode ? "bg-[#111827]" : "bg-[#F9FAFB]"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Current Filter</p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {calendarView.toUpperCase()} • {getCurrentRangeLabel()}
                    </p>
                  </div>
                </div>
              </div>

              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select any day, week, or month to filter dashboard totals and recent activity.
              </p>
            </div>

            {/* Summary Cards - Row 1: Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div
                onClick={() => handleCardClick("/view/parcel-shipped")}
                className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                <div className="flex items-center justify-between mb-4">
                  <PackageCheck className="w-10 h-10" />
                  <Clock className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Stock In
                </h3>
                <p className="text-3xl font-bold mb-2">{parcelShippedCount}</p>
                <p className="text-xs opacity-75">Parcel items in selected range</p>
              </div>

              <div
                onClick={() => handleCardClick("/view/parcel-delivery")}
                className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <PackageOpen className="w-10 h-10" />
                  <TrendingDown className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Stock Out
                </h3>
                <p className="text-3xl font-bold mb-2">{parcelDeliveryCount}</p>
                <p className="text-xs opacity-75">Parcel deliveries in selected range</p>
              </div>

              <div
                onClick={() => handleCardClick("/view/product-in")}
                className="bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Box className="w-10 h-10" />
                  <Package className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Product IN
                </h3>
                <p className="text-3xl font-bold mb-2">{productInCount}</p>
                <p className="text-xs opacity-75">Products in selected range</p>
              </div>

              <div
                onClick={() => handleCardClick("/view/product-out")}
                className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Boxes className="w-10 h-10" />
                  <PackageOpen className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Product OUT
                </h3>
                <p className="text-3xl font-bold mb-2">{productOutCount}</p>
                <p className="text-xs opacity-75">Products shipped in selected range</p>
              </div>
            </div>

            {/* Summary Cards - Row 2: Components Stock Status */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📦 Components Stock Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "out", "parcel")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Critical</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold">{statusCounts.out}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredStockItems.length > 0
                            ? (statusCounts.out / filteredStockItems.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "critical", "parcel")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Alert</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Critical Level
                  </p>
                  <p className="text-2xl font-bold">{statusCounts.critical}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredStockItems.length > 0
                            ? (statusCounts.critical / filteredStockItems.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "low", "parcel")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <TrendingDown className="w-6 h-6 text-yellow-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Warning</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold">{statusCounts.low}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredStockItems.length > 0
                            ? (statusCounts.low / filteredStockItems.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "available", "parcel")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.7s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Box className="w-6 h-6 text-green-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Good</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Available
                  </p>
                  <p className="text-2xl font-bold">{statusCounts.available}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredStockItems.length > 0
                            ? (statusCounts.available / filteredStockItems.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards - Row 3: Product Stock Status */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📦 Product Stock Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "out", "product")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Critical</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold">
                    {productStatusCounts.out}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredProductIn.length > 0
                            ? (productStatusCounts.out / filteredProductIn.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "critical", "product")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "0.9s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Alert</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Critical Level
                  </p>
                  <p className="text-2xl font-bold">
                    {productStatusCounts.critical}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredProductIn.length > 0
                            ? (productStatusCounts.critical /
                                filteredProductIn.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick("/view/out-of-stock", "low", "product")
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <TrendingDown className="w-6 h-6 text-yellow-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Warning</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold">
                    {productStatusCounts.low}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredProductIn.length > 0
                            ? (productStatusCounts.low / filteredProductIn.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  onClick={() =>
                    handleCardClick(
                      "/view/out-of-stock",
                      "available",
                      "product",
                    )
                  }
                  className={`p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{ animationDelay: "1.1s" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Box className="w-6 h-6 text-green-500" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Good</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Available
                  </p>
                  <p className="text-2xl font-bold">
                    {productStatusCounts.available}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          filteredProductIn.length > 0
                            ? (productStatusCounts.available /
                                filteredProductIn.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner */}
            {totalAlertsCount > 0 && (
              <div
                className={`p-4 rounded-xl mb-6 border-l-4 animate__animated animate__fadeInDown ${
                  darkMode
                    ? "bg-[#7f1d1d]/20 border-[#EF4444]"
                    : "bg-[#FEE2E2] border-[#DC2626]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#EF4444] mb-1">
                      ⚠️ Inventory Alert
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Parcels:{" "}
                      {statusCounts.out > 0 &&
                        `${statusCounts.out} out of stock`}
                      {statusCounts.out > 0 &&
                        statusCounts.critical > 0 &&
                        " • "}
                      {statusCounts.critical > 0 &&
                        `${statusCounts.critical} critical`}
                      {(statusCounts.out > 0 || statusCounts.critical > 0) &&
                        (productStatusCounts.out > 0 ||
                          productStatusCounts.critical > 0) &&
                        " | "}
                      Products:{" "}
                      {productStatusCounts.out > 0 &&
                        `${productStatusCounts.out} out of stock`}
                      {productStatusCounts.out > 0 &&
                        productStatusCounts.critical > 0 &&
                        " • "}
                      {productStatusCounts.critical > 0 &&
                        `${productStatusCounts.critical} critical`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            <div
              className={`rounded-xl border p-4 mb-6 ${
                darkMode
                  ? "bg-[#1F2937] border-[#374151]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Search Product Inventory (by code, product, SKU)
              </label>
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="e.g. PRD-00001, SKU-00001, product name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "border-[#374151] focus:ring-[#60A5FA] bg-[#111827] text-white"
                    : "border-[#D1D5DB] focus:ring-[#1E40AF] bg-white text-black"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Parcel Items Needing Attention */}
              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Components Needing Attention
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-orange-900/30 text-orange-400"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {itemsNeedingAttention.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {["Item", "Stock Quantity", "Status"].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {itemsNeedingAttention.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center">
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              All items well-stocked in selected range
                            </p>
                          </td>
                        </tr>
                      ) : (
                        itemsNeedingAttention.slice(0, 5).map((item, index) => (
                          <tr
                            key={item.id || `${item.name}-${index}`}
                            className={`${
                              darkMode
                                ? "hover:bg-[#374151]"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  item.quantity,
                                  darkMode,
                                )}`}
                              >
                                {getStatusIcon(item.quantity)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Products Needing Attention */}
              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Products Needing Attention
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-orange-900/30 text-orange-400"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {productsNeedingAttention.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {[
                          "Product",
                          "Code",
                          "SKU",
                          "Stock Quantity",
                          "Status",
                        ].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {productsNeedingAttention.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center">
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              All products well-stocked in selected range
                            </p>
                          </td>
                        </tr>
                      ) : (
                        productsNeedingAttention.slice(0, 5).map((item, index) => (
                          <tr
                            key={item.id || `${item.product_name}-${index}`}
                            className={`${
                              darkMode
                                ? "hover:bg-[#374151]"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {buildProductCode(item)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {buildSku(item)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-center align-middle">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  item.quantity,
                                  darkMode,
                                )}`}
                              >
                                {getStatusIcon(item.quantity)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Activity Tables */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📋 Recent Activity
              </h2>
            </div>

            {/* Parcel Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Recent Parcel IN</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {["Item", "Qty", "Date"].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {filteredParcelShipped.slice(0, 5).map((item, index) => (
                        <tr
                          key={item.id || `${item.name}-${item.date}-${index}`}
                          className={`${
                            darkMode ? "hover:bg-[#374151]" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Recent Parcel OUT
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {["Item", "Qty", "Date"].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {filteredParcelDelivery.slice(0, 5).map((item, index) => (
                        <tr
                          key={item.id || `${item.name}-${item.date}-${index}`}
                          className={`${
                            darkMode ? "hover:bg-[#374151]" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Product Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Recent Product IN
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {["Product", "Qty", "Date"].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {filteredProductIn.slice(0, 5).map((item, index) => (
                        <tr
                          key={
                            item.id ||
                            `${item.product_name}-${item.date}-${index}`
                          }
                          className={`${
                            darkMode ? "hover:bg-[#374151]" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-lg p-6 border ${
                  darkMode
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Recent Product OUT
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead
                      className={`${darkMode ? "bg-[#374151]" : "bg-gray-50"}`}
                    >
                      <tr>
                        {["Product", "Qty", "Date"].map((head) => (
                          <th
                            key={head}
                            className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-[#374151]" : "divide-gray-200"
                      }`}
                    >
                      {filteredProductOut.slice(0, 5).map((item, index) => (
                        <tr
                          key={
                            item.id ||
                            `${item.product_name}-${item.date}-${index}`
                          }
                          className={`${
                            darkMode ? "hover:bg-[#374151]" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-center align-middle">
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}