"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { FiShoppingCart, FiChevronLeft, FiMinus, FiPlus, FiHeart, FiShare2 } from "react-icons/fi";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
        fetchRelatedProducts(res.data.data.category);
      } else {
        toast.error("Product not found");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string) => {
    try {
      const res = await axios.get("/api/products");
      if (res.data.success) {
        const filtered = res.data.data
          .filter((p: Product) => p.category === category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="animate-pulse flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/collections?category=${product.category}`} className="capitalize hover:text-primary transition-colors">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="w-full md:w-1/2">
              <div className="relative group overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-3xl font-bold tracking-widest uppercase">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors">
                    <FiHeart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors">
                    <FiShare2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 dark:text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">(4.8 Out of 5.0)</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  NPR {product.price.toLocaleString('en-IN')}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Including VAT & Taxes</p>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Section */}
              <div className="mt-auto space-y-6">
                {product.stock > 0 && (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-12 text-center font-bold dark:text-white">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Only {product.stock} left in stock!
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-grow btn-primary flex items-center justify-center gap-3 !py-4 !text-lg !rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
                  >
                    <FiShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </button>
                  <button
                    disabled={product.stock === 0}
                    className="sm:w-1/3 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary">
                    🛡️
                  </div>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary">
                    🚚
                  </div>
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24 mb-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-display font-bold dark:text-white tracking-widest">
                  YOU MAY ALSO <span className="text-primary">LIKE</span>
                </h2>
                <Link href="/collections" className="text-primary hover:text-primary-dark font-semibold">
                  View More →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
