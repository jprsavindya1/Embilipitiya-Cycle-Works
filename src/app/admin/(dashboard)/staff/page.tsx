"use client";

import React, { useState, useEffect } from "react";
import { useStore, AdminUser } from "@/store/useStore";
import { Users, Plus, ShieldCheck, User, Trash2, ShieldAlert, CheckCircle, Ban, Clock } from "lucide-react";
import { Button } from "@/components/Button";

export default function StaffManagementPage() {
  const [mounted, setMounted] = useState(false);
  const { admins, currentAdmin, generateInvite, deleteAdmin, suspendAdmin, activateAdmin } = useStore();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'suspended'>('active');
  const [inviteRole, setInviteRole] = useState<'staff' | 'super_admin'>('staff');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (currentAdmin?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="h-20 w-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-zinc-500">You must be a Super Admin to manage staff accounts.</p>
      </div>
    );
  }

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await generateInvite(inviteRole);
    if (!token) {
      alert("Failed to generate invite. Please check server logs.");
      return;
    }
    // Use window.location.origin to get the base URL
    const baseUrl = window.location.origin;
    setGeneratedLink(`${baseUrl}/admin/invite/${token}`);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert("Invite link copied to clipboard!");
      setIsAddOpen(false);
      setGeneratedLink(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-zinc-500 text-sm">Manage administrative accounts and their access levels.</p>
          </div>
        </div>
        
        <Button onClick={() => { setIsAddOpen(true); setGeneratedLink(null); }} className="bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]">
          <Plus className="h-4 w-4 mr-2" />
          Generate Invite Link
        </Button>
      </div>

      {isAddOpen && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Generate Invite Link</h2>
          {!generatedLink ? (
            <form onSubmit={handleGenerateInvite} className="flex gap-4 items-end max-w-lg">
              <div className="space-y-1.5 flex-1">
                <label className="text-xs font-bold text-zinc-500">Access Level</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as "staff")} className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-[var(--color-brand-primary)]">
                  <option value="staff">Staff / Editor</option>
                </select>
              </div>
              <Button type="button" onClick={() => setIsAddOpen(false)} variant="outline" className="h-10">Cancel</Button>
              <Button type="submit" className="h-10 bg-[var(--color-brand-primary)] text-white">Generate Link</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-500">Share this unique, single-use link with the new staff member. They will use it to securely create their account.</p>
              <div className="flex gap-2">
                <input readOnly value={generatedLink} className="flex-1 h-10 px-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-600 dark:text-zinc-400 font-mono text-sm" />
                <Button onClick={copyToClipboard} className="h-10 bg-[var(--color-brand-primary)] text-white">Copy Link</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'active' ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Active Staff ({admins.filter(a => a.status === 'active').length})
        </button>

        <button 
          onClick={() => setActiveTab('suspended')} 
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'suspended' ? 'border-red-500 text-red-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Suspended ({admins.filter(a => a.status === 'suspended').length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.filter(a => a.status === activeTab).map(admin => (
          <div key={admin.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col relative group">
            
            {currentAdmin?.id !== admin.id && admin.role !== 'super_admin' && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">

                {activeTab === 'active' && (
                  <button onClick={() => { if(confirm('Suspend this user?')) suspendAdmin(admin.id) }} className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title="Suspend">
                    <Ban className="h-4 w-4" />
                  </button>
                )}
                {activeTab === 'suspended' && (
                  <button onClick={() => activateAdmin(admin.id)} className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Reactivate">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => { if(confirm('Permanently delete this user?')) deleteAdmin(admin.id) }} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className={`h-14 w-14 rounded-full text-white flex items-center justify-center font-bold text-xl shadow-sm ${activeTab === 'active' ? 'bg-[var(--color-brand-primary)]' : 'bg-red-500'}`}>
                {admin.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{admin.name}</h3>
                <p className="text-sm text-zinc-500">{admin.email}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              {admin.role === "super_admin" ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md">
                  <User className="h-3.5 w-3.5" /> Staff
                </span>
              )}

              {currentAdmin?.id === admin.id ? (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">You</span>
              ) : (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'suspended' ? 'text-red-500' : 'text-zinc-400'}`}>
                  {admin.status}
                </span>
              )}
            </div>
          </div>
        ))}
        {admins.filter(a => a.status === activeTab).length === 0 && (
          <div className="col-span-full py-10 text-center text-zinc-500">
            No {activeTab} users found.
          </div>
        )}
      </div>
    </div>
  );
}
