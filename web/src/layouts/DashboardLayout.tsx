import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSession } from "@/lib/auth";
import { setUser } from "@/features/auth/authSlice";

export default function DashboardLayout() {
  const { data: session, isPending } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      dispatch(
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image || undefined,
        })
      );
    }
  }, [session, dispatch]);

  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#030303] text-[#F5F5F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-neutral-800" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#F5F5F5] animate-spin" />
          </div>
          <span className="text-xs text-[#737373] font-mono tracking-wider animate-pulse">Syncing session...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#030303] text-[#F5F5F5]">
      {/* Sidebar - fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto bg-radial-accent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
