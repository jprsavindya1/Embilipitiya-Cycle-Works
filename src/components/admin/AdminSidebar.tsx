"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  BarChart2,
  ShieldCheck,
  Activity,
  FolderTree,
  Ticket,
  Mail
} from "lucide-react";
import { useStore } from "@/store/useStore";

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentAdmin, logoutAdmin } = useStore();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inventory", href: "/admin/inventory", icon: BarChart2 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Promocodes", href: "/admin/promocodes", icon: Ticket },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Reviews", href: "/admin/reviews", icon: Activity },
  ];

  if (currentAdmin?.role === "super_admin") {
    links.push({ name: "Categories", href: "/admin/categories", icon: FolderTree });
    links.push({ name: "Staff Management", href: "/admin/staff", icon: ShieldCheck });
    links.push({ name: "Activity Log", href: "/admin/activity", icon: Activity });
  }

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-40">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="ECW Logo" className="h-8 w-auto dark:invert rounded-full border border-zinc-200 dark:border-zinc-800" />
          <span className="font-bold text-lg tracking-tight">ECW Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-[var(--color-brand-primary)] text-white shadow-md shadow-[var(--color-brand-primary)]/20 font-semibold" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/admin/login"
          onClick={() => logoutAdmin()}
          className="flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-md hover:border-red-600 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-300 font-bold"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
