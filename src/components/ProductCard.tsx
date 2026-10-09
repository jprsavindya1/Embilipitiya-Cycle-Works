"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, Heart } from "lucide-react";
import { Button } from "./Button";
import { useStore } from "@/store/useStore";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
  stock?: number;
}

export function ProductCard({ id, name, price, category, imageUrl, isNew, stock }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === id);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    addToCart({ id, name, price, category, imageUrl, isNew });
    
    // Show visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({ id, name, price, category, imageUrl, isNew });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[1/1] w-full rounded-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl overflow-hidden mb-4 transition-all duration-300">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {stock === 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Out of Stock
            </span>
          )}
          {isNew && stock !== 0 && (
            <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3 z-20">
          <button 
            className={`flex items-center justify-center h-8 w-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 ${isWishlisted ? "text-red-500" : "text-zinc-600 dark:text-zinc-300 hover:text-red-500"}`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Image */}
        <Link href={`/product/${id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          />
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        </Link>

        {/* Quick Add Button (Slide up on hover) */}
        {stock !== 0 && (
          <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button 
              className={`w-full rounded-sm h-10 border-none font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                isAdded 
                  ? "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]" 
                  : "bg-white/90 text-black hover:bg-[var(--color-brand-primary)] hover:text-white dark:bg-zinc-900/90 dark:text-white dark:hover:bg-[var(--color-brand-primary)]"
              }`}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                "Added!"
              ) : (
                <><ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart</>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col px-2">
        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">{category}</span>
        <div className="flex flex-col gap-1.5">
          <Link href={`/product/${id}`} className="font-bold text-lg leading-snug text-balance line-clamp-2 hover:text-[var(--color-brand-primary)] transition-colors">
            {name}
          </Link>
          <span className="font-semibold text-[1.1rem] text-zinc-900 dark:text-zinc-100">Rs. {price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
