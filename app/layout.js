import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { AppProvider } from "@/contexts/AppContext";
import NotificationContainer from "@/components/ui/notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YourDelivery - Partner First Logistics",
  description: "Professional delivery and logistics services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AppProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <NotificationContainer />
        </AppProvider>
      </body>
    </html>
  );
}
