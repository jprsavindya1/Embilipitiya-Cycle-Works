"use client";

import React, { useState, useEffect } from "react";
import { Save, Store, Mail, Phone, MapPin, DollarSign, Percent, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    store_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    currency: "LKR",
    tax_rate: "0",
    low_stock_threshold: "10",
    announcement_text: "",
    announcement_enabled: "false",
    smtp_email: "",
    smtp_password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch settings');
      
      // Merge with default keys in case some are missing
      setSettings((prev) => ({ ...prev, ...data.settings }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save settings');
      
      setSuccessMsg("Settings saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your store preferences and system configuration.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-medium">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4">
            <h3 className="text-lg font-bold">Store Profile</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="text" 
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                  placeholder="Ebilipitiya Cycle Works"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="email" 
                    name="contact_email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    placeholder="support@ecw.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="text" 
                    name="contact_phone"
                    value={settings.contact_phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    placeholder="047-2230123"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Store Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-zinc-400 w-5 h-5" />
                <input 
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                  placeholder="Main Street, Embilipitiya"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email & SMTP Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4">
            <h3 className="text-lg font-bold">Email & SMTP Configuration</h3>
            <p className="text-sm text-zinc-500 mt-1">Configure the email address used to send order confirmations and system alerts to customers.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">SMTP Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="email" 
                    name="smtp_email"
                    value={settings.smtp_email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    placeholder="e.g. yourstore@gmail.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">App Password / SMTP Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="smtp_password"
                    value={settings.smtp_password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    placeholder="Enter 16-character App Password"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4">
            <h3 className="text-lg font-bold">Financial Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Default Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <select 
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="LKR">LKR (Sri Lankan Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Tax Rate (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="number" 
                    name="tax_rate"
                    value={settings.tax_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4">
            <h3 className="text-lg font-bold">Inventory Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Low Stock Alert Threshold</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  <input 
                    type="number" 
                    name="low_stock_threshold"
                    value={settings.low_stock_threshold}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="10"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  You will receive an alert on the dashboard when a product's stock falls to or below this number.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions & Announcements */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4">
            <h3 className="text-lg font-bold">Promotions & Announcements</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Enable Top Announcement Bar</label>
                <p className="text-sm text-zinc-500">Show a promotional message at the very top of the website.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  name="announcement_enabled" 
                  checked={settings.announcement_enabled === "true"}
                  onChange={(e) => setSettings(prev => ({ ...prev, announcement_enabled: e.target.checked ? "true" : "false" }))}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-brand-primary)]/20 dark:peer-focus:ring-[var(--color-brand-primary)]/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-brand-primary)]"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Announcement Text</label>
              <textarea 
                name="announcement_text"
                value={settings.announcement_text}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all resize-y min-h-[80px]"
                placeholder="🎉 Grand Opening! Use code ECW10 at checkout for 10% off!"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] text-white px-8 py-3 rounded-xl hover:bg-opacity-90 transition-all font-semibold shadow-md disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
