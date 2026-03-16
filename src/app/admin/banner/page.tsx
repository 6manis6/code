"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiImage,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiChevronDown,
  FiChevronUp,
  FiClock,
} from "react-icons/fi";

interface BannerSlide {
  imageUrl: string;
  badgeText: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export default function AdminBanner() {
  const router = useRouter();
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [bannerIntervalMs, setBannerIntervalMs] = useState(5000);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(
    null,
  );
  const [expandedSlideIdx, setExpandedSlideIdx] = useState<number | null>(0);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin");
      return;
    }
    fetchBanner();
  }, [router]);

  const fetchBanner = async () => {
    try {
      const res = await axios.get("/api/banner");
      if (res.data.success) {
        const d = res.data.data;
        setBannerSlides(d.slides || []);
        setBannerIntervalMs(d.intervalMs || 5000);
      }
    } catch {
      toast.error("Failed to load banner");
    } finally {
      setLoading(false);
    }
  };

  const updateSlide = (idx: number, changes: Partial<BannerSlide>) =>
    setBannerSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...changes } : s)),
    );

  const handleAddSlide = () => {
    const blank: BannerSlide = {
      imageUrl: "",
      badgeText: "",
      title: "",
      titleHighlight: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "#",
    };
    setBannerSlides((prev) => [...prev, blank]);
    setExpandedSlideIdx(bannerSlides.length);
  };

  const handleDeleteSlide = (idx: number) => {
    if (!confirm(`Delete slide #${idx + 1}?`)) return;
    setBannerSlides((prev) => prev.filter((_, i) => i !== idx));
    setExpandedSlideIdx((prev) =>
      prev === idx ? null : prev !== null && prev > idx ? prev - 1 : prev,
    );
  };

  const handleSlideImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlideIdx(idx);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post("/api/upload", form);
      updateSlide(idx, { imageUrl: res.data.data.url });
      toast.success("Image uploaded! Click Save Banner to apply.");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingSlideIdx(null);
      if (bannerFileRef.current) bannerFileRef.current.value = "";
    }
  };

  const handleSaveBanner = async () => {
    setBannerSaving(true);
    try {
      await axios.put("/api/banner", {
        slides: bannerSlides,
        intervalMs: bannerIntervalMs,
      });
      toast.success("Banner updated successfully!");
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setBannerSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display tracking-widest font-bold dark:text-white">
          BANNER
        </h1>
        <button
          onClick={handleAddSlide}
          className="btn-primary inline-flex w-full sm:w-auto justify-center items-center gap-2"
        >
          <FiPlus /> Add Slide
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <FiImage className="text-primary text-xl" />
          <h2 className="text-lg font-semibold dark:text-white">
            Slideshow Editor
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Recommended size: <strong>1280 × 500 px</strong>. GIFs are fully
          supported and animate on the home page.
        </p>

        {/* Interval selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiClock className="text-primary text-lg flex-shrink-0" />
          <label className="text-sm font-medium dark:text-gray-300 whitespace-nowrap">
            Auto-slide interval
          </label>
          <select
            value={bannerIntervalMs}
            onChange={(e) => setBannerIntervalMs(Number(e.target.value))}
            className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={3000}>3 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={7000}>7 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={15000}>15 seconds</option>
          </select>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (Active only with 2+ slides)
          </span>
        </div>

        {/* Slides */}
        {bannerSlides.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-6">
            <FiImage className="mx-auto w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No slides yet — click <strong>Add Slide</strong> to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {bannerSlides.map((slide, idx) => (
              <div
                key={idx}
                className="border dark:border-gray-700 rounded-xl overflow-hidden"
              >
                {/* Slide header */}
                <div className="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-[28px]">
                    #{idx + 1}
                  </span>
                  {slide.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.imageUrl}
                      alt=""
                      className="h-8 w-14 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium dark:text-white truncate">
                      {slide.title || slide.titleHighlight
                        ? `${slide.title} ${slide.titleHighlight}`.trim()
                        : "Untitled slide"}
                    </p>
                    {slide.badgeText && (
                      <p className="text-xs text-gray-400 truncate">
                        {slide.badgeText}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedSlideIdx(expandedSlideIdx === idx ? null : idx)
                    }
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    aria-label="Toggle edit"
                  >
                    {expandedSlideIdx === idx ? (
                      <FiChevronUp className="w-4 h-4" />
                    ) : (
                      <FiChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(idx)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors"
                    aria-label="Delete slide"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded editor */}
                {expandedSlideIdx === idx && (
                  <div className="p-4 border-t dark:border-gray-700 space-y-4">
                    {/* Image upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Banner Image / GIF
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-2">
                        {slide.imageUrl ? (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.imageUrl}
                              alt="Preview"
                              className="w-full h-40 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => updateSlide(idx, { imageUrl: "" })}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <FiUpload className="mx-auto text-2xl text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              No image — gradient background will be used
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={bannerFileRef}
                        type="file"
                        accept="image/*,image/gif"
                        onChange={(e) => handleSlideImageUpload(e, idx)}
                        className="hidden"
                        id={`slide-upload-${idx}`}
                      />
                      <label
                        htmlFor={`slide-upload-${idx}`}
                        className={`inline-flex items-center gap-2 cursor-pointer btn-primary text-sm !py-1.5 !px-3 ${
                          uploadingSlideIdx === idx
                            ? "opacity-60 pointer-events-none"
                            : ""
                        }`}
                      >
                        <FiUpload className="w-3.5 h-3.5" />
                        {uploadingSlideIdx === idx
                          ? "Uploading…"
                          : "Upload Image / GIF"}
                      </label>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Or paste a direct URL:
                      </p>
                      <input
                        type="text"
                        value={slide.imageUrl}
                        onChange={(e) =>
                          updateSlide(idx, { imageUrl: e.target.value })
                        }
                        placeholder="https://example.com/banner.gif"
                        className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* Text fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(
                        [
                          ["badgeText", "Badge Text", "LIVE NEWS"],
                          ["title", "Title", "BREAKING:"],
                          [
                            "titleHighlight",
                            "Title Highlight (orange)",
                            "JOURNAL WITH WITCH",
                          ],
                          ["subtitle", "Subtitle", "New Episodes Airing Now!"],
                          ["buttonText", "Button Text", "WATCH TRAILER"],
                          [
                            "buttonLink",
                            "Button Link (URL)",
                            "https://youtube.com/...",
                          ],
                        ] as [keyof BannerSlide, string, string][]
                      ).map(([key, label, placeholder]) => (
                        <div key={key}>
                          <label className="block text-xs font-medium mb-1 dark:text-gray-300">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={slide[key]}
                            onChange={(e) =>
                              updateSlide(idx, { [key]: e.target.value })
                            }
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSaveBanner}
          disabled={bannerSaving}
          className="btn-primary disabled:opacity-50"
        >
          {bannerSaving ? "Saving…" : "Save Banner"}
        </button>
      </div>
    </div>
  );
}
