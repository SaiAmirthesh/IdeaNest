import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#F5F5F5] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Outlet />
      <Toaster theme="dark" position="bottom-right" closeButton />
    </div>
  );
}
