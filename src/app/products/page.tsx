"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { useStore } from "@/store/useStore";

type CategoryNode = {
  name: string;
  subcategories?: string[];
};

const CATEGORIES: CategoryNode[] = [
  {
    name: "Bicycle and Accessories",
    subcategories: ["Bicycle", "Bicycle Accessories"]
  },
  {
    name: "Children Items",
    subcategories: [
      "Baby Swings",
      "Baby Walker",
      "Go-Kart",
      "Push Scooters",
      "Rechargeable Jeeps and Bikes",
      "TOLO Cars",
      "Tricycle"
    ]
  },
  {
    name: "Sport Items",
    subcategories: [
      "Badminton",
      "Carom",
      "Cricket",
      "Gym Equipment",
      "Volleyball"
    ]
  }
];

function CategoryAccordion({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Bicycle and Accessories": true,
    "Children Items": true,
    "Sport Items": true
  });

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-4 font-sans pr-4">
      <div>
        <h3 className="font-bold text-sm md:text-base uppercase tracking-wide text-zinc-900 dark:text-white pb-1">
          PRODUCT CATEGORIES
        </h3>
        <div className="w-12 h-1 bg-[#bae6fd] mb-6 mt-1 rounded-full"></div>
      </div>
      
      <ul className="space-y-1 text-sm md:text-base">
        <li>
          <button
            onClick={() => setActiveCategory("All")}
            className={`text-left w-full py-2 transition-colors hover:text-[#0ea5e9] ${
              activeCategory === "All" ? "text-[#0ea5e9] font-medium" : "text-zinc-800 dark:text-zinc-200"
            }`}
          >
            All Products
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="py-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveCategory(cat.name)}
                className={`text-left flex-grow py-1 transition-colors hover:text-[#0ea5e9] font-medium ${
                  activeCategory === cat.name ? "text-[#0ea5e9]" : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {cat.name}
              </button>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(cat.name);
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {openSections[cat.name] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            
            {openSections[cat.name] && cat.subcategories && (
              <ul className="mt-2 ml-1 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 space-y-3 py-2">
                {cat.subcategories.map(sub => (
                  <li key={sub}>
                    <button
                      onClick={() => setActiveCategory(sub)}
                      className={`text-left w-full transition-colors hover:text-[#0ea5e9] text-sm ${
                        activeCategory === sub ? "text-[#0ea5e9] font-medium" : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductsContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Determine if a product matches the active category
  // If active is a parent (e.g. "Sport Items"), we should show all products in its subcategories.
  const isMatch = (productCategory: string, active: string) => {
    if (active === "All") return true;
    if (productCategory === active) return true;
    
    // Check if active is a parent category
    const parentCat = CATEGORIES.find(c => c.name === active);
    if (parentCat && parentCat.subcategories) {
      return parentCat.subcategories.includes(productCategory);
    }
    
    return false;
  };

  const filteredProducts = products.filter(product => isMatch(product.category, activeCategory));

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar / Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 bg-white dark:bg-[#09090b] z-10 md:bg-transparent">
          <CategoryAccordion activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold">
             {activeCategory === "All" ? "All Products" : activeCategory}
           </h1>
           <div className="text-sm text-zinc-500">
             Showing {filteredProducts.length} results
           </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
            <Filter className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No products found</h3>
            <p>We don't have any products in this category yet.</p>
            <Button onClick={() => setActiveCategory("All")} variant="outline" className="mt-4">
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Suspense fallback={<div className="flex justify-center py-20">Loading products...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
