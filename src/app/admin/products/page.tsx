"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiTrash2,
  FiPackage,
  FiEdit2,
  FiX,
  FiUpload,
} from "react-icons/fi";

const CATEGORIES = ["figures", "clothing", "accessories", "game"];

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
};

type EditForm = {
  name: string;
  description: string;
  currentPrice: string;
  originalPrice: string;
  category: string;
  stock: string;
  featured: boolean;
  image: string;
};

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    currentPrice: "",
    originalPrice: "",
    category: "figures",
    stock: "",
    featured: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const editOriginalPrice = Number(editForm.originalPrice) || 0;
  const editCurrentPrice = Number(editForm.currentPrice) || 0;
  const editDiscountPercent =
    editOriginalPrice > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((editOriginalPrice - editCurrentPrice) / editOriginalPrice) * 100,
            ),
          ),
        )
      : 0;

  const preventWheelChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
  };

  const preventArrowStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

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
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const openEdit = (product: Product) => {
    const originalPrice = product.originalPrice || product.price;

    setEditProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      currentPrice: String(product.price),
      originalPrice: String(originalPrice),
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
      image: product.image,
    });
    setImageFile(null);
    setImagePreview(product.image);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setEditForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    if (editCurrentPrice >= editOriginalPrice) {
      toast.error("Current price must be lower than original price");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = editForm.image;

      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axios.post("/api/upload", formData);
        imageUrl = uploadRes.data.url;
      }

      await axios.put(`/api/products/${editProduct._id}`, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.currentPrice),
        originalPrice: Number(editForm.originalPrice),
        category: editForm.category,
        stock: Number(editForm.stock),
        featured: editForm.featured,
        image: imageUrl,
      });

      toast.success("Product updated");
      closeEdit();
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display tracking-widest font-bold dark:text-white">
          PRODUCTS
        </h1>
        <Link
          href="/admin/add-product"
          className="btn-primary inline-flex w-full sm:w-auto justify-center items-center gap-2"
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
        <>
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-dark-card rounded-xl shadow p-4"
              >
                <div className="flex items-start gap-3">
                  {product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs capitalize text-gray-500 dark:text-gray-400 mt-0.5">
                      {product.category}
                    </p>
                    <div className="mt-1">
                      <span className="font-semibold text-primary">
                        NPR {product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="ml-2 text-xs line-through text-gray-500 dark:text-gray-400">
                          NPR {product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
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
                      {product.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-primary border border-primary/30 rounded-lg py-2 text-sm font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-red-500 border border-red-200 dark:border-red-900/40 rounded-lg py-2 text-sm font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white dark:bg-dark-card rounded-xl shadow overflow-hidden">
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
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            NPR {product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs line-through text-gray-500 dark:text-gray-400">
                              NPR{" "}
                              {product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
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
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(product)}
                            className="flex items-center gap-1.5 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Edit Modal ── */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">
                Edit Product
              </h2>
              <button
                onClick={closeEdit}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-dashed rounded-lg hover:border-primary transition-colors dark:border-gray-600 dark:text-gray-300">
                    <FiUpload className="w-4 h-4" />
                    <span className="text-sm">Change image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Original Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Original Price (NPR)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={editForm.originalPrice}
                    onChange={handleEditChange}
                    min={0}
                    step="0.01"
                    onWheel={preventWheelChange}
                    onKeyDown={preventArrowStep}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    min={0}
                    onWheel={preventWheelChange}
                    onKeyDown={preventArrowStep}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Current Price */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Current Price (NPR)
                </label>
                <input
                  type="number"
                  name="currentPrice"
                  value={editForm.currentPrice}
                  onChange={handleEditChange}
                  min={0}
                  step="0.01"
                  onWheel={preventWheelChange}
                  onKeyDown={preventArrowStep}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price Preview
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-primary">
                      NPR {editCurrentPrice.toLocaleString("en-IN")}
                    </span>
                    {editOriginalPrice > editCurrentPrice && (
                      <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                        NPR {editOriginalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-primary">
                      {editDiscountPercent}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Category
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={editForm.featured}
                  onChange={handleEditChange}
                  className="w-4 h-4 accent-primary"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium dark:text-gray-300"
                >
                  Mark as Featured
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
