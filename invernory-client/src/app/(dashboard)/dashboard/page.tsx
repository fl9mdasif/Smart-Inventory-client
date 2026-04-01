"use client";

import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { useGetAllProjectsQuery } from "@/redux/api/productApi";
import { Briefcase, Newspaper, Code2, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

type StatCardProps = {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  accent: string;
  href: string;
  trend?: string;
};

const StatCard = ({ title, value, icon, accent, href, trend }: StatCardProps) => (
  <Link href={href} className="group block">
    <div
      className={`relative p-6 rounded-2xl border border-white/[0.06] bg-[#0d1117] hover:border-white/[0.12] transition-all duration-300 overflow-hidden`}
    >
      {/* glow blob */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${accent}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${accent} bg-opacity-10 border border-white/[0.06]`}>
            {icon}
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>

        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-1 tracking-tight">
          {value ?? "—"}
        </p>

        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  </Link>
);

const QuickActionCard = ({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) => (
  <Link href={href} className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#0d1117] hover:border-teal-500/20 hover:bg-teal-500/[0.03] transition-all duration-200">
    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-teal-500/20 transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-200 text-sm font-semibold">{title}</p>
      <p className="text-slate-500 text-xs mt-0.5 truncate">{description}</p>
    </div>
    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
  </Link>
);

const DashboardPage = () => {
  const { data: projectsData } = useGetAllProjectsQuery({});
  const { data: blogsData } = useGetAllBlogsQuery({});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back — here's what's happening with your portfolio.
        </p>
      </div>

      {/* Divider line */}
      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Stat Cards */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold mb-4">
          Content Stats
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={projectsData?.meta?.total}
            icon={<Briefcase className="w-5 h-5 text-teal-400" />}
            accent="bg-teal-500"
            href="/projects"
            trend="Live on portfolio"
          />
          <StatCard
            title="Total Blog Posts"
            value={blogsData?.meta?.total}
            icon={<Newspaper className="w-5 h-5 text-violet-400" />}
            accent="bg-violet-500"
            href="/blogs"
            trend="Published articles"
          />
          <StatCard
            title="Skills Listed"
            value="—"
            icon={<Code2 className="w-5 h-5 text-amber-400" />}
            accent="bg-amber-500"
            href="/skills"
          />
          <StatCard
            title="Reviews"
            value="—"
            icon={<Star className="w-5 h-5 text-rose-400" />}
            accent="bg-rose-500"
            href="/reviews"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionCard
            href="/projects"
            title="Manage Projects"
            description="Add, edit or remove portfolio projects"
            icon={<Briefcase className="w-4 h-4 text-teal-400" />}
          />
          <QuickActionCard
            href="/blogs"
            title="Manage Blogs"
            description="Write and publish blog articles"
            icon={<Newspaper className="w-4 h-4 text-violet-400" />}
          />
          <QuickActionCard
            href="/skills"
            title="Manage Skills"
            description="Update your technical skills & categories"
            icon={<Code2 className="w-4 h-4 text-amber-400" />}
          />
          <QuickActionCard
            href="/reviews"
            title="Manage Reviews"
            description="View and publish client testimonials"
            icon={<Star className="w-4 h-4 text-rose-400" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
