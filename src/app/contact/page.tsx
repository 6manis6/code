"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiMail, FiMapPin, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/contact", form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                    manishdhakal486@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FiMapPin className="text-primary text-2xl" />
                <div>
                  <p className="font-semibold dark:text-white">Address</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Arjundhara - 6, Jhapa, Nepal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4">
                <FiCheckCircle className="text-green-500 text-5xl" />
                <p className="text-xl font-semibold dark:text-white">
                  Message Sent!
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-primary underline text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
