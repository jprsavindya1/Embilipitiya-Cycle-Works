"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { 
  AlertTriangle, 
  PackageSearch, 
  TrendingDown, 
  Layers, 
  DollarSign
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6'];

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [topSellingData, setTopSellingData] = useState<any[]>([]);
  const [velocityData, setVelocityData] = useState<any[]>([]);
  const [topVelocityProducts, setTopVelocityProducts] = useState<string[]>([]);
  const { products } = useStore();
  
  useEffect(() => {
    setMounted(true);
    
    // Fetch Settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.low_stock_threshold) {
          setLowStockThreshold(Number(data.settings.low_stock_threshold));
        }
      })
      .catch(console.error);

    // Fetch Inventory Analytics
    fetch('/api/admin/inventory/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.topSellingData) setTopSellingData(data.topSellingData);
        if (data.velocityData) setVelocityData(data.velocityData);
        if (data.topVelocityProducts) setTopVelocityProducts(data.topVelocityProducts);
      })
      .catch(console.error);
  }, []);

  if (!mounted) return null;

  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock > 0 && p.stock <= lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalStockValue = products.reduce((total, p) => total + (p.price * (p.stock || 0)), 0);
  const totalUnits = products.reduce((total, p) => total + (p.stock || 0), 0);

  // Generate Category Data
  const categoryMap = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = 0;
    acc[p.category] += (p.stock || 0);
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Inventory & Stock Analytics</h1>
        <p className="text-zinc-500">Manage your stock levels, track depletion rates, and analyze product performance.</p>
      </div>

      {/* Highly Visible Low Stock Alerts Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500/20 dark:border-red-500/30 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full animate-pulse">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide">Critical: Low Stock Alerts</h2>
            </div>
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              {lowStockProducts.length} Action{lowStockProducts.length !== 1 ? 's' : ''} Required
            </span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {lowStockProducts.slice(0, 8).map(product => (
                <div key={product.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <img src={product.imageUrl || '/logo.jpeg'} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-zinc-100 flex-shrink-0 ml-2" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-zinc-900 dark:text-zinc-100" title={product.name}>{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                    <p className="text-xl font-black text-red-600 dark:text-red-400 leading-none">{product.stock}</p>
                    <p className="text-[10px] uppercase font-bold text-red-500 mt-1">Units Left</p>
                  </div>
                </div>
              ))}
            </div>
            
            {lowStockProducts.length > 8 && (
              <div className="mt-6 text-center">
                <Link href="/admin/products" className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30 shadow-sm">
                  View all {lowStockProducts.length} low stock products <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Out of Stock Alerts Section */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-zinc-200/50 dark:bg-zinc-800/50 px-6 py-4 border-b border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
              <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                <PackageSearch className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide">Out of Stock</h2>
            </div>
            <span className="bg-zinc-700 dark:bg-zinc-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              {outOfStockProducts.length} Product{outOfStockProducts.length !== 1 ? 's' : ''} Unavailable
            </span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {outOfStockProducts.slice(0, 8).map(product => (
                <div key={product.id} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden group opacity-80">
                  <div className="absolute top-0 left-0 w-1 h-full bg-zinc-500" />
                  <img src={product.imageUrl || '/logo.jpeg'} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-zinc-100 flex-shrink-0 ml-2 grayscale" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-zinc-900 dark:text-zinc-100 line-through" title={product.name}>{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xl font-black text-zinc-600 dark:text-zinc-400 leading-none">0</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">Stock</p>
                  </div>
                </div>
              ))}
            </div>
            
            {outOfStockProducts.length > 8 && (
              <div className="mt-6 text-center">
                <Link href="/admin/products" className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  View all {outOfStockProducts.length} out of stock products <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Stock Value</p>
            <h3 className="text-2xl font-bold">Rs. {(totalStockValue).toLocaleString()}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Across {products.length} products
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Units in Stock</p>
            <h3 className="text-2xl font-bold">{totalUnits}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Available to sell
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Items under threshold ({lowStockThreshold})
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <TrendingDown className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Out of Stock</p>
            <h3 className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">
              Requires immediate action
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
            <PackageSearch className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Top Selling Products</h3>
          <p className="text-sm text-zinc-500 mb-6">Highest volume items over the last 30 days</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={120} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                  {topSellingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Velocity */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Inventory Depletion Velocity</h3>
          <p className="text-sm text-zinc-500 mb-6">How fast products are leaving the warehouse</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                {topVelocityProducts.map((prod, index) => (
                  <Line 
                    key={prod} 
                    type="monotone" 
                    dataKey={prod} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-1">Stock Distribution by Category</h3>
          <p className="text-sm text-zinc-500 mb-6">Total units available per category</p>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any, props: any) => {
                    const percent = (props.percent * 100).toFixed(0);
                    return [`${value} Units (${percent}%)`, name];
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
