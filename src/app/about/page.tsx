"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">About Us</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg dark:text-gray-300 mb-4">
            Welcome to Kuruma Collectibles, your ultimate destination for anime
            merchandise, figures, clothing, and accessories. We&apos;re
            passionate about bringing you the best collectibles from your
            favorite anime series.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">
            Our Mission
          </h2>
          <p className="dark:text-gray-300 mb-4">
            To provide anime fans with high-quality merchandise and create a
            community where passion for anime culture thrives.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside dark:text-gray-300 space-y-2">
            <li>Authentic anime merchandise</li>
            <li>Competitive prices</li>
            <li>Fast and reliable shipping</li>
            <li>Excellent customer service</li>
            <li>Regular new arrivals</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
