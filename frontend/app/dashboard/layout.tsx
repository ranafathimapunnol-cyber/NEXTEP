
import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import BackGuard from "./BackGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#f8f7f2]">
      <BackGuard />
      <Sidebar />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}