"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Star,
  Code2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logoutUser } from "@/services/actions/logoutUser";
import { getUserInfo, removeUser } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blogs", href: "/blogs", icon: Newspaper },
  { name: "Skills", href: "/skills", icon: Code2 },
  { name: "Reviews", href: "/reviews", icon: Star },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userInfo = mounted ? getUserInfo() : null;

  const handleLogOut = async () => {
    removeUser();
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen flex flex-col bg-[#0d1117] border-r border-white/[0.06] sticky top-0">
      {/* brand */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Admin Panel</p>
            <p className="text-slate-500 text-xs mt-0.5">Portfolio Dashboard</p>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    {item.name}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-teal-500 opacity-70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* logout */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {mounted && userInfo?._id && (
          <div className="space-y-3">
            <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-slate-500">Logged in as</p>
              <p className="text-sm text-slate-200 font-medium truncate mt-0.5">
                {userInfo?.email || "Admin"}
              </p>
            </div>
            <button
              onClick={handleLogOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
