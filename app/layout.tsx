import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🐾 Animal Sorter Quest",
  description: "Teach a robot to recognize animals!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
