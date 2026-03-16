"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiTrash2 } from "react-icons/fi";

export default function AdminMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin");
      return;
    }
    fetchMessages();
  }, [router]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/contact");
      setMessages(res.data.data);
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/contact/${id}`);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      toast.error("Failed to delete message");
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
      <h1 className="text-2xl sm:text-3xl font-display tracking-widest font-bold dark:text-white mb-6 sm:mb-8">
        MESSAGES
      </h1>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow p-16 text-center">
          <FiMail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No messages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white dark:bg-dark-card rounded-xl shadow p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-lg dark:text-white">
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {msg.email}
                    </a>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Your message to Kurama Anime Shop`}
                    className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
