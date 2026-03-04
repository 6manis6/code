import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Kuruma Collectibles - Anime Merchandise Store",
  description:
    "Your one-stop shop for anime figures, clothing, and accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inline script runs synchronously before paint — prevents flash of wrong theme */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&prefersDark)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
