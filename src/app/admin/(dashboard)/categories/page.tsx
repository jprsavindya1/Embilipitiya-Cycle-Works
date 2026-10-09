"use client";

import React, { useState, useEffect } from "react";
import { useStore, Category } from "@/store/useStore";
import { FolderTree, Plus, Edit, Trash2, ShieldAlert, Check, X, Tag } from "lucide-react";
import { Button } from "@/components/Button";

export default function CategoryManagementPage() {
  const [mounted, setMounted] = useState(false);
  const { currentAdmin, categories, addCategory, updateCategory, deleteCategory } = useStore();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  
  const [addSubCatTo, setAddSubCatTo] = useState<string | null>(null);
  const [newSubCatName, setNewSubCatName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (currentAdmin?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="h-20 w-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-zinc-500">You must be a Super Admin to manage categories.</p>
      </div>
    );
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    addCategory({
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      subcategories: []
    });
    
    setNewCatName("");
    setIsAddOpen(false);
  };

  const handleUpdateCategory = (id: string) => {
    if (!editCatName.trim()) return;
    updateCategory(id, { name: editCatName.trim() });
    setEditingCatId(null);
  };

  const handleAddSubcategory = (id: string) => {
    if (!newSubCatName.trim()) return;
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories) : []);
    
    if (subcats.includes(newSubCatName.trim())) {
      alert("This subcategory already exists.");
      return;
    }
    
    updateCategory(id, { subcategories: [...subcats, newSubCatName.trim()] });
    setAddSubCatTo(null);
    setNewSubCatName("");
  };

  const handleRemoveSubcategory = (catId: string, subName: string) => {
    if (!confirm(`Are you sure you want to delete the subcategory "${subName}"?`)) return;
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories) : []);
    updateCategory(catId, { subcategories: subcats.filter((s: string) => s !== subName) });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to completely delete the category "${name}"?`)) return;
    deleteCategory(id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl">
            <FolderTree className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
            <p className="text-zinc-500 text-sm">Organize products into categories and subcategories.</p>
          </div>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)} className="bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAddOpen && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 items-end max-w-lg">
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category Name</label>
              <input
                autoFocus
                required
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-[var(--color-brand-primary)]"
                placeholder="e.g. Bicycles"
              />
            </div>
            <Button type="button" onClick={() => setIsAddOpen(false)} variant="outline" className="h-10">Cancel</Button>
            <Button type="submit" className="h-10 bg-[var(--color-brand-primary)] text-white">Save</Button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
              {editingCatId === cat.id ? (
                <div className="flex items-center gap-3">
                  <input
                    autoFocus
                    value={editCatName}
                    onChange={e => setEditCatName(e.target.value)}
                    className="h-9 px-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg outline-none focus:border-[var(--color-brand-primary)]"
                  />
                  <Button size="sm" onClick={() => handleUpdateCategory(cat.id)} className="bg-green-500 text-white hover:bg-green-600 px-3"><Check className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingCatId(null)} className="px-3"><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{cat.name}</h3>
                  <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                    {Array.isArray(cat.subcategories) ? cat.subcategories.length : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories).length : 0)} items
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border-zinc-200 dark:border-zinc-800" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex flex-wrap gap-3 mb-4">
                {(() => {
                  const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : (typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories) : []);
                  return subcats.map((sub: string) => (
                    <div key={sub} className="flex items-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-3 pr-1 py-1.5 text-sm font-medium">
                      <Tag className="h-3.5 w-3.5 mr-2 text-zinc-400" />
                      {sub}
                      <button 
                        onClick={() => handleRemoveSubcategory(cat.id, sub)}
                        className="ml-2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ));
                })()}
              </div>
              
              {addSubCatTo === cat.id ? (
                <div className="flex items-center gap-3">
                  <input
                    autoFocus
                    value={newSubCatName}
                    onChange={e => setNewSubCatName(e.target.value)}
                    placeholder="New subcategory name"
                    className="h-9 px-3 w-64 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg outline-none focus:border-[var(--color-brand-primary)]"
                  />
                  <Button size="sm" onClick={() => handleAddSubcategory(cat.id)} className="bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)] px-3"><Check className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setAddSubCatTo(null)} className="px-3"><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => { setAddSubCatTo(cat.id); setNewSubCatName(""); }} className="text-xs border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Subcategory
                </Button>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
            <FolderTree className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">No categories found. Create your first category above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
