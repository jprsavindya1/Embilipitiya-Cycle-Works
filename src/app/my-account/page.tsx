"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function MyAccountPage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  
  const [loginForm, setLoginForm] = useState({ username: "", password: "", remember: false });
  const [registerForm, setRegisterForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'profile'>('dashboard');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/my-account/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.username, password: loginForm.password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }
      
      setUser(data.user);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    
    try {
      const name = `${registerForm.firstName} ${registerForm.lastName}`;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: registerForm.email, password: registerForm.password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }
      
      // Auto-login after register
      setLoginForm({ username: registerForm.email, password: registerForm.password, remember: false });
      alert("Registration successful! Please login.");
      setRegisterForm({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err: any) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">{user ? `HELLO, ${user.name.toUpperCase()}` : "MY ACCOUNT"}</h1>
        </div>

        {user ? (
          <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
            
            {activeTab === 'dashboard' && (
              <>
                <div className="w-24 h-24 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-zinc-500 mb-8">{user.email}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-lg mb-1">Orders</h3>
                    <p className="text-zinc-500 text-sm">View your recent orders</p>
                    <Button variant="ghost" className="px-0 mt-2 text-[var(--color-brand-primary)] hover:bg-transparent hover:underline dark:hover:bg-transparent dark:text-[var(--color-brand-primary)]" onClick={() => setActiveTab('orders')}>View History &rarr;</Button>
                  </div>
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-lg mb-1">Addresses</h3>
                    <p className="text-zinc-500 text-sm">Manage shipping addresses</p>
                    <Button variant="ghost" className="px-0 mt-2 text-[var(--color-brand-primary)] hover:bg-transparent hover:underline dark:hover:bg-transparent dark:text-[var(--color-brand-primary)]" onClick={() => setActiveTab('addresses')}>Edit Addresses &rarr;</Button>
                  </div>
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-lg mb-1">Account Details</h3>
                    <p className="text-zinc-500 text-sm">Update password & info</p>
                    <Button variant="ghost" className="px-0 mt-2 text-[var(--color-brand-primary)] hover:bg-transparent hover:underline dark:hover:bg-transparent dark:text-[var(--color-brand-primary)]" onClick={() => setActiveTab('profile')}>Edit Profile &rarr;</Button>
                  </div>
                </div>

                <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-500/10">
                  Log out
                </Button>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="text-left">
                <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="mb-6">&larr; Back to Dashboard</Button>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-48 rounded-2xl"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                    <p className="text-zinc-500 mb-6">Looks like you haven't placed any orders.</p>
                    <Button asChild>
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm transition-all hover:shadow-md">
                        
                        {/* Order Header */}
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-6 sm:px-8 border-b border-zinc-200 dark:border-zinc-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-bold">Order #ORD-{order.id}</h3>
                              <p className="text-sm text-zinc-500">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                              <div className="flex gap-2">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm
                                  ${order.payment_status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : ''}
                                  ${order.payment_status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : ''}
                                  ${order.payment_status === 'Failed' || order.payment_status === 'Canceled' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : ''}
                                `}>
                                  Payment: {order.payment_status}
                                </span>
                                
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm
                                  ${order.order_status === 'Delivered' ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}
                                  ${order.order_status === 'Shipped' ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' : ''}
                                  ${order.order_status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' : ''}
                                  ${!order.order_status || order.order_status === 'Pending' ? 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' : ''}
                                  ${order.order_status === 'Canceled' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : ''}
                                `}>
                                  <span className={`w-2 h-2 rounded-full mr-2 ${order.order_status === 'Delivered' ? 'bg-blue-500' : order.order_status === 'Shipped' ? 'bg-purple-500' : order.order_status === 'Processing' ? 'bg-indigo-500' : order.order_status === 'Canceled' ? 'bg-red-500' : 'bg-zinc-400'}`}></span>
                                  {order.order_status || 'Pending'}
                                </span>
                              </div>
                              
                              <Link href={`/order-tracking/ORD-${order.id}`} className="text-sm font-bold text-[var(--color-brand-primary)] hover:underline mt-1">
                                Track Order &rarr;
                              </Link>
                            </div>
                          </div>

                          {/* Quick Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                            <div>
                              <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Total Amount</div>
                              <div className="font-bold text-lg text-[var(--color-brand-primary)]">Rs. {Number(order.total).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Payment Method</div>
                              <div className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                                {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Shipping Address</div>
                              <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={`${order.address_line1}, ${order.city}`}>
                                {order.address_line1}, {order.city}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 sm:p-8">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">Items in this order</h4>
                          <div className="space-y-4">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-zinc-50/50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-xl p-2 shrink-0 border border-zinc-200/50 dark:border-zinc-800 shadow-sm flex items-center justify-center">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.product_name} className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[10px] text-zinc-400">No Img</span>
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <div className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{item.product_name}</div>
                                  <div className="text-sm text-zinc-500 mt-1">Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}</div>
                                </div>
                                <div className="text-right sm:min-w-[100px]">
                                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Rs. {(Number(item.price) * item.quantity).toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Order Summary Footer */}
                          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-end space-y-2">
                            <div className="flex justify-between w-full sm:w-64 text-sm">
                              <span className="text-zinc-500">Subtotal:</span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-full sm:w-64 text-sm">
                              <span className="text-zinc-500">Delivery Fee:</span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {Number(order.delivery_fee).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-full sm:w-64 text-base pt-2 border-t border-zinc-100 dark:border-zinc-800 font-bold">
                              <span>Total:</span>
                              <span className="text-[var(--color-brand-primary)]">Rs. {Number(order.total).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="text-left">
                <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="mb-6">&larr; Back to Dashboard</Button>
                <h2 className="text-2xl font-bold mb-6">My Addresses</h2>
                <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-zinc-500">
                  No addresses saved yet.
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-left">
                <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="mb-6">&larr; Back to Dashboard</Button>
                <h2 className="text-2xl font-bold mb-6">Account Details</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input type="text" disabled value={user.name} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input type="email" disabled value={user.email} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50" />
                  </div>
                  <Button disabled>Save Changes</Button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Login Section */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">LOGIN</h2>
            {loginError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">{loginError}</div>}

            
            <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Username or email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  autoComplete="off"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  required
                  autoComplete="new-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({...loginForm, remember: e.target.checked})}
                    className="w-4 h-4 rounded border-zinc-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                  />
                  <span className="text-sm font-medium">Remember me</span>
                </label>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="px-8 rounded-xl font-bold" disabled={loginLoading}>
                  {loginLoading ? "LOGGING IN..." : "LOG IN"}
                </Button>
              </div>
            </form>
          </motion.section>

          {/* Register Section */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">REGISTER</h2>
            {registerError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">{registerError}</div>}

            
            <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    autoComplete="off"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    autoComplete="off"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required
                  autoComplete="off"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  required
                  autoComplete="new-password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="px-8 rounded-xl font-bold w-full sm:w-auto" disabled={registerLoading}>
                  {registerLoading ? "REGISTERING..." : "REGISTER"}
                </Button>
              </div>
            </form>
          </motion.section>
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
