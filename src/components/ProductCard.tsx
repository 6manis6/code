"use client";

import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag } from "react-icons/fi";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = originalPrice > product.price;
  const discountPercent =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card-anime animate-fadeIn group">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {hasDiscount && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary text-white text-xs font-bold px-2.5 py-1">
              <FiTag className="w-3.5 h-3.5" /> {discountPercent}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Out of Stock</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-black px-4 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
              View Details
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-lg font-bold tracking-wide text-gray-800 dark:text-white mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-0.5">
                <span className="line-through">
                  NPR {originalPrice.toLocaleString("en-IN")}
                </span>
              </span>
            )}
            <span className="text-2xl font-extrabold tracking-tight text-primary leading-tight">
              NPR {product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center gap-2 !py-2 !px-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-transform"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
