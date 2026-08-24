"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Star, CheckCircle, Trash2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [mounted, setMounted] = useState(false);
  const { reviews, approveReview, deleteReview, products } = useStore();

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

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">
            Admin - Review Management
          </h1>
          <p className="text-zinc-500">Approve or delete incoming customer reviews.</p>
        </div>

        <div className="space-y-12">
          {/* Pending Reviews Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-zinc-900 dark:text-white">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Pending Reviews ({pendingReviews.length})
            </h2>
            
            {pendingReviews.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500 font-medium">
                There are no pending reviews at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingReviews.map(review => (
                  <div key={review.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-blue-500 mb-2 truncate">
                      {getProductName(review.productId)}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-lg">{review.author}</span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-grow italic">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <Button 
                        onClick={() => approveReview(review.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-2"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        onClick={() => deleteReview(review.id)}
                        variant="outline"
                        className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/30 font-bold text-xs uppercase tracking-widest py-2"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Approved Reviews Section (Optional viewing) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-zinc-900 dark:text-white">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Approved Reviews ({approvedReviews.length})
            </h2>
            
            {approvedReviews.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500 font-medium">
                No approved reviews yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                {approvedReviews.map(review => (
                  <div key={review.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-blue-500 mb-2 truncate">
                      {getProductName(review.productId)}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-lg">{review.author}</span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-grow italic">
                      "{review.comment}"
                    </p>
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-right">
                      <Button 
                        onClick={() => deleteReview(review.id)}
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-xs font-bold uppercase tracking-widest px-3 py-1 h-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
