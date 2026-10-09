"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/Button";
import { useStore, Product } from "@/store/useStore";

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, categories } = useStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    stock: 10,
    brand: "",
    sku: `SKU-${Date.now()}`
  });

  const [colorsText, setColorsText] = useState("");
  const [sizesText, setSizesText] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in Name, Price, and Category");
      return;
    }
    
    setIsSubmitting(true);
    
    // Process colors and sizes
    const colors = colorsText.split(",").map(c => c.trim()).filter(c => c);
    const sizes = sizesText.split(",").map(s => s.trim().toUpperCase()).filter(s => s);
    
    // Process Images
    let imageUrl = "";
    const gallery: string[] = [];
    
    if (images.length > 0) {
      imageUrl = images[mainImageIndex];
      images.forEach((img, idx) => {
        if (idx !== mainImageIndex) {
          gallery.push(img);
        }
      });
    } else {
      // Fallback if no image
      imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
    }
    
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: formData.name || "",
      price: formData.price || 0,
      originalPrice: formData.originalPrice || undefined,
      category: formData.category || "",
      description: formData.description || "",
      stock: formData.stock || 0,
      brand: formData.brand || undefined,
      sku: formData.sku || undefined,
      imageUrl,
      gallery,
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      rating: 5
    };

    setTimeout(() => {
      addProduct(newProduct);
      setIsSubmitting(false);
      router.push("/admin/products");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/admin/products" 
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-sm text-zinc-500">Create a new product listing in your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-bold mb-2">Basic Information</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Trek Marlin 8 Gen 3"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Brand</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    placeholder="e.g. Apple, Trek"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => {
                      const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories) : []);
                      return (
                        <optgroup key={cat.id} label={cat.name}>
                          <option value={cat.name}>{cat.name} (Parent)</option>
                          {subcats.map((sub: string) => (
                            <option key={`${cat.id}-${sub}`} value={sub}>{sub}</option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-bold mb-2">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Price (Rs.) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Compare at Price (Rs.)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">SKU / Barcode</label>
                  <input 
                    type="text" 
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="e.g. PROD-1234"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Stock Quantity <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-bold mb-2">Variants (Optional)</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Colors (comma separated CSS colors/hex)</label>
                  <input 
                    type="text" 
                    value={colorsText}
                    onChange={e => setColorsText(e.target.value)}
                    placeholder="e.g. red, #000000, #FFFFFF, blue"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Sizes (comma separated)</label>
                  <input 
                    type="text" 
                    value={sizesText}
                    onChange={e => setSizesText(e.target.value)}
                    placeholder="e.g. S, M, L, XL, 42, 44"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-5 sticky top-6">
              <h2 className="text-lg font-bold mb-2">Product Images</h2>
              <p className="text-sm text-zinc-500 mb-4">Upload images and select the main thumbnail.</p>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              {images.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((url, idx) => (
                      <div key={idx} className={`relative rounded-xl overflow-hidden border-2 group ${mainImageIndex === idx ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {mainImageIndex !== idx && (
                            <button 
                              type="button"
                              onClick={() => setMainImageIndex(idx)}
                              className="px-3 py-1 bg-white text-xs font-bold text-zinc-900 rounded-md hover:bg-zinc-200 transition-colors shadow-lg"
                            >
                              Set Main
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1.5 bg-white text-red-500 rounded-md hover:bg-red-50 transition-colors shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {mainImageIndex === idx && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-md">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-dashed border-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Add More Images
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold mb-1">Click to upload</p>
                  <p className="text-xs text-zinc-500">Select multiple SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <Button type="submit" disabled={isSubmitting} className="w-full font-bold">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </Button>
                <Link href="/admin/products" className="block text-center">
                  <Button variant="ghost" type="button" className="w-full">Cancel</Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
