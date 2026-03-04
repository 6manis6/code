"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiShoppingCart,
  FiImage,
  FiPlus,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin");
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/orders"),
      ]);
      const products = productsRes.data.data as any[];
      const orders = ordersRes.data.data as any[];
      setStats({
        products: products.length,
        orders: orders.length,
        pending: orders.filter((o: any) => o.status === "pending").length,
        outOfStock: products.filter((p: any) => p.stock === 0).length,
      });
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Products", value: stats.products, icon: FiPackage, color: "text-blue-500" },
    { label: "Total Orders", value: stats.orders, icon: FiShoppingCart, color: "text-green-500" },
    { label: "Pending Orders", value: stats.pending, icon: FiTrendingUp, color: "text-yellow-500" },
    { label: "Out of Stock", value: stats.outOfStock, icon: FiAlertCircle, color: "text-red-500" },
  ];

  const quickLinks = [
    { href: "/admin/add-product", label: "Add New Product", icon: FiPlus, desc: "List a new item in the store" },
    { href: "/admin/products", label: "Manage Products", icon: FiPackage, desc: "Edit or delete existing products" },
    { href: "/admin/orders", label: "View Orders", icon: FiShoppingCart, desc: "Update order statuses" },
    { href: "/admin/banner", label: "Edit Banner", icon: FiImage, desc: "Manage homepage slideshow" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display tracking-widest font-bold dark:text-white mb-8">
        DASHBOARD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow flex items-center gap-4">
            <Icon className={`w-10 h-10 ${color} flex-shrink-0`} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
              <p className="text-3xl font-bold dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white dark:bg-dark-card p-6 rounded-xl shadow hover:shadow-lg border border-transparent hover:border-primary transition-all group"
          >
            <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold dark:text-white mb-1">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
