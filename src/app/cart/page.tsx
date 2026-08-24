"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { useStore } from "@/store/useStore";
import { Trash2, ArrowRight, Minus, Plus, Truck, Store } from "lucide-react";
import { motion } from "framer-motion";
import { CheckoutStepper } from "@/components/CheckoutStepper";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore();
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  
  const subtotal = getCartTotal();
  const deliveryFee = deliveryMethod === "delivery" ? 1500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={1} />
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8">Looks like you haven't added anything yet.</p>
            <Button asChild size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="flex-grow space-y-6">
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-6 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <div className="h-32 w-32 shrink-0 bg-zinc-100 rounded-xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-grow justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">{item.category}</span>
                        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                        <p className="font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-full">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-[var(--color-brand-primary)] transition-colors"><Minus className="h-4 w-4" /></button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-[var(--color-brand-primary)] transition-colors"><Plus className="h-4 w-4" /></button>
                      </div>
                      <div className="text-right flex-grow">
                        <span className="font-bold text-[var(--color-brand-primary)]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Delivery Options */}
                <div className="mb-6 space-y-3">
                  <h3 className="font-semibold text-sm">Delivery Method</h3>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliveryMethod === "delivery" ? "border-[var(--color-brand-primary)] bg-blue-50 dark:bg-blue-500/10" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === "delivery"} 
                      onChange={() => setDeliveryMethod("delivery")}
                      className="text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                    />
                    <Truck className="h-5 w-5 text-zinc-500" />
                    <div className="flex-grow">
                      <p className="font-medium">Island-wide Delivery</p>
                      <p className="text-xs text-zinc-500">2-4 business days</p>
                    </div>
                    <span className="font-semibold">Rs. 1,500</span>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliveryMethod === "pickup" ? "border-[var(--color-brand-primary)] bg-blue-50 dark:bg-blue-500/10" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === "pickup"} 
                      onChange={() => setDeliveryMethod("pickup")}
                      className="text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                    />
                    <Store className="h-5 w-5 text-zinc-500" />
                    <div className="flex-grow">
                      <p className="font-medium">In-store Pickup</p>
                      <p className="text-xs text-zinc-500">Ready in 2 hours</p>
                    </div>
                    <span className="font-semibold text-green-600">Free</span>
                  </label>
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Delivery Fee</span>
                    <span>Rs. {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <span>Total</span>
                    <span className="text-[var(--color-brand-primary)]">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
