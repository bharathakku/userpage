import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YourDelivery - Authentication",
  description: "Login or signup to access delivery services",
};

export default function AuthLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white`}> 
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-2xl p-4">{children}</div>
      </div>
    </div>
  )
}
