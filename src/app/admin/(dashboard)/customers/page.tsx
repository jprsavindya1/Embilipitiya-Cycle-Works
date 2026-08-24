"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Calendar, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // New Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch customers');
      
      setCustomers(data.customers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add customer');
      
      setCustomers([data.customer, ...customers]);
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading customers...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-zinc-500 mt-1">Manage your customer base and accounts.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-brand-primary)] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 uppercase tracking-wider text-xs border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Customer ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-500">CUST-{customer.id.toString().padStart(4, '0')}</td>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-[var(--color-brand-primary)] font-bold">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{customer.email}</td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--color-brand-primary)]" />
                  Add New Customer
                </h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Temporary Password</label>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-xl font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 px-4 py-2 rounded-xl font-bold bg-[var(--color-brand-primary)] hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Customer Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-center p-8"
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-4xl text-[var(--color-brand-primary)] font-bold mx-auto mb-4">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mb-1">{selectedCustomer.name}</h2>
              <p className="text-zinc-500 mb-6 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> {selectedCustomer.email}
              </p>
              
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <div className="text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Joined</div>
                  <div className="font-medium">{new Date(selectedCustomer.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="w-full px-4 py-3 rounded-xl font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
