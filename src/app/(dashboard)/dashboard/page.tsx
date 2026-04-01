"use client";

import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  ClipboardList,
  Layers,
  BarChart3
} from "lucide-react";
import Link from "next/link";

type StatCardProps = {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  accent: string;
  href: string;
  trend?: string;
  trendColor?: string;
};

const StatCard = ({ title, value, icon, accent, href, trend, trendColor = "text-emerald-400" }: StatCardProps) => (
  <Link href={href} className="group block">
    <div
      className={`relative p-6 rounded-2xl border border-white/[0.06] bg-[#0d1117] hover:border-white/[0.12] transition-all duration-300 overflow-hidden shadow-xl`}
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
          {value ?? "0"}
        </p>

        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp className={`w-3 h-3 ${trendColor}`} />
            <span className={`text-xs ${trendColor} font-medium`}>{trend}</span>
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
  const { data: productsData } = useGetAllProductsQuery({});
  const { data: ordersData } = useGetAllOrdersQuery({});

  const totalProducts = productsData?.data?.length || 0;
  // const totalProducts = productsData?.data?.length || 0;

  const pendingOrders = ordersData?.data?.filter((o: any) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed') || [];
  const completedOrders = ordersData?.data?.filter((o: any) => o.orderStatus === 'delivered') || [];

  // Filtering for low stock and out of stock
  // Assuming the API returns products with stockQuantity and minStockThreshold
  const lowStockProducts = productsData?.data?.filter((p: any) =>
    (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= (p.minStockThreshold ?? 5)
  ).length || 0;

  const outOfStockProducts = productsData?.data?.filter((p: any) =>
    (p.stockQuantity ?? 0) === 0
  ).length || 0;

  // --- Revenue Calculations ---
  const deliveredOrders = ordersData?.data?.filter((o: any) => o.orderStatus === 'delivered') || [];

  const totalRevenue = deliveredOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

  const today = new Date().toISOString().split('T')[0];
  const revenueToday = deliveredOrders
    .filter((o: any) => {
      const deliveredDate = o.deliveredAt ? new Date(o.deliveredAt).toISOString().split('T')[0] : "";
      return deliveredDate === today;
    })
    .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time overview of your warehouse and order status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Live
        </div>
      </div>

      {/* Divider line */}
      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Stat Cards */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-3 h-3" />
          Key Metrics
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Package className="w-5 h-5 text-teal-400" />}
            accent="bg-teal-500"
            href="/products"
            trend="Active in catalog"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders.length}
            icon={<ShoppingCart className="w-5 h-5 text-violet-400" />}
            accent="bg-violet-500"
            href="/orders"
            trend="Needs processing"
          />
          <StatCard
            title="Completed Orders"
            value={completedOrders.length}
            icon={<Package className="w-5 h-5 text-teal-400" />}
            accent="bg-teal-500"
            href="/orders"
            trend="Successfully delivered"
          />
          <StatCard
            title="Total Revenue"
            value={`৳${totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            accent="bg-emerald-500"
            href="/dashboard"
            trend="Overall sales"
          />
          <StatCard
            title="Revenue Today"
            value={`৳${revenueToday.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            accent="bg-emerald-500"
            href="/dashboard"
            trend="Delivered today"
            trendColor={revenueToday > 0 ? "text-emerald-400" : "text-slate-500"}
          />
          <StatCard
            title="Low Stock"
            value={lowStockProducts}
            icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
            accent="bg-amber-500"
            href="/products"
            trend={lowStockProducts > 0 ? "Requires restock" : "Inventory healthy"}
            trendColor={lowStockProducts > 0 ? "text-amber-400" : "text-emerald-400"}
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockProducts}
            icon={<XCircle className="w-5 h-5 text-rose-400" />}
            accent="bg-rose-500"
            href="/products"
            trend={outOfStockProducts > 0 ? "Revenue loss risk" : "Full availability"}
            trendColor={outOfStockProducts > 0 ? "text-rose-400" : "text-emerald-400"}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="w-3 h-3" />
          Operational Actions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionCard
            href="/products"
            title="Product Management"
            description="Add, edit or update warehouse items"
            icon={<PlusCircle className="w-4 h-4 text-teal-400" />}
          />
          <QuickActionCard
            href="/orders"
            title="Order Fulfillment"
            description="Process pending sales and shipments"
            icon={<ShoppingCart className="w-4 h-4 text-violet-400" />}
          />
          <QuickActionCard
            href="/categories"
            title="Category Setup"
            description="Organize products by departments"
            icon={<Layers className="w-4 h-4 text-amber-400" />}
          />
          <QuickActionCard
            href="/reports"
            title="Inventory Reports"
            description="Export detailed stock analytics"
            icon={<BarChart3 className="w-4 h-4 text-rose-400" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
