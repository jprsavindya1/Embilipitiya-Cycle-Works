"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Package,
  AlertTriangle
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 7000 },
  { name: 'Jul', sales: 8500 },
];

const categoryData = [
  { name: 'Bicycles', value: 450 },
  { name: 'Accessories', value: 300 },
  { name: 'Sport Items', value: 150 },
  { name: 'Kids Toys', value: 100 },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Amila Perera", date: "Today, 10:24 AM", amount: 320000, status: "Pending" },
  { id: "#ORD-002", customer: "Kasun Silva", date: "Yesterday", amount: 45000, status: "Shipped" },
  { id: "#ORD-003", customer: "Nadeesha Fernando", date: "Aug 18, 2026", amount: 1200000, status: "Delivered" },
  { id: "#ORD-004", customer: "Nuwan Kumara", date: "Aug 17, 2026", amount: 15000, status: "Delivered" },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const { products } = useStore();
  const [analytics, setAnalytics] = useState<any>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
    recentOrders: []
  });
  
  useEffect(() => {
    setMounted(true);
    
    // Fetch settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.low_stock_threshold) {
          setLowStockThreshold(Number(data.settings.low_stock_threshold));
        }
      })
      .catch(console.error);

    // Fetch analytics
    fetch('/api/admin/analytics')
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data.totalOrders !== undefined) {
          setAnalytics(data);
        }
      })
      .catch(console.error);
  }, []);

  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= lowStockThreshold);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-zinc-500">Welcome back, here is what's happening today.</p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold">Rs. {Number(analytics.totalSales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[var(--color-brand-primary)] flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold">{analytics.totalOrders}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Active Customers</p>
            <h3 className="text-2xl font-bold">{analytics.totalCustomers}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Across all platforms
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Products Sold</p>
            <h3 className="text-2xl font-bold">{analytics.totalProductsSold}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Total items purchased
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline">
            View all orders
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950/50">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-l-xl">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No recent orders found</td>
                </tr>
              ) : (
                analytics.recentOrders.map((order: any, i: number) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">ORD-{order.id}</td>
                    <td className="px-6 py-4">{order.first_name} {order.last_name}</td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold">Rs. {Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500' :
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
