import AuthWrapper from "@/components/providers/auth-wrapper"; // ✅ new wrapper
import { TipsProvider } from "@/components/providers/tips-provider";
import { WorkoutProvider } from "@/components/providers/workout-provider";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthWrapper> {/* ✅ only this is client */}
            <WorkoutProvider>
              <TipsProvider>
                {children}
              </TipsProvider>
            </WorkoutProvider>
          </AuthWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
