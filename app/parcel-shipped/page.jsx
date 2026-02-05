/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { PackageCheck, Plus, Clock, Calendar, Package } from "lucide-react";
import "animate.css";
import { fetchParcelItems, addParcelItem } from "../utils/parcelShippedHelper";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("parcel-in");
  const [darkMode, setDarkMode] = useState(false);

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [timeHour, setTimeHour] = useState("1");
  const [timeMinute, setTimeMinute] = useState("00");
  const [timeAMPM, setTimeAMPM] = useState("AM");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await fetchParcelItems();
    setItems(data);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const timeString = `${timeHour}:${timeMinute} ${timeAMPM}`;
    const newItem = await addParcelItem({
      item_name: name,
      date,
      quantity: Number(quantity),
      time_in: timeString,
    });
    if (!newItem) return;

    await loadItems();
    setName("");
    setDate("");
    setQuantity(1);
    setTimeHour("1");
    setTimeMinute("00");
    setTimeAMPM("AM");
  };

  return (
    <div
      className={
        darkMode
          ? "dark min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-50 text-black"
      }
    >
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm animate__animated animate__fadeInDown ${
          darkMode
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-gray-300"
        }`}
      >
        <TopNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* Main */}
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 animate__animated animate__fadeIn animate__fast">
            <div
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-blue-500/20 border border-blue-500/30"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <PackageCheck
                className={`w-7 h-7 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Parcel In</h1>
              <p className="text-sm opacity-70">
                Track incoming parcels and items
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleAddItem}
            className={`p-6 rounded-xl shadow-lg mb-8 border transition animate__animated animate__fadeIn animate__faster ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Plus
                className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <h2
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add New Item
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              {/* Item Name */}
              <div>
                <label
                  className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Package className="w-4 h-4" /> Item Name
                </label>
                <input
                  type="text"
                  placeholder="Item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black placeholder-gray-400"
                  }`}
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label
                  className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black"
                  }`}
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label
                  className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Package className="w-4 h-4" /> Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black"
                  }`}
                  required
                />
              </div>

              {/* Time In */}
              <div>
                <label
                  className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Clock className="w-4 h-4" /> Time In
                </label>
                <div className="flex gap-2">
                  <select
                    value={timeHour}
                    onChange={(e) => setTimeHour(e.target.value)}
                    className={`border rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black"
                    }`}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeMinute}
                    onChange={(e) => setTimeMinute(e.target.value)}
                    className={`border rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black"
                    }`}
                  >
                    {Array.from({ length: 60 }, (_, i) => {
                      const val = i < 10 ? `0${i}` : `${i}`;
                      return (
                        <option key={i} value={val}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={timeAMPM}
                    onChange={(e) => setTimeAMPM(e.target.value)}
                    className={`border rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-black"
                    }`}
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" /> Add Item
              </button>
            </div>
          </form>

          {/* Stats */}
          <div
            className={`mb-6 flex justify-between p-4 rounded-lg shadow ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } animate__animated animate__fadeIn`}
          >
            <div>Total Items: {items.length}</div>
            <div>
              Total Quantity:{" "}
              {items.reduce((sum, item) => sum + Number(item.quantity), 0)}
            </div>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl shadow-xl overflow-x-auto overflow-y-auto border transition animate__animated animate__fadeIn animate__faster max-h-[600px] ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <table className="w-full min-w-[600px]">
              <thead
                className={`sticky top-0 z-10 ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}
              >
                <tr>
                  {["Item", "Date", "Qty", "Time In"].map((head) => (
                    <th
                      key={head}
                      className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className={`text-center p-8 sm:p-12 ${darkMode ? "text-gray-400" : "text-gray-500"} animate__animated animate__fadeIn`}
                    >
                      <PackageCheck
                        className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 animate__animated animate__bounce animate__infinite animate__slow ${
                          darkMode ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <p className="text-base sm:text-lg font-medium mb-1">
                        No items added yet
                      </p>
                      <p className="text-xs sm:text-sm opacity-75">
                        Add your first item using the form above
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t transition animate__animated animate__fadeInUp ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700/40"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-3 sm:p-4 font-semibold text-sm sm:text-base whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="p-3 sm:p-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm ${
                            darkMode
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="sm:w-4 sm:h-4" />{" "}
                          {item.timeIn}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
