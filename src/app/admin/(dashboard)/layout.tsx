"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex text-zinc-900 dark:text-zinc-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 z-30 sticky top-0">
          <div className="flex items-center text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl w-96 border border-zinc-200 dark:border-zinc-800">
            <Search className="h-4 w-4 mr-2" />
            <input 
              type="text" 
              placeholder="Search anywhere..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => alert("No new notifications")} className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
            </button>
            <ThemeToggle />
            <div onClick={() => alert("Admin Profile Settings")} className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
