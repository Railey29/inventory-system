/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  PackageCheck,
  PackageOpen,
  PackageX,
  Clock,
  AlertTriangle,
} from "lucide-react";

import "animate.css"; // <-- Import Animate.css

import { getParcelInItems } from "../controller/parcelShipped"; // parcel_in
import { getParcelOutItems } from "../controller/parcelDelivery"; // parcel_out

export default function page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);

  const [parcelShipped, setParcelShipped] = useState([]);
  const [parcelDelivery, setParcelDelivery] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [parcelShippedCount, setParcelShippedCount] = useState(0);
  const [parcelDeliveryCount, setParcelDeliveryCount] = useState(0);

  useAuth();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");

    const fetchData = async () => {
      const shippedRes = await getParcelInItems();
      const deliveryRes = await getParcelOutItems();

      if (!shippedRes.error) setParcelShipped(shippedRes.data);
      if (!deliveryRes.error) setParcelDelivery(deliveryRes.data);

      setParcelShippedCount(shippedRes.data?.length || 0);
      setParcelDeliveryCount(deliveryRes.data?.length || 0);

      // --- Calculate remaining stock ---
      const stockMap = {};

      shippedRes.data?.forEach((item) => {
        stockMap[item.item_name] =
          (stockMap[item.item_name] || 0) + item.quantity;
      });

      deliveryRes.data?.forEach((item) => {
        stockMap[item.item_name] =
          (stockMap[item.item_name] || 0) - item.quantity;
      });

      const lowStock = Object.entries(stockMap)
        .filter(([_, qty]) => qty < 10)
        .map(([item_name, quantity]) => ({
          id: item_name,
          item_name,
          quantity,
        }));

      setOutOfStockItems(lowStock);
    };

    fetchData();
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
      <TopNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      <main
        className={`pt-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp animate__delay-1s">
              <h2 className="text-lg font-semibold">Parcel Shipped</h2>
              <p className="mt-2 text-4xl font-bold">{parcelShippedCount}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp animate__delay-1s">
              <h2 className="text-lg font-semibold">Parcel Delivery</h2>
              <p className="mt-2 text-4xl font-bold">{parcelDeliveryCount}</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-500 text-white p-6 rounded-xl shadow-lg animate__animated animate__fadeInUp animate__delay-1s">
              <h2 className="text-lg font-semibold">Low Stock Items</h2>
              <p className="mt-2 text-4xl font-bold">
                {outOfStockItems.length}
              </p>
            </div>
          </div>

          {/* Out-of-Stock Table */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden mb-6 border animate__animated animate__fadeIn animate__fast ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex items-center gap-3 animate__animated animate__fadeInDown ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <PackageX
                className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"} animate__animated animate__bounce`}
              />
              <h2
                className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Out-of-Stock Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead
                  className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <tr>
                    {["Item Name", "Quantity", "Status"].map((head) => (
                      <th
                        key={head}
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                >
                  {outOfStockItems.length === 0 ? (
                    <tr className="animate__animated animate__fadeIn animate__fast">
                      <td
                        colSpan={3}
                        className={`px-6 py-16 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <PackageX
                          className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"} animate__animated animate__bounce animate__infinite animate__slow`}
                        />
                        <p className="text-lg font-medium mb-1">
                          No out-of-stock items
                        </p>
                        <p className="text-sm opacity-75">
                          All items are in good supply
                        </p>
                      </td>
                    </tr>
                  ) : (
                    outOfStockItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`transition-all duration-200 animate__animated animate__fadeInUp ${darkMode ? (index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50 hover:bg-gray-700/70") : index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {item.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${item.quantity <= 5 ? (darkMode ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-red-50 text-red-700 border border-red-200") : darkMode ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}
                          >
                            {item.quantity <= 5 && (
                              <AlertTriangle className="w-3 h-3 animate__animated animate__headShake animate__infinite animate__slow" />
                            )}
                            {item.quantity <= 5 ? "Critical" : "Low Stock"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parcel Shipped & Delivery Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parcel Shipped Table */}
            <div
              className={`rounded-xl shadow-lg overflow-hidden border animate__animated animate__fadeIn animate__fast ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div
                className={`px-6 py-4 border-b flex items-center gap-3 animate__animated animate__fadeInDown ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <PackageCheck
                  className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"} animate__animated animate__bounce`}
                />
                <h2
                  className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Parcel In Delivery
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead
                    className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                  >
                    <tr>
                      {["Item Name", "Quantity", "Date", "Time In"].map(
                        (head) => (
                          <th
                            key={head}
                            className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody
                    className={`${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                  >
                    {parcelShipped.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`transition-all duration-200 animate__animated animate__fadeInUp ${darkMode ? (index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50 hover:bg-gray-700/70") : index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {item.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-50" />
                          {item.time_in}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Parcel Delivery Table */}
            <div
              className={`rounded-xl shadow-lg overflow-hidden border animate__animated animate__fadeIn animate__fast ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div
                className={`px-6 py-4 border-b flex items-center gap-3 animate__animated animate__fadeInDown ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <PackageOpen
                  className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"} animate__animated animate__bounce`}
                />
                <h2
                  className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Parcel Out Delivery
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead
                    className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                  >
                    <tr>
                      {["Item Name", "Quantity", "Date", "Time Out"].map(
                        (head) => (
                          <th
                            key={head}
                            className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody
                    className={`${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                  >
                    {parcelDelivery.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`transition-all duration-200 animate__animated animate__fadeInUp ${darkMode ? (index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50 hover:bg-gray-700/70") : index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {item.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-50" />
                          {item.time_out}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
