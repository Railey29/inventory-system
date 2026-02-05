/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import { PackageCheck, Plus, Clock } from "lucide-react";
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
            <PackageCheck className="w-7 h-7 text-blue-600 animate__animated animate__bounce" />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`border px-3 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`border px-3 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                required
              />
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`border px-3 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                required
              />
              <div className="flex gap-2">
                <select
                  value={timeHour}
                  onChange={(e) => setTimeHour(e.target.value)}
                  className={`border px-2 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={timeMinute}
                  onChange={(e) => setTimeMinute(e.target.value)}
                  className={`border px-2 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i}>{i < 10 ? `0${i}` : i}</option>
                  ))}
                </select>
                <select
                  value={timeAMPM}
                  onChange={(e) => setTimeAMPM(e.target.value)}
                  className={`border px-2 py-2 rounded w-full transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow animate__animated animate__fadeInUp">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </form>

          {/* Stats */}
          <div className="mb-6 flex justify-between bg-white dark:bg-gray-800 p-4 rounded shadow text-white animate__animated animate__fadeIn">
            <div>Total Items: {items.length}</div>
            <div>
              Total Quantity:{" "}
              {items.reduce((sum, item) => sum + Number(item.quantity), 0)}
            </div>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl shadow-xl overflow-hidden border transition animate__animated animate__fadeIn animate__faster ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <table className="w-full">
              <thead
                className={`${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}
              >
                <tr>
                  {["Item", "Date", "Qty", "Time In"].map((head) => (
                    <th
                      key={head}
                      className="p-4 text-left text-sm font-semibold"
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
                      className={`text-center p-12 ${darkMode ? "text-gray-400" : "text-gray-500"} animate__animated animate__fadeIn`}
                    >
                      No items added
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
                      style={{ animationDelay: `${index * 0.05}s` }} // cascading delay
                    >
                      <td className="p-4 font-semibold">{item.name}</td>
                      <td className="p-4">{item.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-lg font-bold ${
                            darkMode
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <Clock size={16} /> {item.timeIn}
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
