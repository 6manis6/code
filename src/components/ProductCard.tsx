"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card-anime animate-fadeIn">
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xl font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            NPR {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center gap-2 !py-2 !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
