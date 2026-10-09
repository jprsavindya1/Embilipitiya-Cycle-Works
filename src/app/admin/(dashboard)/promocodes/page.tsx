"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Plus, Trash2, Edit2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/Button";

export default function PromocodesPage() {
  const [promocodes, setPromocodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formState, setFormState] = useState({
    id: "",
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_value: "",
    expiry_date: "",
    is_active: true
  });

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promocodes");
      const data = await res.json();
      if (Array.isArray(data)) setPromocodes(data);
    } catch (error) {
      console.error("Failed to fetch promocodes", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (promo: any = null) => {
    if (promo) {
      setFormState({
        id: promo.id,
        code: promo.code,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
        min_order_value: promo.min_order_value,
        expiry_date: promo.expiry_date ? promo.expiry_date.split('T')[0] : "",
        is_active: promo.is_active === 1
      });
    } else {
      setFormState({
        id: "",
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_value: "",
        expiry_date: "",
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const savePromocode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!formState.id;
      const url = isEdit ? `/api/admin/promocodes/${formState.id}` : `/api/admin/promocodes`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPromocodes();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to save promo code");
      }
    } catch (error) {
      console.error("Save error", error);
    } finally {
      setSaving(false);
    }
  };

  const deletePromocode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const res = await fetch(`/api/admin/promocodes/${id}`, { method: "DELETE" });
      if (res.ok) fetchPromocodes();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-[var(--color-brand-primary)]" />
            Promo Codes
          </h1>
          <p className="text-zinc-500 mt-2">Create and manage discount codes for your store.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Promo Code
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Code</th>
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Discount</th>
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Usage</th>
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Expiry</th>
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="p-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {promocodes.map(promo => (
                  <tr key={promo.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[var(--color-brand-primary)]">
                        {promo.code}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `Rs. ${promo.discount_value}`}
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{promo.usage_count} times</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {promo.expiry_date ? new Date(promo.expiry_date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4">
                      {promo.is_active ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(promo)} className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePromocode(promo.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {promocodes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">No promo codes found. Create one to get started!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">{formState.id ? 'Edit Promo Code' : 'New Promo Code'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={savePromocode} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input required type="text" value={formState.code} onChange={e => setFormState({...formState, code: e.target.value.toUpperCase()})} placeholder="e.g. ECW10" className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700 font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={formState.discount_type} onChange={e => setFormState({...formState, discount_type: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input required type="number" min="1" step="0.01" value={formState.discount_value} onChange={e => setFormState({...formState, discount_value: e.target.value})} placeholder="e.g. 10" className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Value (Rs.)</label>
                  <input type="number" min="0" value={formState.min_order_value} onChange={e => setFormState({...formState, min_order_value: e.target.value})} placeholder="Optional" className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input type="date" value={formState.expiry_date} onChange={e => setFormState({...formState, expiry_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_active" checked={formState.is_active} onChange={e => setFormState({...formState, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="is_active" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</label>
              </div>
              <div className="flex justify-end pt-4 gap-3 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
