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
} from "react-icons/fi";

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

  // Login page — render bare (no sidebar)
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-card shadow-lg flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b dark:border-gray-700">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kc.gif" alt="KC" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-display tracking-widest text-primary text-sm font-bold leading-tight">
                KURUMA
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
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
