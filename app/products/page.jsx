"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { recentActivities, lowStockItems } from "../utils/DashboardData";
import { useAuth } from "../hook/useAuth";

// Generate sample products from recentActivities + lowStockItems
const generateProducts = () => {
  const products = [];
  let idCounter = 1;

  // Add products from recent activities
  recentActivities.forEach((activity) => {
    const existing = products.find((p) => p.name === activity.product);
    if (!existing) {
      products.push({
        id: idCounter++,
        name: activity.product,
        sku: `SKU-${idCounter.toString().padStart(3, "0")}`,
        category: activity.category,
        stock: activity.quantity * 5,
        price:
          activity.category === "Electronics"
            ? 45000
            : activity.category === "Office Supplies"
              ? 2500
              : 8500,
        status: "In Stock",
        lastUpdated: activity.time,
        image:
          activity.category === "Electronics"
            ? "💻"
            : activity.category === "Office Supplies"
              ? "📎"
              : "🔧",
      });
    }
  });

  // Add low stock items
  lowStockItems.forEach((item) => {
    products.push({
      id: idCounter++,
      name: item.name,
      sku: `SKU-${idCounter.toString().padStart(3, "0")}`,
      category: item.category,
      stock: item.current,
      price:
        item.category === "Electronics"
          ? 1250
          : item.category === "Office Supplies"
            ? 350
            : 450,
      status: item.current < item.minimum * 0.5 ? "Critical" : "Low Stock",
      lastUpdated: "1 day ago",
      image:
        item.category === "Electronics"
          ? "🔌"
          : item.category === "Office Supplies"
            ? "📎"
            : "🔧",
    });
  });

  return products;
};

const sampleProducts = generateProducts();

export default function Products() {
  useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [products, setProducts] = useState(sampleProducts);
  const [showModal, setShowModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    stock: 0,
    price: 0,
    status: "In Stock",
    image: "💻",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Low Stock":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveProduct = () => {
    const id = products.length + 1;
    const image =
      newProduct.category === "Electronics"
        ? "💻"
        : newProduct.category === "Furniture"
          ? "🛋️"
          : "📎";

    setProducts([
      ...products,
      {
        id,
        ...newProduct,
        image,
        lastUpdated: "Just now",
      },
    ]);

    setNewProduct({
      name: "",
      sku: "",
      category: "Electronics",
      stock: 0,
      price: 0,
      status: "In Stock",
      image: "💻",
    });
    setShowModal(false);
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
        className={`pt-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
                Products
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">
                Manage your inventory products and stock levels
              </p>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-24 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 font-medium"
            >
              Plus
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl flex items-center justify-center text-2xl">
                          {product.image}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Updated {product.lastUpdated}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {product.stock} units
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ₱{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>

                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseInt(e.target.value),
                      })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, status: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
