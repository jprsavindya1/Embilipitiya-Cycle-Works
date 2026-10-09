"use client";

import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckoutStepper } from '@/components/CheckoutStepper';
import { useStore } from '@/store/useStore';
import { CheckCircle2, Clock, Package, Truck, Home, Copy, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  
  const { clearCart } = useStore();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [depositDate, setDepositDate] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [depositorPhone, setDepositorPhone] = useState('');

  useEffect(() => {
    // If arriving from PayHere success, clear the cart
    if (statusParam === 'success') {
      clearCart();
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch order');
        
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, statusParam, clearCart]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const submitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !depositDate) {
      alert('Please select a file and enter the deposit date.');
      return;
    }

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('slip', selectedFile);
    formData.append('deposit_date', depositDate);
    formData.append('depositor_name', depositorName);
    formData.append('depositor_phone', depositorPhone);

    try {
      const res = await fetch(`/api/orders/${orderId}/upload-slip`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      setUploadSuccess(true);
      setOrder({ ...order, payment_slip_url: data.url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-zinc-500">Loading order details...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading order</h1>
          <p className="text-zinc-600 mb-8">{error || "Order not found."}</p>
          <Button asChild><Link href="/">Return Home</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine current status index
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.order_status || 'Pending');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* We only show the stepper if they just came from checkout (status=success). 
            Otherwise they are just tracking an old order. */}
        {statusParam === 'success' && (
          <CheckoutStepper currentStep={3} />
        )}

        <div className="max-w-4xl mx-auto">
          {statusParam === 'success' && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Thank you for your purchase. Your order number is <span className="font-bold text-zinc-900 dark:text-white">#{orderId}</span>
              </p>
            </div>
          )}

          {statusParam !== 'success' && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Track Order #{orderId}</h1>
              <p className="text-zinc-500 mt-2">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-8 text-center">Order Status</h2>
            
            {/* Visual Tracking Bar */}
            <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4 sm:px-0">
              <div className="absolute left-4 right-4 sm:left-8 sm:right-8 top-1/2 -translate-y-1/2 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full z-0"></div>
              
              <div 
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-1.5 bg-[var(--color-brand-primary)] rounded-full z-0 transition-all duration-1000"
                style={{ width: `calc(${currentStatusIndex * (100 / 3)}% - 1rem)` }}
              ></div>

              {[
                { label: 'Pending', icon: Clock },
                { label: 'Processing', icon: Package },
                { label: 'Shipped', icon: Truck },
                { label: 'Delivered', icon: Home }
              ].map((step, idx) => {
                const isCompleted = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;
                const Icon = step.icon;

                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500
                      ${isCompleted ? 'bg-[var(--color-brand-primary)] border-white dark:border-zinc-900 text-white' : 'bg-zinc-100 dark:bg-zinc-800 border-white dark:border-zinc-900 text-zinc-400'}
                      ${isCurrent ? 'scale-110 shadow-lg' : ''}
                    `}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div className={`absolute -bottom-8 text-[10px] sm:text-xs font-bold uppercase tracking-wider
                      ${isCompleted ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}
                    `}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {order.order_status === 'Canceled' && (
              <div className="mt-12 p-4 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-center font-bold">
                This order has been canceled.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Delivery Details</h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Customer</div>
                  <div className="text-zinc-900 dark:text-white font-medium">{order.first_name} {order.last_name}</div>
                  <div>{order.email}</div>
                  <div>{order.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Shipping Address</div>
                  <div className="text-zinc-900 dark:text-white font-medium">{order.address_line1}</div>
                  {order.address_line2 && <div>{order.address_line2}</div>}
                  <div>{order.city}, {order.postal_code}</div>
                </div>
                
                {(order.courier || order.tracking_number) && (
                  <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Tracking Information</div>
                    {order.courier && (
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Courier:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{order.courier}</span>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Tracking Number:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{order.tracking_number}</span>
                      </div>
                    )}
                    {order.tracking_link && (
                      <div className="mt-4 text-center">
                        <a href={order.tracking_link} target="_blank" rel="noreferrer" className="inline-block bg-[var(--color-brand-primary)] text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-[var(--color-brand-primary-dark)] transition-colors w-full text-center">
                          Track on Courier Website
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-white">{item.quantity}x</span>
                      <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">{item.product_name}</span>
                    </div>
                    <div className="font-medium">Rs. {Number(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Delivery</span>
                  <span>Rs. {Number(order.delivery_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[var(--color-brand-primary)] pt-2">
                  <span>{order.payment_status === 'Paid' ? 'Total Paid' : 'Total Payable'}</span>
                  <span>Rs. {Number(order.total).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Payment Method</div>
                <div className="capitalize font-medium">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'bank' ? 'Bank Transfer' : order.payment_method}
                </div>
                <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : (order.payment_slip_url || uploadSuccess) ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : (order.payment_method === 'cod' && order.payment_status === 'Pending') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                  Status: {order.payment_status === 'Pending' && (order.payment_slip_url || uploadSuccess) ? 'Slip Uploaded' : (order.payment_method === 'cod' && order.payment_status === 'Pending') ? 'Confirmed' : order.payment_status}
                </div>
                
              </div>
            </div>
          </div>

          {/* New position for Complete Your Payment (Full Width below Grid) */}
          {order.payment_method === 'bank' && order.payment_status === 'Pending' && (
            <div className="mt-12">
              <h3 className="font-bold text-2xl mb-6 text-center">Complete Your Payment</h3>
              
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column: Bank Details */}
                  <div>
                    <div className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                      Please transfer the exact amount of <strong className="text-xl text-[var(--color-brand-primary)] ml-1">Rs. {Number(order.total).toLocaleString()}</strong> to the following bank account. 
                      You can use Mobile Banking, Online Banking, or a CDM.
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Bank Name</div>
                            <div className="font-medium text-zinc-900 dark:text-white">Commercial Bank</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Branch</div>
                            <div className="font-medium text-zinc-900 dark:text-white">Embilipitiya</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Account Name</div>
                            <div className="font-medium text-zinc-900 dark:text-white">Ebilipitiya Cycle Works</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border-2 border-[var(--color-brand-primary)] shadow-sm">
                          <div>
                            <div className="text-xs text-[var(--color-brand-primary)] uppercase font-bold tracking-wider mb-1">Account Number</div>
                            <div className="font-bold text-xl text-zinc-900 dark:text-white font-mono tracking-wide">1234 5678 9012</div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard('123456789012')}
                            className="p-3 hover:bg-[var(--color-brand-primary)]/10 rounded-xl text-[var(--color-brand-primary)] transition-colors flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm border border-[var(--color-brand-primary)]/20"
                            title="Copy Account Number"
                          >
                            <Copy className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 text-sm leading-relaxed">
                        <strong className="text-yellow-800 dark:text-yellow-400 block mb-2 text-base">Important Instruction:</strong> 
                        Please enter your Order ID <strong className="font-mono bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-700 mx-1">#{orderId}</strong> in the Reference or Remarks section when transferring money.
                      </div>
                  </div>

                  {/* Right Column: Upload Proof */}
                  <div>
                    {order.payment_slip_url || uploadSuccess ? (
                      <div className="h-full flex flex-col justify-center items-center p-8 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-3xl text-center border border-green-200 dark:border-green-800">
                        <div className="inline-flex w-24 h-24 bg-green-100 dark:bg-green-800/50 rounded-full items-center justify-center mb-6 shadow-sm">
                          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Payment Proof Received!</h3>
                        <p className="opacity-90 max-w-sm mx-auto leading-relaxed">
                          ඔබේ ගෙවීම අප වෙත ලැබී ඇත. පැය 24ක් ඇතුළත verify කර Order එක confirm කරනු ලැබේ.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={submitPaymentProof} className="h-full bg-zinc-50 dark:bg-zinc-950/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                        <h4 className="font-bold text-lg mb-6">Upload Payment Proof</h4>
                        
                        <div className="space-y-5 mb-8">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Deposit Date & Time *</label>
                            <input 
                              type="datetime-local" 
                              required
                              value={depositDate}
                              onChange={(e) => setDepositDate(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-[var(--color-brand-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Depositor Name (Optional)</label>
                            <input 
                              type="text" 
                              placeholder="Account holder name"
                              value={depositorName}
                              onChange={(e) => setDepositorName(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-[var(--color-brand-primary)]"
                            />
                          </div>
                        </div>

                        <div className="mb-8">
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Payment Receipt (Image/PDF) *</label>
                          <label className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                            ${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10 shadow-sm' : 'border-zinc-300 dark:border-zinc-700 hover:border-[var(--color-brand-primary)] bg-white dark:bg-zinc-900 hover:shadow-md'}
                          `}>
                            <input 
                              type="file" 
                              accept="image/*,application/pdf" 
                              className="hidden" 
                              onChange={handleFileSelect} 
                              disabled={uploading}
                            />
                            {selectedFile ? (
                              <div className="text-green-700 dark:text-green-400 font-medium flex flex-col items-center justify-center gap-3">
                                <CheckCircle2 className="w-8 h-8" />
                                <span className="truncate max-w-[200px] bg-white dark:bg-zinc-900 px-3 py-1 rounded-full shadow-sm">{selectedFile.name}</span>
                              </div>
                            ) : (
                              <div className="text-zinc-500 flex flex-col items-center">
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                  <UploadCloud className="w-6 h-6 text-zinc-400" />
                                </div>
                                <span className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Click to upload receipt</span>
                                <span className="text-xs mt-2 opacity-70">JPG, PNG, PDF (Max 5MB)</span>
                              </div>
                            )}
                          </label>
                        </div>
                        
                        <Button type="submit" disabled={uploading || !selectedFile || !depositDate} className="w-full py-4 text-lg shadow-md hover:shadow-lg transition-shadow">
                          {uploading ? 'Submitting...' : 'Submit Payment Proof'}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
