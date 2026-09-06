import Sidebar from "@/components/dashboard/Sidebar";
import BackGuard from "./BackGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      <BackGuard />

      <Sidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}