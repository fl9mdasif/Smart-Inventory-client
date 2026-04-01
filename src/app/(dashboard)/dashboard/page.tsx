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
  BarChart3,
  Clock,
  History,
  Activity as ActivityIcon,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { useGetRecentActivitiesQuery } from "@/redux/api/activityApi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

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
        className={`absolute -top-6 -right-6 w-12  h-12 rounded-full blur-2xl opacity-20 ${accent}`}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${accent} bg-opacity-10 border border-white/[0.06]`}>
              {icon}
            </div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>

        <p className="text-3xl font-bold text-white tracking-tight">
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

const ActivityItem = ({ activity }: { activity: any }) => {
  const Icon = activity.type === 'order' ? ShoppingCart : Package;
  const colorClass = activity.type === 'order' ? 'text-violet-400' : 'text-teal-400';
  const bgColorClass = activity.type === 'order' ? 'bg-violet-500/10' : 'bg-teal-500/10';

  const time = new Date(activity.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
      <div className={`p-2 rounded-lg ${bgColorClass} ${colorClass} mt-0.5`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-sm leading-snug">
          {activity.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Clock size={10} className="text-slate-500" />
          <span className="text-[10px] text-slate-500 font-medium">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data: productsData } = useGetAllProductsQuery({});
  const { data: ordersData } = useGetAllOrdersQuery({});
  const { data: activitiesData, isLoading: activitiesLoading } = useGetRecentActivitiesQuery({});

  // console.log(activitiesData);
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

  // --- Chart Data Aggregation (Last 7 Days) ---
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dailyRevenue = deliveredOrders
      .filter((o: any) => (o.deliveredAt ? new Date(o.deliveredAt).toISOString().split('T')[0] : "") === date)
      .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dailyRevenue
    };
  });

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

      {/* System Monitoring Group: Chart (2) + Activity Log (1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart - Span 2 */}
        <div className="lg:col-span-2 animate-in slide-in-from-left duration-700 delay-200">
          <div className="p-6 h-full rounded-2xl border border-white/[0.06] bg-[#0d1117] shadow-xl overflow-hidden relative">
            {/* background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Growth Analytics
                </p>
                <h2 className="text-xl font-bold text-white tracking-tight">Revenue Overview</h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-slate-400">Past 7 Days</span>
                </div>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `৳${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0d1117', 
                      borderColor: '#ffffff10',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
                    }}
                    itemStyle={{ color: '#14b8a6', fontWeight: 600 }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(value: any) => [`৳${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#14b8a6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity - Span 1 */}
        <div className="animate-in slide-in-from-right duration-700 delay-200">
          <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold flex items-center gap-2 mb-4">
            <History className="w-3 h-3" />
            Recent Activity
          </p>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-2 min-h-[416px] max-h-[416px] overflow-y-auto custom-scrollbar shadow-xl">
            {activitiesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-5 h-5 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Crunching logs...</p>
              </div>
            ) : activitiesData?.length > 0 ? (
              <div className="space-y-1 divide-y divide-white/[0.04]">
                {activitiesData.map((activity: any) => (
                  <ActivityItem key={activity._id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center mb-3 text-slate-600">
                  <ActivityIcon size={20} />
                </div>
                <p className="text-sm text-slate-400 font-medium whitespace-pre-wrap">No recent actions found.</p>
                <p className="text-xs text-slate-500 mt-1">Activities will appear as you manage inventory.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operational Actions Section */}
      <div className="space-y-4 animate-in fade-in duration-700 delay-300">
        <p className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold flex items-center gap-2">
          <ClipboardList className="w-3 h-3" />
          Operational Actions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            href="/dashboard"
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
