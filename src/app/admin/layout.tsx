"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiImage,
  FiPlus,
  FiLogOut,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/admin/products", label: "Products", icon: FiPackage },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/admin/messages", label: "Messages", icon: FiMail },
  { href: "/admin/banner", label: "Banner", icon: FiImage },
  { href: "/admin/add-product", label: "Add Product", icon: FiPlus },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Login page — render bare (no sidebar)
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setMobileNavOpen(false);
    router.push("/admin");
  };

  const handleNavClick = () => {
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg md:flex">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur border-b dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kc.gif" alt="KC" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-display tracking-widest text-primary text-xs font-bold leading-tight">
                KURAMA
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">
                ADMIN PANEL
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="p-2 rounded-lg border dark:border-gray-700 dark:text-gray-200"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileNavOpen && (
        <button
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-white dark:bg-dark-card shadow-lg flex flex-col flex-shrink-0 transform transition-transform duration-200 md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b dark:border-gray-700 hidden md:block">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kc.gif" alt="KC" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-display tracking-widest text-primary text-sm font-bold leading-tight">
                KURAMA
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                ADMIN PANEL
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
