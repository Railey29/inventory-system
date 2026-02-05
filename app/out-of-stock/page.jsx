/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { PackageX, AlertTriangle } from "lucide-react";
import "animate.css";

// Import your helpers
import { fetchParcelItems } from "../utils/parcelShippedHelper"; // parcel-in
import { fetchParcelOutItems } from "../utils/parcelOutHelper"; // parcel-out

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("out-of-stock");
  const [darkMode, setDarkMode] = useState(false);
  const [items, setItems] = useState([]); // filtered out-of-stock items

  // Helper to get current time in HH:MM AM/PM
  const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 => 12
    const minsStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minsStr} ${ampm}`;
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");

    const loadItems = async () => {
      const parcelIn = await fetchParcelItems();
      const parcelOut = await fetchParcelOutItems();

      const stockMap = {};

      parcelIn.forEach((item) => {
        if (!stockMap[item.name]) {
          stockMap[item.name] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            lastDate: item.date,
            lastTime: getCurrentTime(), // set current time
          };
        }
        stockMap[item.name].quantity += item.quantity;
        stockMap[item.name].lastDate = item.date;
        stockMap[item.name].lastTime = getCurrentTime();
      });

      parcelOut.forEach((item) => {
        if (!stockMap[item.name]) {
          stockMap[item.name] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            lastDate: item.date,
            lastTime: getCurrentTime(),
          };
        }
        stockMap[item.name].quantity -= item.quantity;
        stockMap[item.name].lastDate = item.date;
        stockMap[item.name].lastTime = getCurrentTime();
      });

      const lowStockItems = Object.values(stockMap).filter(
        (item) => item.quantity < 10,
      );

      setItems(lowStockItems);
    };

    loadItems();
  }, []);

  return (
    <div
      className={
        darkMode
          ? "dark min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-50 text-black"
      }
    >
      {/* Top Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm ${
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

      {/* Main Content */}
      <main
        className={`pt-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8 animate__animated animate__fadeInDown">
            <div
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-red-500/20 border border-red-500/30"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <PackageX
                className={`w-7 h-7 ${darkMode ? "text-red-400" : "text-red-600"}`}
              />
            </div>
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Out of Stock Items
              </h1>
              <p
                className={`text-sm mt-0.5 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Items with quantity below 10 units
              </p>
            </div>
          </div>

          {/* Alert Banner */}
          {items.length > 0 && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 animate__animated animate__fadeInLeft ${
                darkMode
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-300"
                  : "bg-yellow-50 border-yellow-400 text-yellow-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 animate__animated animate__swing animate__infinite animate__slow" />
                <div>
                  <p className="font-semibold">Low Stock Alert</p>
                  <p className="text-sm opacity-90 mt-0.5">
                    {items.length} item{items.length > 1 ? "s" : ""} require
                    immediate attention
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden border animate__animated animate__fadeInUp ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <table className="min-w-full">
              <thead
                className={
                  darkMode
                    ? "bg-gray-700/50 border-b border-gray-600"
                    : "bg-gray-50 border-b border-gray-200"
                }
              >
                <tr>
                  {["Item Name", "Quantity", "Last Date", "Last Time"].map(
                    (head) => (
                      <th
                        key={head}
                        className={`px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`px-4 sm:px-6 py-16 text-center ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <PackageX
                        className={`w-16 h-16 mx-auto mb-4 animate__animated animate__bounce animate__infinite animate__slow ${
                          darkMode ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <p className="text-lg font-medium mb-1">
                        No out-of-stock items
                      </p>
                      <p className="text-sm opacity-75">
                        All items are currently in stock
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-all duration-200 animate__animated animate__fadeInUp ${
                        darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td
                        className={`px-4 sm:px-6 py-4 whitespace-nowrap font-semibold ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full animate__animated animate__pulse animate__infinite ${
                              item.quantity <= 5
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td
                        className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            item.quantity <= 5
                              ? darkMode
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-red-100 text-red-700 border border-red-200"
                              : darkMode
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {item.quantity <= 5 && (
                            <AlertTriangle className="w-3.5 h-3.5 animate__animated animate__headShake animate__infinite animate__slow" />
                          )}
                          {item.quantity} units
                        </span>
                      </td>
                      <td
                        className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.lastDate}
                      </td>
                      <td
                        className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.lastTime} {/* always current time */}
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
