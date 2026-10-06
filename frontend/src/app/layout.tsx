import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandPulse | Brand Perception Monitoring Dashboard",
  description: "Real-time Machine Learning Brand Perception Dashboard with Supervised Sentiment Analysis and Algorithmic Variations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
