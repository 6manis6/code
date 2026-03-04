"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Get in Touch</h2>
            <p className="dark:text-gray-300">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FiMail className="text-primary text-2xl" />
                <div>
                  <p className="font-semibold dark:text-white">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    contact@kuruma.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FiPhone className="text-primary text-2xl" />
                <div>
                  <p className="font-semibold dark:text-white">Phone</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FiMapPin className="text-primary text-2xl" />
                <div>
                  <p className="font-semibold dark:text-white">Address</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Anime Street, Tokyo, Japan
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
