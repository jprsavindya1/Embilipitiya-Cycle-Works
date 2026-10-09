"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { useStore } from "@/store/useStore";
import { ArrowLeft, CheckCircle2, CreditCard, Wallet, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payhereData, setPayhereData] = useState<any>(null);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Form State
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [address, setAddress] = useState({ 
    firstName: "", lastName: "", country: "LK", 
    addressLine1: "", addressLine2: "", city: "", postalCode: "" 
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const subtotal = getCartTotal();
  // Assume delivery fee was passed or default to 1500 for demo
  const deliveryFee = 1500;
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const total = subtotal + deliveryFee - discountAmount;

  const applyPromoCode = async () => {
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/checkout/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeInput, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppliedPromo(data);
    } catch (err: any) {
      setPromoError(err.message);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          address,
          orderNotes,
          paymentMethod,
          cart,
          subtotal,
          deliveryFee,
          discount: discountAmount,
          promoCode: appliedPromo ? appliedPromo.code : null,
          total
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      if (paymentMethod === "payhere" && data.payhere) {
        setPayhereData(data.payhere);
        // We will render a hidden form and auto-submit it via useEffect
      } else {
        clearCart();
        router.push(`/order-tracking/${data.orderId}`);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit PayHere form if data is received
  useEffect(() => {
    if (payhereData) {
      const form = document.getElementById("payhere-form") as HTMLFormElement;
      if (form) form.submit();
    }
  }, [payhereData]);

  // Removed isSuccess UI block since we now redirect to order tracking

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button asChild>
              <Link href="/products">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={2} />

        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-[var(--color-brand-primary)] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Cart
          </Link>
          <h1 className="text-3xl font-bold mt-4">Checkout</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Panel - Forms */}
          <div className="flex-grow space-y-8">
            
            {/* Contact Information */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    required type="email" placeholder="you@example.com" 
                    value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    required type="tel" placeholder="+94 7X XXX XXXX" 
                    value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Country/Region</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none">
                    <option value="LK">Sri Lanka</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input required type="text" value={address.firstName} onChange={(e) => setAddress({...address, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input required type="text" value={address.lastName} onChange={(e) => setAddress({...address, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input required type="text" placeholder="House number and street name" value={address.addressLine1} onChange={(e) => setAddress({...address, addressLine1: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none mb-3" />
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" value={address.addressLine2} onChange={(e) => setAddress({...address, addressLine2: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Town / City</label>
                  <input required type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input required type="text" value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
              </div>
            </section>

            {/* Order Notes */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Notes about your order, e.g. special notes for delivery." 
                  value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all resize-none" 
                ></textarea>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "payhere" ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 dark:bg-[var(--color-brand-primary)]/10 shadow-sm" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}>
                  <div className="flex items-start gap-4">
                    <input type="radio" name="payment" checked={paymentMethod === "payhere"} onChange={() => setPaymentMethod("payhere")} className="mt-1 sm:mt-0 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] w-5 h-5" />
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 text-lg flex items-center gap-2">
                        PayHere 
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <div className="text-sm text-zinc-500 mt-1">Visa, MasterCard, AMEX, EZ Cash, mCash, FriMi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-9 sm:ml-0">
                    <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                    <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "bank" ? "border-[var(--color-brand-primary)] bg-blue-50 dark:bg-blue-500/10 shadow-sm" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}>
                  <input type="radio" name="payment" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="mt-1 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Direct Bank Transfer</div>
                    <div className="text-sm text-zinc-500 mt-1">Make your payment directly into our bank account. Order will not ship until funds have cleared.</div>
                  </div>
                  <Building2 className="h-6 w-6 text-zinc-400 hidden sm:block" />
                </label>

                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[var(--color-brand-primary)] bg-blue-50 dark:bg-blue-500/10 shadow-sm" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}>
                  <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-1 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Cash on Delivery</div>
                    <div className="text-sm text-zinc-500 mt-1">Pay with cash upon delivery.</div>
                  </div>
                  <Wallet className="h-6 w-6 text-zinc-400 hidden sm:block" />
                </label>
              </div>
            </section>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                      <span className="absolute -top-2 -right-2 bg-zinc-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                      <div className="text-sm text-zinc-500">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Have a Promo Code?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    disabled={!!appliedPromo}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none uppercase font-mono text-sm"
                  />
                  {!appliedPromo ? (
                    <Button type="button" onClick={applyPromoCode} disabled={!promoCodeInput || promoLoading} className="shrink-0">
                      {promoLoading ? "..." : "Apply"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={removePromoCode} variant="outline" className="shrink-0 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900/50">
                      Remove
                    </Button>
                  )}
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                {appliedPromo && <p className="text-green-600 text-xs mt-2 font-medium">Promo code '{appliedPromo.code}' applied!</p>}
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Delivery</span>
                  <span>Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>- Rs. {appliedPromo.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black pt-3 border-t border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-[var(--color-brand-primary)]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    required 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]" 
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-tight">
                    I have read and agree to the website <Link href="#" className="text-[var(--color-brand-primary)] hover:underline">terms and conditions</Link>, privacy policy, and delivery policy.
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className={`w-full h-14 text-lg font-bold transition-all shadow-md ${!agreedToTerms ? 'opacity-50 cursor-not-allowed saturate-0' : 'hover:scale-[1.02]'}`} 
                disabled={loading || payhereData !== null || !agreedToTerms}
              >
                {loading || payhereData ? "Processing..." : paymentMethod === 'payhere' ? 'Proceed to PayHere' : 'Place Order'}
              </Button>
            </div>
          </div>
        </form>

        {/* Hidden PayHere Form */}
        {payhereData && (
          <form id="payhere-form" method="POST" action="https://sandbox.payhere.lk/pay/checkout">
            {Object.keys(payhereData).map((key) => (
              <input type="hidden" key={key} name={key} value={payhereData[key]} />
            ))}
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
