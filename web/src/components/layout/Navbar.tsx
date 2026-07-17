import { useLocation, Link } from "react-router";
import { Plus, Bell, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateIdeaDialog } from "@/components/ideas/CreateIdeaDialog";

export default function Navbar() {
  const location = useLocation();

  // Simple breadcrumb parser
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, idx) => {
      const routeTo = `/${paths.slice(0, idx + 1).join("/")}`;
      const name = path === "app" ? "Overview" : path.charAt(0).toUpperCase() + path.slice(1);
      
      // Don't link if it's the last breadcrumb
      const isLast = idx === paths.length - 1;

      return (
        <div key={routeTo} className="flex items-center">
          <span className="mx-2 text-[#262626] font-light">/</span>
          {isLast ? (
            <span className="text-[#F5F5F5] font-medium text-sm">{name}</span>
          ) : (
            <Link to={routeTo} className="text-[#737373] hover:text-[#F5F5F5] text-sm transition-colors">
              {name}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <header className="h-16 border-b border-[#262626] bg-[#030303]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
      {/* Breadcrumb Info */}
      <div className="flex items-center text-sm">
        <Link to="/app" className="text-accent-gold hover:text-accent-gold/80 transition-colors font-medium">
          IdeaNest
        </Link>
        {getBreadcrumbs()}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        {/* Command Search Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#111111] border border-[#262626] text-xs text-[#737373] cursor-pointer hover:border-neutral-500 transition-all select-none">
          <Search className="size-3.5" />
          <span>Search ideas...</span>
          <kbd className="flex items-center gap-0.5 px-1 py-0.5 rounded-none bg-[#262626] text-[10px] text-[#F5F5F5] font-mono leading-none border border-[#3c3c3c]">
            <Command className="size-2.5" /> K
          </kbd>
        </div>

        {/* Notifications mock */}
        <button className="size-8 rounded-none text-[#737373] hover:text-[#F5F5F5] hover:bg-[#111111] border border-transparent hover:border-[#262626] flex items-center justify-center transition-all relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-none bg-neutral-400 ring-2 ring-[#030303]"></span>
        </button>

        {/* Dialog for Quick Add */}
        <CreateIdeaDialog trigger={
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-[#262626] bg-[#0A0A0A] hover:bg-[#111111] hover:border-[#525252] text-[#F5F5F5] text-xs cursor-pointer">
            <Plus className="size-3.5" />
            <span>New Idea</span>
          </Button>
        } />
      </div>
    </header>
  );
}
