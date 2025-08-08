import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoriteListProvider } from "@/context/FavoriteList";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OrderProvider } from "@/context/OrderContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STG Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <OrderProvider>
              <FavoriteListProvider>
                <CartProvider>
                  {children}
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: "#10B981",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                      },
                      success: {
                        style: {
                          background: "#10B981",
                        },
                      },
                      error: {
                        style: {
                          background: "#EF4444",
                        },
                      },
                    }}
                  />
                </CartProvider>
              </FavoriteListProvider>
            </OrderProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}