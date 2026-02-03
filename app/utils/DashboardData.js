import { Package, FolderOpen, AlertTriangle, DollarSign } from "lucide-react";

export const stats = [
  {
    title: "Total Products",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "blue",
  },
  {
    title: "Categories",
    value: "24",
    change: "+3",
    trend: "up",
    icon: FolderOpen,
    color: "purple",
  },
  {
    title: "Low Stock Items",
    value: "18",
    change: "-5",
    trend: "down",
    icon: AlertTriangle,
    color: "yellow",
  },
  {
    title: "Total Value",
    value: "₱2.4M",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "green",
  },
];

export const recentActivities = [
  {
    id: 1,
    type: "IN",
    product: "Laptop Dell XPS 15",
    quantity: 10,
    user: "John Encoder",
    time: "2 mins ago",
    category: "Electronics",
  },
  {
    id: 2,
    type: "OUT",
    product: "Office Chair Executive",
    quantity: 5,
    user: "Maria Staff",
    time: "15 mins ago",
    category: "Office Supplies",
  },
  {
    id: 3,
    type: "IN",
    product: "Hammer Set Professional",
    quantity: 25,
    user: "Pedro Admin",
    time: "1 hour ago",
    category: "Hardware",
  },
  {
    id: 4,
    type: "OUT",
    product: 'Monitor Samsung 27"',
    quantity: 3,
    user: "Ana Staff",
    time: "2 hours ago",
    category: "Electronics",
  },
  {
    id: 5,
    type: "IN",
    product: "Printer Ink Cartridge",
    quantity: 50,
    user: "John Encoder",
    time: "3 hours ago",
    category: "Office Supplies",
  },
];

export const lowStockItems = [
  {
    id: 1,
    name: "Stapler Heavy Duty",
    current: 5,
    minimum: 20,
    category: "Office Supplies",
  },
  {
    id: 2,
    name: "USB Cable Type-C",
    current: 8,
    minimum: 30,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Screwdriver Set",
    current: 3,
    minimum: 15,
    category: "Hardware",
  },
  {
    id: 4,
    name: "Paper A4 Ream",
    current: 12,
    minimum: 50,
    category: "Office Supplies",
  },
];

export const topCategories = [
  { name: "Electronics", count: 456, percentage: 35 },
  { name: "Office Supplies", count: 523, percentage: 41 },
  { name: "Hardware", count: 305, percentage: 24 },
];
