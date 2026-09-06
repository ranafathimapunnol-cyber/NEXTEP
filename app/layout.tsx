import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";

export const metadata: Metadata = {
  title: {
    default: "Nextep — Plan. Focus. Progress.",
    template: "%s | Nextep",
  },

  description:
    "Nextep is a modern productivity platform for managing tasks, priorities, and personal progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavbar />

        {children}
      </body>
    </html>
  );
}