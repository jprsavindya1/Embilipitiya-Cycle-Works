"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Image from "next/image";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      // Prevent body scrolling
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const publishedProducts = products.filter(p => p.isPublished !== false);
  const suggestions = query.trim() === ""
    ? publishedProducts.slice(0, 5)
    : publishedProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectProduct = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <Search className="h-6 w-6 text-zinc-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim() !== "") {
                    onClose();
                    router.push(`/products?search=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search for bicycles, accessories, gym equipment..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() !== "" && suggestions.length === 0 ? (
                <div className="py-14 text-center text-zinc-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm">We couldn't find anything matching "{query}"</p>
                </div>
              ) : (
                <ul className="p-2 space-y-1">
                  {suggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left group"
                      >
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 relative">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--color-brand-primary)] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-zinc-500">{product.category}</p>
                        </div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-50">
                          Rs. {product.price.toLocaleString()}
                        </div>
                      </button>
                    </li>
                  ))}
                  {query.trim() !== "" && (
                    <li className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/products?search=${encodeURIComponent(query)}`);
                        }}
                        className="w-full text-center p-3 text-sm font-bold text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10 rounded-xl transition-colors"
                      >
                        View all results for "{query}"
                      </button>
                    </li>
                  )}
                </ul>
              )}

              {query.trim() === "" && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-zinc-500">
                    Type to start searching across all our products.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
