import AuthWrapper from "@/components/providers/auth-wrapper"; // ✅ new wrapper
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "FitFlow - Fitness Tracker",
  description: "Track workouts, find gyms, and enroll with face recognition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthWrapper> {/* ✅ only this is client */}
          {children}
        </AuthWrapper>
        <Analytics />
      </body>
    </html>
  );
}
