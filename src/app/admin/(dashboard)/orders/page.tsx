"use client";

import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronDown, Check, X, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Expanded views
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const [trackingModalOrder, setTrackingModalOrder] = useState<any>(null);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingLink, setTrackingLink] = useState('');


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, type: 'order_status' | 'payment_status', newValue: string, extraData?: any) => {
    try {
      // Optimistic update (skip if we are shipping, to wait for actual data)
      if (newValue !== 'Shipped' || type !== 'order_status') {
        setOrders(orders.map(o => o.id === orderId ? { ...o, [type]: newValue } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, [type]: newValue });
        }
      }

      const res = await fetch(`/api/admin/orders/ORD-${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: newValue, ...extraData })
      });

      if (!res.ok) {
        // Revert if failed
        fetchOrders();
        throw new Error('Failed to update status');
      }

      if (newValue === 'Shipped') {
        setOrders(orders.map(o => o.id === orderId ? { ...o, [type]: newValue, courier: extraData?.courier, tracking_number: extraData?.tracking_number, tracking_link: extraData?.tracking_link } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, [type]: newValue, courier: extraData?.courier, tracking_number: extraData?.tracking_number, tracking_link: extraData?.tracking_link });
        }
      }

    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleOrderStatusChange = (order: any, newValue: string) => {
    if (newValue === 'Shipped') {
      setTrackingModalOrder(order);
      setCourier(order.courier || '');
      setTrackingNumber(order.tracking_number || '');
      setTrackingLink(order.tracking_link || '');
    } else {
      updateStatus(order.id, 'order_status', newValue);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    
    await updateStatus(trackingModalOrder.id, 'order_status', 'Shipped', { courier, tracking_number: trackingNumber, tracking_link: trackingLink });
    setTrackingModalOrder(null);
  };


  const downloadCSV = () => {
    if (orders.length === 0) return;

    // Define CSV headers
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Date', 'Total Amount', 'Payment Status', 'Order Status'];
    
    // Convert orders to CSV rows
    const csvRows = orders.map(order => {
      return [
        `ORD-${order.id}`,
        `"${order.first_name} ${order.last_name}"`,
        `"${order.email}"`,
        `"${order.phone}"`,
        `"${new Date(order.created_at).toLocaleDateString()}"`,
        order.total,
        order.payment_status,
        order.order_status || 'Pending'
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecw_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8">Loading orders...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-zinc-500 mt-1">Manage and track customer orders.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name or Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)] text-sm"
            />
          </div>
          <button 
            onClick={downloadCSV}
            disabled={orders.length === 0}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 uppercase tracking-wider text-xs border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {orders
                .filter(o => 
                  o.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  o.last_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (o.phone && o.phone.includes(searchQuery)) || 
                  `ORD-${o.id}`.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold">ORD-{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.first_name} {order.last_name}</div>
                    <div className="text-xs text-zinc-500">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--color-brand-primary)]">
                    Rs. {Number(order.total).toLocaleString()}
                  </td>
                  
                  {/* Payment Status Badge */}
                  <td className="px-6 py-4">
                    <span 
                      className={`text-xs font-bold rounded-full px-3 py-1 text-center inline-block min-w-[80px]
                        ${order.payment_status === 'Paid' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                        ${order.payment_status === 'Pending' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' : ''}
                        ${order.payment_status === 'Failed' || order.payment_status === 'Canceled' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                      `}
                    >
                      {order.payment_status}
                    </span>
                  </td>

                  {/* Order Status Badge */}
                  <td className="px-6 py-4">
                    <span 
                      className={`text-xs font-bold rounded-full px-3 py-1 text-center inline-block min-w-[90px]
                        ${order.order_status === 'Delivered' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : ''}
                        ${order.order_status === 'Shipped' ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' : ''}
                        ${order.order_status === 'Processing' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : ''}
                        ${!order.order_status || order.order_status === 'Pending' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                        ${order.order_status === 'Canceled' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                      `}
                    >
                      {order.order_status || 'Pending'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">Order #ORD-{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Shipping & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Customer Info</h3>
                    <div className="font-medium text-zinc-900 dark:text-white">{selectedOrder.first_name} {selectedOrder.last_name}</div>
                    <div className="text-zinc-600 dark:text-zinc-400">{selectedOrder.email}</div>
                    <div className="text-zinc-600 dark:text-zinc-400">{selectedOrder.phone}</div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Shipping Address</h3>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {selectedOrder.address_line1} <br/>
                      {selectedOrder.address_line2 && <>{selectedOrder.address_line2}<br/></>}
                      {selectedOrder.city}, {selectedOrder.postal_code} <br/>
                      {selectedOrder.country}
                    </div>
                  </div>
                </div>

                {/* Ordered Items */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <div>
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-sm text-zinc-500">Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}</div>
                        </div>
                        <div className="font-bold text-[var(--color-brand-primary)]">
                          Rs. {(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Slip & Details (If Bank Transfer) */}
                {selectedOrder.payment_method === 'bank' && selectedOrder.payment_slip_url && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Payment Proof</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Details */}
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Deposit Date & Time</div>
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {selectedOrder.deposit_date ? new Date(selectedOrder.deposit_date).toLocaleString() : 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Depositor Name</div>
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {selectedOrder.depositor_name || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Contact Number</div>
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {selectedOrder.depositor_phone || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="text-center">
                        <a href={selectedOrder.payment_slip_url} target="_blank" rel="noreferrer" className="inline-block relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                          <img 
                            src={selectedOrder.payment_slip_url} 
                            alt="Bank Transfer Slip" 
                            className="max-h-64 object-contain"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white font-bold flex items-center gap-2">
                              <Eye className="w-5 h-5" /> View Full Image
                            </span>
                          </div>
                        </a>
                      </div>

                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-3">
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Subtotal</span>
                        <span>Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Delivery Fee</span>
                        <span>Rs. {Number(selectedOrder.delivery_fee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-zinc-200 dark:border-zinc-800 pt-3 text-[var(--color-brand-primary)]">
                        <span>Total Paid</span>
                        <span>Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 bg-zinc-50 dark:bg-zinc-950/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Update Order Status</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Payment Status</label>
                      <div className="relative">
                        <select 
                          value={selectedOrder.payment_status}
                          onChange={(e) => updateStatus(selectedOrder.id, 'payment_status', e.target.value)}
                          className="w-full appearance-none h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)] font-medium text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Fulfillment Status</label>
                      <div className="relative">
                        <select 
                          value={selectedOrder.order_status || 'Pending'}
                          onChange={(e) => handleOrderStatusChange(selectedOrder, e.target.value)}
                          className="w-full appearance-none h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)] font-medium text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tracking Info Modal */}
      <AnimatePresence>
        {trackingModalOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Shipping Details</h2>
                <button onClick={() => setTrackingModalOrder(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Courier Name</label>
                  <input 
                    type="text" 
                    required
                    value={courier}
                    onChange={e => setCourier(e.target.value)}
                    placeholder="e.g. PromptX, Koombiyo"
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Tracking Number</label>
                  <input 
                    type="text" 
                    required
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Tracking Link (URL)</label>
                  <input 
                    type="url" 
                    value={trackingLink}
                    onChange={e => setTrackingLink(e.target.value)}
                    placeholder="e.g. https://domex.lk/tracking?id=123"
                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[var(--color-brand-primary)]"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Submitting this will mark the order as Shipped and automatically send an email to the customer with these tracking details.
                </p>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setTrackingModalOrder(null)} className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-brand-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-brand-primary-dark)] transition-colors">
                    Mark as Shipped
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
