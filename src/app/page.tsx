"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import {
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface BannerSlide {
  imageUrl: string;
  badgeText: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const DEFAULT_SLIDE: BannerSlide = {
  imageUrl: "",
  badgeText: "LIVE NEWS",
  title: "BREAKING:",
  titleHighlight: "JOURNAL WITH WITCH",
  subtitle: "New Episodes Airing Now! Score: 8.64/10",
  buttonText: "WATCH TRAILER",
  buttonLink: "#",
};

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([
    DEFAULT_SLIDE,
  ]);
  const [bannerIntervalMs, setBannerIntervalMs] = useState(5000);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideTimer = useCallback(
    (slides: BannerSlide[], intervalMs: number) => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      if (slides.length > 1) {
        slideTimerRef.current = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, intervalMs);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts();
    fetchBanner();
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    startSlideTimer(bannerSlides, bannerIntervalMs);
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [bannerSlides, bannerIntervalMs, startSlideTimer]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    startSlideTimer(bannerSlides, bannerIntervalMs);
  };
  const prevSlide = () =>
    goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % bannerSlides.length);

  const fetchBanner = async () => {
    try {
      const res = await axios.get("/api/banner");
      if (res.data.success) {
        const data = res.data.data;
        const slides: BannerSlide[] =
          Array.isArray(data.slides) && data.slides.length > 0
            ? data.slides
            : [DEFAULT_SLIDE];
        setBannerSlides(slides);
        setBannerIntervalMs(data.intervalMs || 5000);
      }
    } catch (error) {
      console.error("Failed to fetch banner:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const products = res.data.data;

      setAllProducts(products);
      setNewArrivals(products.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSearching = searchQuery.trim() !== "" || searchCategory !== "";
  const searchResults = allProducts.filter((p) => {
    const matchQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !searchCategory || p.category === searchCategory;
    return matchQuery && matchCat;
  });

  const SEARCH_CATEGORIES = [
    { value: "", label: "All" },
    { value: "figures", label: "Figures" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "game", label: "Games" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kc.png"
          alt=""
          className="w-[480px] rounded-full opacity-100 blur-[3px] select-none"
        />
      </div>

      <Header />

      <main className="flex-grow">
        {/* Hero Banner — slideshow managed from Admin › Banner Slideshow Editor */}
        <section className="relative h-[500px] bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
          {/* Slides — all rendered in DOM so GIFs keep playing; only active one is visible */}
          {bannerSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background */}
              {slide.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={`Banner ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              ) : (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200')] bg-cover bg-center" />
                </div>
              )}

              {/* Text content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-12 max-w-4xl">
                  {slide.badgeText && (
                    <div className="inline-block bg-red-600 text-white px-4 py-1 text-sm font-bold mb-4 animate-pulse">
                      {slide.badgeText}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-widest">
                    {slide.title}{" "}
                    <span className="text-primary">{slide.titleHighlight}</span>
                  </h1>
                  {slide.subtitle && (
                    <p className="text-xl mb-6">{slide.subtitle}</p>
                  )}
                  {slide.buttonText && (
                    <a
                      href={slide.buttonLink || "#"}
                      target={
                        slide.buttonLink && slide.buttonLink !== "#"
                          ? "_blank"
                          : undefined
                      }
                      rel="noreferrer"
                      className="btn-primary inline-flex items-center gap-2 !px-8 !py-3"
                    >
                      <FiPlay /> {slide.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next arrows */}
          {bannerSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Search Bar */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {SEARCH_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    setSearchCategory((prev) =>
                      prev === cat.value ? "" : cat.value,
                    )
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    searchCategory === cat.value
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search Results */}
        {isSearching && (
          <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-2xl font-bold dark:text-white mb-6">
              Search Results{" "}
              <span className="text-gray-400 text-lg font-normal">
                ({searchResults.length} found)
              </span>
            </h2>
            {searchResults.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                No products match your search.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* New Arrivals */}
        <section
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${isSearching ? "hidden" : ""}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold dark:text-white tracking-widest">
              NEW <span className="text-primary">ARRIVALS</span>
            </h2>
            <Link
              href="/collections"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Loading products...
              </p>
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No products found. Time to stock up!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
