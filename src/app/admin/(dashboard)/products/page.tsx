"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, X, Eye } from "lucide-react";
import { Button } from "@/components/Button";
import { useStore, Product } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import * as XLSX from "xlsx";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories: storeCategories } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false, index: number = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      
      if (data.success) {
        if (isMain) {
          setFormData(prev => ({ ...prev, imageUrl: data.url }));
        } else {
          handleUpdateGalleryUrl(index, data.url);
        }
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ["All Categories", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      Name: "Sample Product",
      Price: 15000,
      Category: "Bicycle",
      Description: "Sample description...",
      SKU: "SKU-123",
      Brand: "Lumala",
      Stock: 10
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products Template");
    XLSX.writeFile(wb, "ECW_Products_Template.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      let newCount = 0;
      let updatedCount = 0;
      data.forEach((row: any) => {
        if (row.Name && row.Price) {
          // Check if product exists by SKU or Name
          const existingProduct = products.find(p => 
            (row.SKU && p.sku === row.SKU) || 
            (p.name.toLowerCase() === row.Name.toLowerCase())
          );

          if (existingProduct) {
            updateProduct(existingProduct.id, { 
              stock: Number(row.Stock) || 0,
              price: Number(row.Price) || existingProduct.price
            });
            updatedCount++;
          } else {
            const newProduct: Product = {
              id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: row.Name,
              price: Number(row.Price) || 0,
              category: row.Category || "Uncategorized",
              description: row.Description || "",
              sku: row.SKU || "",
              brand: row.Brand || "",
              stock: Number(row.Stock) || 0,
              imageUrl: "", 
              isPublished: false 
            };
            addProduct(newProduct);
            newCount++;
          }
        }
      });
      alert(`Successfully added ${newCount} new products and updated ${updatedCount} existing products!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: `p${Date.now()}`,
        name: "",
        price: 0,
        category: "General",
        imageUrl: "",
        gallery: [],
        description: "",
        stock: 10,
        brand: "",
        sku: `SKU-${Date.now()}`,
        isPublished: true
      });
    }
    setIsModalOpen(true);
  };

  const handleAddGalleryUrl = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ""]
    }));
  };

  const handleUpdateGalleryUrl = (index: number, url: string) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery[index] = url;
      return { ...prev, gallery: newGallery };
    });
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSetMainImage = (index: number) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      const newMain = newGallery[index];
      const oldMain = prev.imageUrl;
      newGallery[index] = oldMain || "";
      return { ...prev, imageUrl: newMain, gallery: newGallery };
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageUrl || !formData.category) {
      alert("Please fill required fields (Name, Price, Category, Image URL)");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData as Product);
    } else {
      addProduct(formData as Product);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500">Manage your store's products and inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shrink-0 rounded-xl font-semibold" onClick={handleDownloadTemplate}>
            Download Template
          </Button>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <Button variant="outline" className="shrink-0 rounded-xl font-semibold" onClick={() => fileInputRef.current?.click()}>
            Bulk Upload
          </Button>
          <Link href="/admin/products/new">
            <Button className="shrink-0 rounded-xl font-semibold">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
            <select 
              className="text-sm rounded-lg w-full md:w-48 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</div>
                        <div className="text-xs text-zinc-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{product.category}</td>
                  <td className="px-6 py-4 font-medium">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {(product.stock || 0) > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {product.stock} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.isPublished !== false ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/product/${product.id}`} target="_blank" className="p-2 text-zinc-400 hover:text-[var(--color-brand-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-zinc-400 hover:text-[var(--color-brand-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 md:p-8"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name || ""} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Price *</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price || 0} 
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Category *</label>
                    <select 
                      required
                      value={formData.category || ""} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select a category</option>
                      {storeCategories.map(cat => {
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
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Stock</label>
                    <input 
                      type="number" 
                      value={formData.stock || 0} 
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Status</label>
                    <select 
                      value={formData.isPublished === false ? "draft" : "published"} 
                      onChange={e => setFormData({...formData, isPublished: e.target.value === "published"})}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Product Images *</label>
                    <button type="button" onClick={handleAddGalleryUrl} className="text-xs text-blue-500 hover:text-blue-600 font-bold uppercase tracking-widest flex items-center">
                      <Plus className="h-3 w-3 mr-1" /> Add Image
                    </button>
                  </div>
                  
                  {/* Main Image */}
                  <div className="flex items-start gap-3">
                    {formData.imageUrl && (
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                        <img src={formData.imageUrl} alt="Main Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleImageUpload(e, true)}
                        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                      />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-sm inline-block">Main Image</span>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  {formData.gallery?.map((url, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {url && (
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                          <img src={url} alt={`Gallery Preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => handleImageUpload(e, false, idx)}
                          className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-300" 
                        />
                        <div className="flex gap-2 mt-1">
                          <button type="button" onClick={() => handleSetMainImage(idx)} className="text-[10px] text-zinc-500 hover:text-blue-500 font-bold uppercase tracking-widest px-2 py-0.5 border border-zinc-200 rounded-sm">Set as Main</button>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleRemoveGalleryUrl(idx)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors self-center">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea 
                    value={formData.description || ""} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3 border-t dark:border-zinc-800">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Product'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
