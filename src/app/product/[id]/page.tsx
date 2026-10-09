"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { useStore } from "@/store/useStore";
import { Star, Minus, Plus, Heart, ShieldCheck, Truck, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { products, addToCart, wishlist, toggleWishlist, reviews, addReview } = useStore();
  
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [activeTab, setActiveTab] = useState("description");
  const [currentImage, setCurrentImage] = useState(product?.imageUrl || "");

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    if (product) {
      if (!currentImage && product.imageUrl) setCurrentImage(product.imageUrl);
      if (!selectedColor && product.colors?.[0]) setSelectedColor(product.colors[0]);
      if (!selectedSize && product.sizes?.[0]) setSelectedSize(product.sizes[0]);
    }
  }, [product, currentImage, selectedColor, selectedSize]);

  const productReviews = reviews.filter(r => r.productId === id && r.approved);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => router.push("/products")} variant="outline" className="border-black text-black">Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.isPublished !== false)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    
    await addReview({
      productId: id,
      author: reviewName,
      rating: reviewRating,
      comment: reviewComment
    });
    
    setReviewSubmitted(true);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-zinc-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-black">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-black">{product.category}</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-zinc-50 aspect-square w-full md:h-[500px] rounded-lg border border-zinc-200 p-8 flex items-center justify-center relative overflow-hidden">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="object-contain w-full h-full" 
                />
              ) : (
                <span className="text-zinc-400">No Image</span>
              )}
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {((product.gallery && product.gallery.length > 0) || product.imageUrl) && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrl && (
                  <button
                    onClick={() => setCurrentImage(product.imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border p-2 flex items-center justify-center transition-colors
                      ${currentImage === product.imageUrl ? 'border-black' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <img src={product.imageUrl} alt="Main" className="object-contain w-full h-full" />
                  </button>
                )}
                {product.gallery?.filter(url => url).map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border p-2 flex items-center justify-center transition-colors
                      ${currentImage === url ? 'border-black' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="object-contain w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center text-amber-500">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= (product.rating || 5) ? 'fill-current' : 'text-zinc-300'}`} />
                ))}
                <span className="text-zinc-500 ml-2">({productReviews.length} Reviews)</span>
              </div>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-600">Brand: <span className="font-medium text-black">{product.brand || "Generic"}</span></span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-600">SKU: <span className="font-medium text-black">{product.sku || "N/A"}</span></span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-zinc-900">
                Rs. {product.price.toLocaleString()}
              </div>
              {product.stock && product.stock > 0 ? (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ In Stock
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            <p className="text-zinc-600 text-sm leading-relaxed mb-8 border-t border-zinc-100 pt-6">
              {product.description || "No description available for this product. High-quality bicycle designed for performance and durability."}
            </p>

            {/* Variations */}
            <div className="space-y-6 mb-8">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-zinc-900 mb-3">Color: <span className="text-zinc-500">{selectedColor}</span></div>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all
                          ${selectedColor === color ? 'border-black ring-2 ring-black ring-offset-2' : 'border-zinc-300 hover:border-zinc-500'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-zinc-900 mb-3">Size</div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded text-sm font-medium transition-colors
                          ${selectedSize === size 
                            ? 'border-black bg-black text-white' 
                            : 'border-zinc-300 text-zinc-700 hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-4">
                <div className="flex items-center border border-zinc-300 rounded h-12 w-32">
                  <button disabled={product.stock === 0} onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-black disabled:opacity-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center font-medium">{product.stock === 0 ? 0 : quantity}</div>
                  <button disabled={product.stock === 0} onClick={() => setQuantity(q => Math.min((product.stock || 100), q + 1))} className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-black disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0}
                  className={`flex-1 h-12 border-2 border-black font-bold uppercase tracking-wide text-sm transition-colors rounded ${
                    product.stock === 0 
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
                
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className={`w-12 h-12 border rounded flex items-center justify-center transition-colors
                    ${wishlist.some(w => w.id === product.id) 
                      ? 'border-red-200 bg-red-50 text-red-500' 
                      : 'border-zinc-300 text-zinc-500 hover:border-black hover:text-black'}`}
                >
                  <Heart className={`h-5 w-5 ${wishlist.some(w => w.id === product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button 
                onClick={() => { handleAddToCart(); router.push('/checkout'); }}
                disabled={product.stock === 0}
                className={`w-full h-12 font-bold uppercase tracking-wide text-sm transition-colors rounded ${
                  product.stock === 0
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {product.stock === 0 ? "Unavailable" : "Buy It Now"}
              </button>
            </div>

            {/* Trust Badges Minimal */}
            <div className="bg-zinc-50 border border-zinc-200 rounded p-4 flex justify-between items-center text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-zinc-400" /> Secure Payment</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-zinc-400" /> Fast Delivery</div>
              <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-zinc-400" /> Easy Returns</div>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-500 border-t border-zinc-100 pt-6">
              <Share2 className="w-4 h-4" /> Share:
              <a href="#" className="hover:text-black transition-colors">Facebook</a>, 
              <a href="#" className="hover:text-black transition-colors">WhatsApp</a>, 
              <a href="#" className="hover:text-black transition-colors">Instagram</a>
            </div>

          </div>
        </div>

        {/* Product Details Tabs - Classic Styling */}
        <div className="mt-16 border border-zinc-200 rounded-lg overflow-hidden">
          <div className="flex flex-wrap border-b border-zinc-200 bg-zinc-50">
            {['description', 'additional', 'reviews'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium uppercase tracking-wide transition-colors
                  ${activeTab === tab 
                    ? 'bg-white border-t-2 border-t-black text-black' 
                    : 'text-zinc-500 hover:text-zinc-900 border-t-2 border-t-transparent hover:bg-zinc-100'}`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'additional' && 'Additional Info'}
                {tab === 'reviews' && `Reviews (${productReviews.length})`}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-zinc-600 text-sm">
                <p>{product.description || "No description available for this product."}</p>
              </div>
            )}
            
            {activeTab === 'additional' && (
              <div className="text-sm">
                <table className="w-full text-left text-zinc-600 border-collapse">
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <td className="py-3 font-medium text-zinc-900 w-1/3 sm:w-1/4">Weight</td>
                      <td className="py-3">N/A</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-3 font-medium text-zinc-900 w-1/3 sm:w-1/4">Dimensions</td>
                      <td className="py-3">N/A</td>
                    </tr>
                    {product.colors && product.colors.length > 0 && (
                      <tr className="border-b border-zinc-100">
                        <td className="py-3 font-medium text-zinc-900 w-1/3 sm:w-1/4">Colors</td>
                        <td className="py-3">{product.colors.join(', ')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-bold mb-6">Customer Reviews</h3>
                  {productReviews.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No reviews yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {productReviews.map(review => (
                        <div key={review.id} className="border-b border-zinc-100 pb-6 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-amber-500">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-current' : 'text-zinc-300'}`} />
                              ))}
                            </div>
                            <span className="font-medium text-sm text-zinc-900">{review.author}</span>
                            <span className="text-xs text-zinc-400">• {new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-6">Add a Review</h3>
                  {reviewSubmitted ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded text-sm">
                      Thank you! Your review has been submitted and is pending approval.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Rating</label>
                        <div className="flex gap-1 text-amber-500 cursor-pointer">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star 
                              key={i} 
                              onClick={() => setReviewRating(i)}
                              className={`h-5 w-5 ${i <= reviewRating ? 'fill-current' : 'text-zinc-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="author" className="block text-sm font-medium mb-1">Name *</label>
                        <input 
                          type="text" 
                          id="author"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review *</label>
                        <textarea 
                          id="comment"
                          required
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                        ></textarea>
                      </div>
                      <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-zinc-800 transition-colors">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-[var(--color-brand-primary)] rounded-full inline-block"></span>
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} {...rp} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Toast Notification Minimal */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-black text-white px-4 py-3 rounded shadow-xl z-50 flex items-center gap-3 text-sm font-medium">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-black">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          Added to Cart
        </div>
      )}

      <Footer />
    </div>
  );
}
