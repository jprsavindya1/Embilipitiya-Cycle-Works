"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
};

interface FeaturedCarouselProps {
  products: FeaturedProduct[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  // Extract unique categories for top nav
  const categories = Array.from(new Set(products.map(p => p.category)));

  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [activeIndex, setActiveIndex] = useState(-1);

  // Filter products by selected category
  const filteredProducts = products.filter(p => p.category === (activeCategory || categories[0]));
  
  const currentIndex = activeIndex === -1 ? Math.floor(filteredProducts.length / 2) : activeIndex;

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const newLength = products.filter(p => p.category === category).length;
    setActiveIndex(Math.floor(newLength / 2)); // Reset index to middle
  };

  const handleNext = () => {
    if (currentIndex < filteredProducts.length - 1) {
      setActiveIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden py-10">
      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16 px-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 font-bold uppercase tracking-widest text-sm transition-all ${
              (activeCategory || categories[0]) === category 
                ? "text-[#0ea5e9] drop-shadow-md border-b-2 border-[#0ea5e9]" 
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 3D Carousel Stage */}
      <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center perspective-[1000px]">
        {filteredProducts.map((product, index) => {
          // Calculate distance from active item (-2, -1, 0, 1, 2)
          const offset = index - currentIndex;
          
          // Determine scale, position, and opacity based on distance
          const isActive = offset === 0;
          
          // Responsive x shift
          const shiftValue = typeof window !== 'undefined' && window.innerWidth < 768 ? 150 : 300;
          const x = offset * shiftValue; // Horizontal shift
          const scale = 1 - Math.abs(offset) * 0.2; // 1, 0.8, 0.6...
          const zIndex = 10 - Math.abs(offset);
          const opacity = 1 - Math.abs(offset) * 0.15; // 1, 0.85, 0.7...

          // Don't render items too far away
          if (Math.abs(offset) > 2) return null;

          return (
            <motion.div
              key={product.id}
              className={`absolute top-0 w-[260px] md:w-[350px] aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ${
                isActive ? "border-2 border-zinc-700/50" : "pointer-events-none"
              }`}
              initial={false}
              animate={{
                x,
                scale,
                zIndex,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              onClick={() => setActiveIndex(index)}
              style={{
                // Optional: add 3D rotation if desired, but 2D scaling + x shift mimics the screenshot well
                transformOrigin: "center center"
              }}
            >
              {/* Card Inner Container (Designed for real photography) */}
              <div className="relative w-full h-full flex flex-col bg-zinc-900 overflow-hidden rounded-lg shadow-2xl">
                
                {/* Product Image Background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                
                {/* New Badge (Top Right) */}
                {product.isNew && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-[#0ea5e9] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      New Arrival
                    </span>
                  </div>
                )}

                {/* Bottom Content Area */}
                <div className="relative z-20 mt-auto p-6 flex flex-col justify-end h-full">
                  <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter leading-tight drop-shadow-md mb-2 line-clamp-3">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#0ea5e9] font-bold text-xl md:text-2xl drop-shadow-sm">Rs. {product.price.toLocaleString()}</span>
                  </div>
                  
                  <motion.div 
                    animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full overflow-hidden"
                  >
                    {isActive && (
                      <Button asChild className="w-full bg-[#0ea5e9] text-white hover:bg-sky-400 font-bold uppercase tracking-widest text-sm h-12 rounded-none mt-2">
                        <Link href={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
              
              {/* Dim overlay for non-active items */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/40 z-30 pointer-events-auto cursor-pointer" onClick={() => setActiveIndex(index)} />
              )}
            </motion.div>
          );
        })}

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 pointer-events-none z-40">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-lg flex items-center justify-center pointer-events-auto transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-white dark:hover:bg-zinc-800 text-[#0ea5e9]'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredProducts.length - 1}
            className={`w-12 h-12 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-lg flex items-center justify-center pointer-events-auto transition-all ${currentIndex === filteredProducts.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-white dark:hover:bg-zinc-800 text-[#0ea5e9]'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-3 mt-12 md:mt-16 z-20">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? "bg-[#0ea5e9] w-8 shadow-[0_0_10px_#0ea5e9]" 
                : "bg-zinc-600 hover:bg-zinc-400 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-8 flex justify-center w-full z-10 relative">
        <Button asChild variant="ghost" className="font-bold uppercase tracking-widest text-zinc-500 hover:text-[#0ea5e9] flex items-center gap-2">
          <Link href={`/products?category=${encodeURIComponent(activeCategory || categories[0])}`}>
            View More {activeCategory || categories[0]} <span>&rarr;</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
