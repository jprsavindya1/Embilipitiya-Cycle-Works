"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Bell, Search, User, Settings, LogOut, PackageSearch, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { currentAdmin, logoutAdmin, activityLogs, syncWithDB } = useStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Add a slight delay to ensure Zustand persist has hydrated the state
    const timer = setTimeout(() => {
      if (!useStore.getState().currentAdmin) {
        router.push("/admin/login");
      } else {
        syncWithDB(); // Fetch latest data from MySQL Database
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [router, syncWithDB]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted || !currentAdmin) return null;

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
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} 
                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-zinc-100 dark:bg-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
              >
                <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
                    <span className="font-bold text-sm">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {/* Mock Notification Item */}
                    <Link href="/admin/inventory" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0 mt-0.5 group-hover:bg-red-100 transition-colors">
                        <PackageSearch className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Low Stock Alert</p>
                        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Some products are running low on stock. Please review inventory.</p>
                        <p className="text-[10px] text-zinc-400 mt-1.5 font-medium">Just now</p>
                      </div>
                    </Link>
                  </div>
                  <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-center">
                    <Link href="/admin/inventory" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline">
                      View all alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} 
                className={`h-9 w-9 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer transition-transform hover:scale-105 ${showProfile ? 'ring-2 ring-[var(--color-brand-primary)] ring-offset-2' : ''}`}
                title={currentAdmin.name}
              >
                {currentAdmin.name.substring(0, 2).toUpperCase()}
              </div>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{currentAdmin.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{currentAdmin.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link href="/admin/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    {currentAdmin.role === "super_admin" && (
                      <Link href="/admin/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </div>
                  <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
                    <Link href="/admin/login" onClick={() => logoutAdmin()} className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
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
