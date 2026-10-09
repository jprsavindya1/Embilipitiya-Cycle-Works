"use client";

import React, { useState } from "react";
import { User, Mail, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "Administrator",
    email: "admin@ecw.lk",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Clear password fields after save
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Profile</h1>
        <p className="text-zinc-500">Manage your administrative account settings and credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col items-center p-8 text-center">
            <div className="h-24 w-24 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-bold text-3xl shadow-lg mb-4 ring-4 ring-blue-50 dark:ring-blue-900/20">
              {formData.name.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{formData.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">{formData.email}</p>
            
            <div className="mt-6 w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2 px-4 rounded-lg text-sm font-bold">
              <ShieldCheck className="h-4 w-4" />
              Super Admin
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-400" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-400" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <p className="text-sm text-zinc-500 mb-4">Leave these fields blank if you do not wish to change your password.</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-zinc-400" /> Current Password
                  </label>
                  <input 
                    type="password" 
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-zinc-400" /> New Password
                    </label>
                    <input 
                      type="password" 
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-zinc-400" /> Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex justify-end items-center gap-4">
              {isSaved && (
                <span className="flex items-center gap-2 text-green-600 font-bold text-sm animate-pulse">
                  <CheckCircle2 className="h-4 w-4" /> Profile Updated
                </span>
              )}
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)] px-8 rounded-lg h-11 font-bold tracking-wide"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
