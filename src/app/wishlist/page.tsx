"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/store/useStore";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { wishlist } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
            Saved Items
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-red-300 dark:text-red-700" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">You have no saved items</h2>
            <p className="text-zinc-500 mb-8 max-w-md text-center">
              Save your favorite items here so you can easily find them later and add them to your cart.
            </p>
            <Button asChild className="uppercase tracking-widest font-bold px-8">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                imageUrl={product.imageUrl}
                isNew={product.isNew}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
