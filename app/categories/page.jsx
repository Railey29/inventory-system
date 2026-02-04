"use client";

import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { topCategories } from "../utils/DashboardData";

// Generate initial categories
const generateCategories = () => {
  const categoryIcons = {
    Electronics: "💻",
    "Office Supplies": "📎",
    Hardware: "🔧",
  };

  const categoryColors = {
    Electronics: { bgColor: "bg-blue-50", textColor: "text-blue-700" },
    "Office Supplies": { bgColor: "bg-amber-50", textColor: "text-amber-700" },
    Hardware: { bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  };

  return topCategories.map((category, index) => {
    const colors = categoryColors[category.name] || {
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    };
    return {
      id: index + 1,
      name: category.name,
      description: `${category.name} products and accessories`,
      icon: categoryIcons[category.name] || "📦",
      ...colors,
    };
  });
};

export default function Categories() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState(generateCategories());
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  useAuth();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedCategory({ id: null, name: "", description: "" });
    setAddEditModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setSelectedCategory({ ...category });
    setAddEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedCategory.name.trim()) {
      alert("Category name is required!");
      return;
    }

    if (isEditing) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...selectedCategory } : cat,
        ),
      );
      alert(`Category "${selectedCategory.name}" updated successfully!`);
    } else {
      const newCategory = {
        ...selectedCategory,
        id: categories.length
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1,
        icon: "📦",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
      };
      setCategories((prev) => [newCategory, ...prev]);
      alert(`Category "${selectedCategory.name}" added successfully!`);
    }
    setAddEditModalOpen(false);
  };

  const handleDelete = () => {
    setCategories((prev) =>
      prev.filter((cat) => cat.id !== selectedCategory.id),
    );
    alert(`Category "${selectedCategory.name}" deleted successfully!`);
    setDeleteModalOpen(false);
  };

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

      {/* Main Content */}
      <main
        className={`pt-20 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
                Categories
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">
                Manage your product categories
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 font-medium"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                        <span
                          className={`w-10 h-10 flex items-center justify-center rounded-xl ${category.bgColor} text-2xl`}
                        >
                          {category.icon}
                        </span>
                        <span>{category.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} className="text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {addEditModalOpen && (
        <Modal
          title={isEditing ? "Edit Category" : "Add Category"}
          onClose={() => setAddEditModalOpen(false)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={selectedCategory.name}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={selectedCategory.description}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg resize-none"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <Modal title="Confirm Delete" onClose={() => setDeleteModalOpen(false)}>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedCategory.name}</strong>?
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
