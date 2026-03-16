"use client";

import Link from "next/link";
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-950 border-t border-gray-800 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" onClick={() => window.scrollTo(0, 0)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kc.png"
                alt="Kurama Collections"
                className="h-32 w-32 rounded-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/collections"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Popular Products
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=accessories"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/@YourSenpAiiii"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>

          {/* Owner */}
          <div>
            <h4 className="font-bold text-white mb-4">Owner</h4>
            <a
              href="https://www.youtube.com/@YourSenpAiiii"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary group transition-colors"
            >
              <span className="font-medium">Your SenpAi</span>
              <FaYoutube className="text-red-500 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom quote + copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="mb-6">
            <blockquote className="font-display text-2xl md:text-3xl text-gray-200 tracking-widest">
              &quot;I never go back on my word&hellip; that&apos;s my{" "}
              <span className="text-primary animate-pulse">
                Nindo: my ninja way!
              </span>
              &quot;
            </blockquote>
            <cite className="block mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest not-italic">
              — Naruto Uzumaki
            </cite>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kurama Collections. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
