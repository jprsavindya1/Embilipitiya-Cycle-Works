"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bike } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export function Footer() {
  const [storeEmail, setStoreEmail] = useState("embilipitiyacycleworks911@gmail.com");

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.contact_email) {
          setStoreEmail(data.settings.contact_email);
        }
      })
      .catch(console.error);
  }, []);
  
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-8 pb-8 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.jpeg" alt="ECW Logo" className="h-12 w-auto dark:invert" />
              <span className="font-bold text-2xl tracking-tight text-white">Ebilipitiya Cycle Works</span>
            </Link>
            <p className="text-zinc-400 text-center md:text-left max-w-sm mb-6 leading-relaxed">
              Ebilipitiya Cycle Works is your premier destination for high-performance bicycles, gear, and expert maintenance services.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Product Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products?category=Bicycle and Accessories" className="hover:text-white transition-colors">Bicycle and Accessories</Link></li>
              <li><Link href="/products?category=Children Items" className="hover:text-white transition-colors">Children Items</Link></li>
              <li><Link href="/products?category=Sport Items" className="hover:text-white transition-colors">Sport Items</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Browse Shop</Link></li>
              <li><Link href="/my-account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ / Help</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Contact Details</h3>
            
            <div className="space-y-4 text-sm text-zinc-400 mb-8">
              <div>
                <strong className="block text-white mb-1">Address:</strong>
                Main Street, Embilipitiya, Sri Lanka
              </div>
              <div>
                <strong className="block text-white mb-1">Phone:</strong>
                <a 
                  href="https://wa.me/94771234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand-primary)] transition-colors inline-block"
                >
                  +94 77 123 4567
                </a>
              </div>
              <div>
                <strong className="block text-white mb-1">Email:</strong>
                <a href={`mailto:${storeEmail}`} className="hover:text-white transition-colors duration-200">
                  {storeEmail}
                </a>
              </div>
            </div>

            <h4 className="font-semibold text-white mb-4 text-sm">Subscribe to Newsletter</h4>
            <form className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] text-white"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[var(--color-brand-primary)] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[var(--color-brand-primary-light)] transition-colors whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <input type="checkbox" required className="mt-1" />
                <span className="text-[10px] text-zinc-500 leading-tight">
                  I agree to receive newsletters and accept the data privacy statement.
                </span>
              </label>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col lg:flex-row items-center justify-between text-xs text-zinc-400 gap-6">
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-1/2">
            <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-3 md:gap-4 lg:gap-6 font-medium text-[10px] md:text-xs whitespace-nowrap">
              <Link href="/delivery-policy" className="hover:text-white transition-colors uppercase tracking-wider">Delivery Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors uppercase tracking-wider">Terms and Conditions</Link>
              <Link href="/return-and-exchange-policy" className="hover:text-white transition-colors uppercase tracking-wider">Return and Exchange Policy</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors uppercase tracking-wider">Privacy Policy</Link>
            </div>
            
            <div className="flex items-center gap-6 text-xl justify-center lg:justify-start w-full">
              <a href="https://www.facebook.com/share/1DHErKVfYD/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0ea5e9] transition-colors" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/embilipitiyacyclework?igsi=bjRoYXJqeXd3NjBl" target="_blank" rel="noopener noreferrer" className="hover:text-[#0ea5e9] transition-colors" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@embilipitiyacycleworks?_r=1&_t=ZS-995puWnHvD2" target="_blank" rel="noopener noreferrer" className="hover:text-[#0ea5e9] transition-colors" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>

            <p className="text-center lg:text-left mt-2">Copyright {new Date().getFullYear()} © Ebilipitiya Cycle Works. All Rights Reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-center lg:justify-end max-w-sm lg:max-w-md">
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/americanexpress.png" alt="American Express" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/firimi.png" alt="Frimi" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/mastercard.png" alt="Mastercard" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/logo_hpay.png" alt="HiPay" className="h-7 w-auto rounded bg-white p-0.5" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/geniepay.png" alt="GeniePay" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/ezcash-thumb.jpg" alt="EzCash" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/mcash.jpeg" alt="mCash" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/smpath.png" alt="Sampath" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/ipay.png" alt="iPay" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/q.png" alt="Q+" className="h-7 w-auto rounded" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/koko.png" alt="Koko" className="h-7 w-auto rounded bg-white p-0.5" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/visa-icon.png" alt="Visa" className="h-7 w-auto rounded bg-white p-0.5" />
            <img src="https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/cod-badge.svg" alt="Cash on Delivery" className="h-7 w-auto rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
