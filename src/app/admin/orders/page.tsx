"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];

const statusStyle: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data.data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/orders/${id}`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/orders/${id}`);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch {
      toast.error("Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg dark:text-white">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display tracking-widest font-bold dark:text-white mb-8">
        ORDERS
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow p-16 text-center">
          <FiShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-dark-card rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 p-6">
                {/* Customer info */}
                <div>
                  <p className="font-semibold text-lg dark:text-white">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customerPhone}
                  </p>
                  {order.customerAddress && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {order.customerAddress}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Status + amount */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete order"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <p className="text-xl font-bold text-primary">
                    NPR {order.totalAmount}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[order.status] ?? ""}`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    className="mt-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="border-t dark:border-gray-700 px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Items
                </p>
                <ul className="space-y-1">
                  {order.items.map((item: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        NPR {item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
