"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Activity, Clock, ShieldAlert, FileText, User, Search, Filter } from "lucide-react";

export default function ActivityLogPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const { activityLogs, currentAdmin, admins } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (currentAdmin?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="h-20 w-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-zinc-500">You must be a Super Admin to view the Activity Log.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Activity Log</h1>
          <p className="text-zinc-500 text-sm">View a timeline of all actions taken by administrators and staff.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search activity by name, action, or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="py-2.5 px-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        {activityLogs.filter(log => {
          const admin = admins.find(a => a.id === log.adminId);
          if (admin?.role === 'super_admin') return false;
          
          // Search term filter
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            log.adminName.toLowerCase().includes(searchLower) ||
            log.action.toLowerCase().includes(searchLower) ||
            log.target.toLowerCase().includes(searchLower) ||
            (log.details && log.details.toLowerCase().includes(searchLower));
            
          if (!matchesSearch) return false;
          
          // Time filter
          const logDate = new Date(log.timestamp);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - logDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (timeFilter === 'today' && logDate.toDateString() !== now.toDateString()) return false;
          if (timeFilter === '7days' && diffDays > 7) return false;
          if (timeFilter === '30days' && diffDays > 30) return false;
          
          return true;
        }).length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No activity matches your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {activityLogs.filter(log => {
              const admin = admins.find(a => a.id === log.adminId);
              if (admin?.role === 'super_admin') return false;
              
              const searchLower = searchTerm.toLowerCase();
              const matchesSearch = 
                log.adminName.toLowerCase().includes(searchLower) ||
                log.action.toLowerCase().includes(searchLower) ||
                log.target.toLowerCase().includes(searchLower) ||
                (log.details && log.details.toLowerCase().includes(searchLower));
                
              if (!matchesSearch) return false;
              
              const logDate = new Date(log.timestamp);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - logDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (timeFilter === 'today' && logDate.toDateString() !== now.toDateString()) return false;
              if (timeFilter === '7days' && diffDays > 7) return false;
              if (timeFilter === '30days' && diffDays > 30) return false;
              
              return true;
            }).map((log) => (
              <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-1 shrink-0">
                  {log.action.includes('Delete') ? (
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                  ) : log.action.includes('Update') ? (
                    <FileText className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-green-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      {log.adminName}
                    </span>
                    <span className="text-zinc-400 text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {log.target}
                  </p>
                  {log.details && (
                    <p className="text-sm text-zinc-500 mt-1">{log.details}</p>
                  )}
                </div>
                
                <div className="text-xs text-zinc-400 whitespace-nowrap pt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
