"use client";

import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Button } from "@/components/Button";
import { ArrowRight, ShieldCheck, Wrench, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { useStore } from "@/store/useStore";

const mainCategoryMap: Record<string, string> = {
  "Bicycle": "Bicycle and Accessories",
  "Bicycle Accessories": "Bicycle and Accessories",
  "Baby Swings": "Children Items",
  "Baby Walker": "Children Items",
  "Go-Kart": "Children Items",
  "Push Scooters": "Children Items",
  "Rechargeable Jeeps and Bikes": "Children Items",
  "TOLO Cars": "Children Items",
  "Tricycle": "Children Items",
  "Badminton": "Sport Items",
  "Carom": "Sport Items",
  "Cricket": "Sport Items",
  "Gym Equipment": "Sport Items",
  "Volleyball": "Sport Items"
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const { products, syncWithDB } = useStore();
  
  React.useEffect(() => {
    syncWithDB();
  }, [syncWithDB]);
  
  const mappedProducts = products
    .filter(p => p.isPublished !== false)
    .map(p => ({
      ...p,
      category: mainCategoryMap[p.category] || p.category
    }))
    .sort((a, b) => {
      // Prioritize isNew
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      
      // Then prioritize newest first by createdAt if available
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    })
    .slice(0, 15); // Show top 15 in the carousel
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-white dark:bg-[#09090b]">
        {/* Overlapping Hero Section */}
        <section className="relative w-full pt-16 flex flex-col items-center bg-white dark:bg-[#09090b]">
          {/* Background Landscape (Only top 80%) */}
          <div className="absolute top-0 left-0 w-full h-[75vh] md:h-[85vh] z-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80" 
              alt="Mountain Landscape" 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
          </div>
            
          {/* Typography Container (In flow to push content down properly) */}
          <div className="relative z-0 w-full max-w-7xl mx-auto px-4 lg:px-12 pt-0 mt-[-2vh] md:mt-[-6vh]">
            
            {/* Premium Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 md:mb-8 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
                Welcome to Ebilipitiya Cycle Works
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[1.05] drop-shadow-2xl mb-3 md:mb-5">
                GEAR UP FOR <br/>
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#7dd3fc]">PERFECT</span> RIDE
              </h1>
              
              <div className="text-xs md:text-base lg:text-lg text-zinc-200 font-medium max-w-xl drop-shadow-xl leading-relaxed space-y-2">
                <p>
                  Explore our curated collection of world-class bicycles, premium accessories, and professional repair services.
                </p>
                <p>
                  Your ultimate cycling journey begins right here.
                </p>
              </div>
            </motion.div>    </div>

          {/* Foreground Bike (Overlapping 3D Effect) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-[-15vh] md:mt-[-22vh] flex flex-col items-center pointer-events-none">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="w-full max-w-3xl md:max-w-4xl -mb-12 md:-mb-16 relative flex flex-col items-center"
            >
              {/* Custom SVG Mountain Bike */}
              <img 
                src="/bike-transparent.png" 
                alt="Premium Mountain Bike" 
                className="w-full h-auto z-10 relative drop-shadow-2xl"
              />
              
              {/* 3D Ground Shadow under the wheels */}
              <div className="w-[80%] h-6 md:h-12 bg-black/40 dark:bg-black/80 blur-xl md:blur-2xl rounded-[100%] absolute bottom-[5%] md:bottom-[8%] z-0" />
            </motion.div>
            
            {/* Below Bike Details - Button removed */}
          </div>
        </section>

        {/* Clean Featured Products Section */}
        <section className="pt-12 pb-0 bg-zinc-50 dark:bg-zinc-900 relative">
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8 text-center md:text-left"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">
                  Featured Products
                </h2>
                <div className="w-16 h-1 bg-[#0ea5e9] mx-auto md:mx-0" />
              </div>
              <Button asChild className="hidden md:flex rounded-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-widest px-8 shadow-sm hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all">
                <Link href="/products">Shop All</Link>
              </Button>
            </motion.div>

            <FeaturedCarousel products={mappedProducts} />
            
            <div className="mt-16 flex justify-center md:hidden">
              <Button asChild variant="outline" size="lg" className="w-full rounded-none border border-zinc-300 dark:border-zinc-700 font-bold uppercase tracking-widest h-14 hover:bg-[var(--color-brand-primary)] hover:text-white transition-all">
                <Link href="/products">Shop All</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
