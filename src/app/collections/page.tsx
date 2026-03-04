"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const category = searchParams.get("category") || "";
    setSelectedCategory(category);
    fetchProducts(category);
  }, [searchParams]);

  const fetchProducts = async (category?: string) => {
    setLoading(true);
    try {
      const url = category
        ? `/api/products?category=${category}`
        : "/api/products";
      const res = await axios.get(url);
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">Collections</h1>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === ""
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange("clothing")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === "clothing"
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Clothing
          </button>
          <button
            onClick={() => handleCategoryChange("figures")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === "figures"
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Figures
          </button>
          <button
            onClick={() => handleCategoryChange("accessories")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === "accessories"
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Accessories
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
