import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { User, Shield, Server, AlertTriangle } from "lucide-react";
import type { RootState } from "@/app/store";
import { setUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  
  const user = authUser || {
    id: "usr_12345",
    name: "Sai Amirthesh",
    email: "sai@ideanest.io",
  };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUser({ ...user, name, email }));
    toast.success("Profile settings updated!");
  };

  const handleApiSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("API configurations cached", {
      description: `Endpoints will map to: ${apiUrl}`,
    });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Workspace Settings</h1>
        <p className="text-xs text-[#737373] mt-1">
          Manage your personal second-brain metadata and configure developer endpoints.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#262626]/60">
          <User className="size-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-[#F5F5F5]">Builder Profile</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#111111] border-[#262626] text-[#F5F5F5] focus-visible:border-neutral-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111111] border-[#262626] text-[#F5F5F5] focus-visible:border-neutral-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold px-4 cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Backend Integration settings - highly relevant to user's upcoming tasks! */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#262626]/60">
          <Server className="size-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-[#F5F5F5]">Backend & Endpoint Configurations</h2>
        </div>

        <div className="p-3.5 bg-yellow-550/10 border border-yellow-500/20 rounded-none flex gap-3 text-xs text-amber-400/90 leading-relaxed">
          <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Integration Placeholders</span>
            Backend operations are currently mocked in the Redux store. To plug in your real API:
            <ul className="list-disc pl-4 mt-2 space-y-1 font-mono text-[10px]">
              <li>Configure `baseUrl` in `src/features/ideas/ideaApi.ts`</li>
              <li>Setup NestJS proxy handles or direct CORS policies</li>
              <li>Toggle session cookie verification inside NestJS controllers</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleApiSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">Vite API Base Path</label>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="bg-[#111111] border-[#262626] text-[#F5F5F5] focus-visible:border-neutral-500 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" variant="outline" className="border-[#262626] bg-[#111111]/30 hover:bg-[#111111] text-[#F5F5F5] text-xs font-semibold px-4 cursor-pointer">
              Configure Target
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Authentication */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#262626]/60">
          <Shield className="size-4 text-lime-400" />
          <h2 className="text-sm font-semibold text-[#F5F5F5]">Authentication Status</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-none bg-[#111111]/50 border border-[#262626] text-xs">
          <div>
            <span className="font-semibold block text-[#F5F5F5]">Better Auth Provider Connected</span>
            <span className="text-[#737373] text-xs block mt-0.5">Handling browser cookie sessions securely via NestJS backend integration</span>
          </div>
          <span className="px-2.5 py-1 rounded-none text-[10px] uppercase font-mono font-semibold bg-lime-950/20 text-lime-400 border border-lime-500/20">
            Active Session
          </span>
        </div>
      </div>
    </div>
  );
}
