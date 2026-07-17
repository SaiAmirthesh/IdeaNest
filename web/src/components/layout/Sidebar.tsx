import { NavLink } from "react-router";
import { LayoutDashboard, Lightbulb, Settings, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { signOut } from "@/lib/auth";
import logoImg from "@/assets/IdeaNest-logo.png";

export default function Sidebar() {
  const dispatch = useDispatch();
  // Using selector to support auth state if present, falling back to mock user
  const authUser = useSelector((state: RootState) => state.auth.user);

  const user = authUser || {
    name: "Sai Amirthesh",
    email: "sai@ideanest.io",
    image: undefined,
  };

  const navItems = [
    { name: "Overview", path: "/app", icon: LayoutDashboard },
    { name: "Ideas", path: "/app/ideas", icon: Lightbulb },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <aside className="w-64 border-r border-[#262626] bg-[#0A0A0A]/90 backdrop-blur-md h-screen fixed left-0 top-0 flex flex-col justify-between z-30">
      <div className="flex flex-col flex-1 py-6">
        {/* Logo Section */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <img src={logoImg} alt="IdeaNest Logo" className="size-11 object-contain" />
          <span className="text-md font-semibold tracking-wider text-accent-gold">
            IdeaNest
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-all duration-200 group relative ${isActive
                  ? "bg-[#111111] text-[#F5F5F5] border-l-2 border-accent-gold"
                  : "text-[#737373] hover:text-[#F5F5F5] hover:bg-[#111111]/50 border-l-2 border-transparent"
                }`
              }
            >
              <item.icon className="size-4 shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile / Footer Section */}
      <div className="p-4 border-t border-[#262626] bg-[#111111]/30">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-none bg-[#111111]/80 border border-[#262626]">
          <div className="flex items-center gap-2 overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="size-8 rounded-none object-cover" />
            ) : (
              <div className="size-8 rounded-none bg-[#262626] flex items-center justify-center text-[#F5F5F5] text-xs font-semibold">
                <User className="size-4 text-[#737373]" />
              </div>
            )}
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-medium text-[#F5F5F5] truncate">{user.name}</span>
              <span className="text-[10px] text-[#737373] truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="size-7 rounded-none text-[#737373] hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
            title="Log Out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
