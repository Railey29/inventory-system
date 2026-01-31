"use client";
import { useState } from "react";

// Import ALL data from DashboardData in utils
import {
  stats,
  recentActivities,
  lowStockItems,
  topCategories,
} from "../../utils/DashboardData";

// all components
import DashboardHeader from "../components/DashboardHeader";
import LowStockAlert from "../components/LowStockAlert";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import StatsCard from "../components/StatsCard";
import RecentActivities from "../components/RecentActivities";
import TopCategories from "../components/TopCategories";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Slide in from top */}
      <div className="animate__animated animate__fadeInDown animate__faster">
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Sidebar - NO ANIMATION, may built-in transition na */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main
        className={`pt-16 sm:pt-20 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header - Fade in */}
          <div className="animate__animated animate__fadeIn">
            <DashboardHeader />
          </div>

          {/* Stats Grid - Fade in up with stagger */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <StatsCard stat={stat} />
              </div>
            ))}
          </div>

          {/* Main Grid - Equal width columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="animate__animated animate__fadeInLeft animate__delay-1s">
              <RecentActivities activities={recentActivities} />
            </div>
            <div className="animate__animated animate__fadeInRight animate__delay-1s">
              <LowStockAlert items={lowStockItems} />
            </div>
          </div>

          {/* Categories Overview - Zoom in */}
          <div className="animate__animated animate__zoomIn animate__delay-1s">
            <TopCategories categories={topCategories} />
          </div>

          {/* Quick Actions - Bounce in */}
          <div className="animate__animated animate__fadeInUp animate__delay-2s">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
