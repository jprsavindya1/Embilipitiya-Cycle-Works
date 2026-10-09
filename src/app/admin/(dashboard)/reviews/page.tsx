"use client";

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews');
      
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: !currentStatus } : r));
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      alert('Error updating review status');
      fetchReviews();
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      setReviews(reviews.filter(r => r.id !== id));
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (err) {
      alert('Error deleting review');
      fetchReviews();
    }
  };

  if (loading) return <div className="p-8">Loading reviews...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Reviews</h1>
        <p className="text-zinc-500">Manage and moderate customer reviews before they appear on the site.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Product ID</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    No reviews found.
                  </td>
                </tr>
              )}
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{review.author}</td>
                  <td className="px-6 py-4 text-zinc-500">{review.productId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-[var(--color-brand-primary)]">
                      {review.rating} <Star className="h-4 w-4 ml-1 fill-current" />
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {review.approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => toggleApproval(review.id, review.approved)}
                      className={`inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors ${review.approved ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      title={review.approved ? "Revoke Approval" : "Approve Review"}
                    >
                      {review.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
