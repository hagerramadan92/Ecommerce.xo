import type { Metadata } from "next";
import "./globals.css";
import "@/styles/screen.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import { AppProvider } from "@/src/context/AppContext";
import { ToastProvider } from "@/src/context/ToastContext";

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "make your life easier",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-white text-gray-900">
        <AppProvider>
          <ToastProvider>
       <Providers>
            <Navbar />
            {children}
            <Toaster position="top-center" />
            <Footer />
          </Providers>
          </ToastProvider>
   
        </AppProvider>
      </body>
    </html>
  );
}
