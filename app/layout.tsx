import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semester Planner — SG Induction Challenge",
  description: "Find the bugs. Plan the semester.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
