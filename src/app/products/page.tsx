"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { Filter, ChevronDown, ChevronUp, SlidersHorizontal, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useStore, Product } from "@/store/useStore";

function FilterSidebar({
  activeCategory, setActiveCategory,
  priceRange, setPriceRange, maxAvailablePrice,
  selectedColors, setSelectedColors, availableColors,
  selectedSizes, setSelectedSizes, availableSizes
}: any) {
  const { categories: storeCategories } = useStore();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initialOpen: Record<string, boolean> = {
      Categories: true,
      Price: true,
      Color: true,
      Size: true
    };
    storeCategories.forEach(c => initialOpen[c.name] = true);
    return initialOpen;
  });

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev: string[]) => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev: string[]) => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        
        <div className="space-y-6">
          
          {/* CATEGORY FILTER */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer font-bold text-zinc-900 dark:text-white mb-2"
              onClick={() => toggleSection('Categories')}
            >
              <span>Categories</span>
              {openSections['Categories'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            <AnimatePresence>
              {openSections['Categories'] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-1 mt-2">
                    <div 
                      className={`cursor-pointer px-3 py-2 rounded-xl transition-all ${activeCategory === "All Categories" ? "bg-[var(--color-brand-primary)] text-white font-bold text-base" : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-base font-medium"}`}
                      onClick={() => setActiveCategory("All Categories")}
                    >
                      All Products
                    </div>
                    {storeCategories.map((cat) => {
                      const displayName = cat.name || "Bicycle and Accessories";
                      return (
                      <div key={cat.id}>
                        <div 
                          className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold text-base text-zinc-800 dark:text-zinc-200"
                          onClick={() => {
                            setActiveCategory(displayName);
                            if (!openSections[displayName]) toggleSection(displayName);
                          }}
                        >
                          <span className={activeCategory === displayName ? "text-[var(--color-brand-primary)]" : ""}>{displayName}</span>
                          <div 
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(displayName);
                            }}
                          >
                            {openSections[displayName] ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                          </div>
                        </div>
                        <AnimatePresence>
                          {openSections[displayName] && (() => {
                            const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories) : []);
                            return subcats.length > 0 && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-zinc-100 dark:border-zinc-800 ml-4 mt-1">
                                  {subcats.map((sub: string) => (
                                    <div 
                                      key={`${cat.id}-${sub}`}
                                      className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all text-sm ${
                                        activeCategory === sub
                                          ? "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] font-bold"
                                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
                                      }`}
                                      onClick={() => setActiveCategory(sub)}
                                    >
                                      {sub}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* PRICE FILTER */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer font-bold text-zinc-900 dark:text-white mb-4"
              onClick={() => toggleSection('Price')}
            >
              <span>Max Price</span>
              {openSections['Price'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            <AnimatePresence>
              {openSections['Price'] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-2 px-1">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl text-lg font-bold text-[var(--color-brand-primary)] text-center w-full shadow-inner">
                        Rs. {priceRange[1].toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-6">
                      <div 
                        className="absolute h-full bg-[var(--color-brand-primary)] rounded-full pointer-events-none"
                        style={{ width: `${(priceRange[1] / maxAvailablePrice) * 100}%` }}
                      ></div>
                      <input 
                        type="range" 
                        min="0" 
                        max={maxAvailablePrice} 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        style={{ WebkitAppearance: 'none' }}
                      />
                      <div 
                        className="absolute h-5 w-5 bg-white border-2 border-[var(--color-brand-primary)] rounded-full top-1/2 -translate-y-1/2 pointer-events-none shadow-md transition-transform"
                        style={{ 
                          left: `calc(${(priceRange[1] / maxAvailablePrice) * 100}% - 10px)`,
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                      <span>Rs. 0</span>
                      <span>Rs. {maxAvailablePrice.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* COLOR FILTER */}
          {availableColors.length > 0 && (
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer font-bold text-zinc-900 dark:text-white mb-2"
                onClick={() => toggleSection('Color')}
              >
                <span>Colors</span>
                {openSections['Color'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <AnimatePresence>
                {openSections['Color'] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 flex flex-wrap gap-2">
                      {availableColors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${selectedColors.includes(color) ? 'border-zinc-900 ring-2 ring-offset-2 ring-zinc-200' : 'border-transparent shadow-sm'}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {selectedColors.includes(color) && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {availableSizes.length > 0 && <hr className="border-zinc-200 dark:border-zinc-800" />}

          {/* SIZE FILTER */}
          {availableSizes.length > 0 && (
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer font-bold text-zinc-900 dark:text-white mb-2"
                onClick={() => toggleSection('Size')}
              >
                <span>Sizes</span>
                {openSections['Size'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <AnimatePresence>
                {openSections['Size'] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 flex flex-wrap gap-2">
                      {availableSizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selectedSizes.includes(size) ? 'bg-[var(--color-brand-primary)] text-white border-transparent' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const { products, categories: storeCategories, syncWithDB } = useStore();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  useEffect(() => {
    syncWithDB();
  }, [syncWithDB]);

  const [activeCategory, setActiveCategory] = useState("All Categories");
  
  // Extract Dynamic Options
  const { availableColors, availableSizes, maxAvailablePrice } = useMemo(() => {
    let maxPrice = 0;
    const colors = new Set<string>();
    const sizes = new Set<string>();

    products.filter(p => p.isPublished !== false).forEach(p => {
      if (p.price > maxPrice) maxPrice = p.price;
      if (p.colors) p.colors.forEach(c => colors.add(c));
      if (p.sizes) p.sizes.forEach(s => sizes.add(s));
    });

    return {
      availableColors: Array.from(colors),
      availableSizes: Array.from(sizes).sort(),
      maxAvailablePrice: maxPrice || 100000
    };
  }, [products]);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxAvailablePrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Sync max price when it changes
  useEffect(() => {
    setPriceRange([0, maxAvailablePrice]);
  }, [maxAvailablePrice]);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const isMatchCategory = (productCategory: string, active: string) => {
    if (active === "All Categories") return true;
    if (productCategory === active) return true;
    const selectedParent = storeCategories.find(c => c.name === activeCategory);
    if (selectedParent) {
      const subcats = Array.isArray(selectedParent.subcategories) ? selectedParent.subcategories : (typeof selectedParent.subcategories === 'string' ? JSON.parse(selectedParent.subcategories) : []);
      if (subcats.includes(productCategory)) return true;
    } return false;
  };

  const searchParamValue = searchParams.get("search")?.toLowerCase() || "";

  // FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.isPublished === false) return false;
      
      // Search Match
      if (searchParamValue) {
        const matchesName = product.name.toLowerCase().includes(searchParamValue);
        const matchesCategory = product.category.toLowerCase().includes(searchParamValue);
        if (!matchesName && !matchesCategory) return false;
      }

      // Category Match
      if (!isMatchCategory(product.category, activeCategory)) return false;
      
      // Price Match
      if (product.price > priceRange[1]) return false;

      // Color Match (if any colors selected, product must have at least one of them)
      if (selectedColors.length > 0) {
        if (!product.colors || !product.colors.some(c => selectedColors.includes(c))) return false;
      }

      // Size Match
      if (selectedSizes.length > 0) {
        if (!product.sizes || !product.sizes.some(s => selectedSizes.includes(s))) return false;
      }

      return true;
    });
  }, [products, activeCategory, priceRange, selectedColors, selectedSizes, storeCategories, searchParamValue]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar / Filters */}
      <FilterSidebar 
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        priceRange={priceRange} setPriceRange={setPriceRange} maxAvailablePrice={maxAvailablePrice}
        selectedColors={selectedColors} setSelectedColors={setSelectedColors} availableColors={availableColors}
        selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes} availableSizes={availableSizes}
      />

      {/* Product Grid */}
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
           <div>
             <h1 className="text-3xl font-bold">
               {activeCategory === "All Categories" ? "All Products" : activeCategory}
             </h1>
             {searchParamValue && (
               <div className="mt-2 flex items-center text-sm">
                 <span className="text-zinc-500 mr-2">Search results for:</span>
                 <span className="font-bold text-[var(--color-brand-primary)] px-2 py-1 bg-[var(--color-brand-primary)]/10 rounded-md">"{searchParamValue}"</span>
                 <button 
                   onClick={() => window.location.href = '/products'}
                   className="ml-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 underline"
                 >
                   Clear search
                 </button>
               </div>
             )}
           </div>
           <div className="text-sm font-medium px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 shrink-0">
             Showing {filteredProducts.length} results
           </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
            <Filter className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No products found</h3>
            <p>Try adjusting your filters (Price, Color, or Size) to see more results.</p>
            <Button onClick={() => {
              setActiveCategory("All Categories");
              setPriceRange([0, maxAvailablePrice]);
              setSelectedColors([]);
              setSelectedSizes([]);
            }} variant="outline" className="mt-6">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#09090b]">
      <Navbar />
      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Suspense fallback={<div className="flex justify-center py-20">Loading products...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
