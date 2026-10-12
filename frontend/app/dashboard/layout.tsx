import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import BackGuard from "./BackGuard";

export default function DashboardLayout({
children,
}: Readonly<{
children: ReactNode;
}>) {
return ( <div className="min-h-screen bg-[#f8f7f2] text-[#292c25] lg:flex"> <BackGuard /> <Sidebar />


  <main className="min-w-0 flex-1 pb-20 lg:pb-0">
    {children}
  </main>
</div>


);
}
