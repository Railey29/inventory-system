"use client";

import { useState } from "react";
import { useAuth } from "../hook/useAuth";

import DashboardHeader from "../components/DashboardHeader";
import LowStockAlert from "../components/LowStockAlert";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import StatsCard from "../components/StatsCard";
import RecentActivities from "../components/RecentActivities";
import TopCategories from "../components/TopCategories";
import QuickActions from "../components/QuickActions";

import {
  stats,
  recentActivities,
  lowStockItems,
  topCategories,
} from "../utils/DashboardData";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Initialize auth (no loading screen)
  useAuth();

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

      {/* Main content */}
      <main
        className={`pt-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Dashboard Header */}
          <div className="mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <DashboardHeader />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{
                  animationDelay: `${0.1 + index * 0.08}s`,
                  transformOrigin: "bottom",
                }}
              >
                <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <StatsCard stat={stat} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2 opacity-0 animate-[fadeInLeft_0.8s_ease-out_0.4s_forwards]">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <RecentActivities activities={recentActivities} />
              </div>
            </div>

            <div className="opacity-0 animate-[fadeInRight_0.8s_ease-out_0.5s_forwards]">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <LowStockAlert items={lowStockItems} />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <TopCategories categories={topCategories} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]">
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
