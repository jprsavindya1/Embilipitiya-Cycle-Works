"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, User, Heart } from "lucide-react";
import { Button } from "./Button";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalSearch } from "./GlobalSearch";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = useStore((state) => state.getCartCount());
  const wishlistCount = useStore((state) => state.wishlist.length);
  const user = useStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "All Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="relative mt-4 z-50 w-full px-4 mb-8">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mx-auto max-w-5xl rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg shadow-black/5"
      >
        <div className="px-6 h-16 flex items-center justify-between">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="ECW Logo" className="h-10 w-auto dark:invert" />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Ebilipitiya Cycle Works</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm relative">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`relative px-2 py-1 transition-colors hover:text-[var(--color-brand-primary)] ${
                pathname === link.href ? "text-[var(--color-brand-primary)] font-bold" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute left-0 right-0 -bottom-1 h-1 bg-[var(--color-brand-primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/my-account">
              <User className="h-5 w-5" />
              <span className="sr-only">My Account</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Saved Items</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>
        </div>
      </motion.header>

      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
}
