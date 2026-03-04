"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiPackage } from "react-icons/fi";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin");
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display tracking-widest font-bold dark:text-white">
          PRODUCTS
        </h1>
        <Link
          href="/admin/add-product"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow p-16 text-center">
          <FiPackage className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No products yet.
          </p>
          <Link
            href="/admin/add-product"
            className="btn-primary inline-flex items-center gap-2 mt-6"
          >
            <FiPlus /> Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <span className="font-medium dark:text-white">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                      NPR {product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : product.stock <= 5
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : `${product.stock} left`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
