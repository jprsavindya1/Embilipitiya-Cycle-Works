"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { useStore } from "@/store/useStore";
import { Star, Minus, Plus, Heart } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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

  const productReviews = reviews.filter(r => r.productId === id && r.approved);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => router.push("/products")}>Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    
    addReview({
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">HOME</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100">{product.name}</span>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-8 group">
              <img 
                src={currentImage} 
                alt={product.name} 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* Main image as thumbnail */}
                <button
                  onClick={() => setCurrentImage(product.imageUrl)}
                  className={`relative flex-shrink-0 w-20 h-20 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all ${currentImage === product.imageUrl ? 'border-blue-500 shadow-md' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'}`}
                >
                  <img src={product.imageUrl} alt="Main" className="object-cover w-full h-full p-2" />
                </button>
                {/* Gallery images as thumbnails */}
                {product.gallery.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(url)}
                    className={`relative flex-shrink-0 w-20 h-20 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all ${currentImage === url ? 'border-blue-500 shadow-md' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'}`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="object-cover w-full h-full p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= (product.rating || 5) ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} />
                ))}
              </div>
            </div>
            
            {/* Price */}
            <div className="text-3xl font-bold mb-4">
              Rs. {product.price.toLocaleString()}
            </div>

            <p className="text-sm font-semibold mb-6">
              Total stock: <span className="text-emerald-500">{product.stock || 100}</span>
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Color: <span className="font-normal">{selectedColor}</span></span>
                  <button className="text-xs text-zinc-500 uppercase font-semibold">Clear</button>
                </div>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[var(--color-brand-primary)] scale-110 shadow-md' : 'border-zinc-200 dark:border-zinc-700 hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <span className="text-sm font-bold block mb-2">Size:</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm transition-all font-semibold ${selectedSize === size ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-l-md">
                  <Minus className="h-4 w-4" />
                </button>
                <div className="px-4 py-3 font-semibold w-12 text-center text-blue-900 dark:text-blue-100">{quantity}</div>
                <button onClick={() => setQuantity(q => Math.min((product.stock || 100), q + 1))} className="px-4 py-3 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-r-md">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <Button onClick={handleAddToCart} variant="outline" className="border-blue-300 text-blue-500 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30 uppercase font-bold tracking-widest px-8">
                Add To Cart
              </Button>
              <Button onClick={() => { handleAddToCart(); router.push('/cart'); }} className="bg-blue-400 hover:bg-blue-500 text-white uppercase font-bold tracking-widest px-8">
                Buy Now
              </Button>
              <Button 
                onClick={() => toggleWishlist(product)} 
                variant="outline" 
                className={`border-zinc-200 dark:border-zinc-800 px-4 ${wishlist.some(w => w.id === product.id) ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'}`}
                title="Save Item"
              >
                <Heart className={`h-5 w-5 ${wishlist.some(w => w.id === product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex"><span className="font-bold w-24">SKU:</span> <span className="text-zinc-500">{product.sku || "N/A"}</span></div>
              <div className="flex"><span className="font-bold w-24">Category:</span> <Link href={`/products?category=${product.category}`} className="text-blue-500 hover:underline">{product.category}</Link></div>
              <div className="flex"><span className="font-bold w-24">Brands:</span> <span className="text-blue-500 cursor-pointer hover:underline">{product.brand || "Generic"}</span></div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-3">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://cycleworks.lk/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-600 transition-colors"><FaFacebook className="h-4 w-4" /></a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + " - https://cycleworks.lk/product/" + product.id)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-green-500 hover:border-green-500 transition-colors"><FaWhatsapp className="h-4 w-4" /></a>
              <a href="https://www.instagram.com/embilipitiyacyclework?igsi=bjRoYXJqeXd3NjBl" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:border-red-500 transition-colors"><FaInstagram className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-b border-zinc-200 dark:border-zinc-800 py-1 mb-16">
          <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <button 
              onClick={() => setActiveTab('description')} 
              className={`py-4 transition-colors ${activeTab === 'description' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('additional')} 
              className={`py-4 transition-colors ${activeTab === 'additional' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              Additional Information
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`py-4 transition-colors ${activeTab === 'reviews' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-20 min-h-[150px]">
          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium">
              <p>{product.description || "No description available for this product."}</p>
            </div>
          )}
          {activeTab === 'additional' && (
            <div className="text-zinc-600 dark:text-zinc-400 font-medium">
              <table className="w-full max-w-md text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100 w-32">Weight</td>
                    <td className="py-3 text-zinc-500">N/A</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100 w-32">Dimensions</td>
                    <td className="py-3 text-zinc-500">N/A</td>
                  </tr>
                  {product.colors && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100 w-32">Colors</td>
                      <td className="py-3 text-zinc-500">Multiple Options Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Reviews List */}
              <div>
                <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
                {productReviews.length === 0 ? (
                  <p className="text-zinc-500 font-medium">There are no reviews yet. Be the first to review "{product.name}".</p>
                ) : (
                  <div className="space-y-6">
                    {productReviews.map(review => (
                      <div key={review.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`h-4 w-4 ${i <= review.rating ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'}`} />
                            ))}
                          </div>
                          <span className="font-bold text-zinc-900 dark:text-white ml-2">{review.author}</span>
                          <span className="text-zinc-400 text-sm ml-auto">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                {reviewSubmitted ? (
                  <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 p-4 rounded-lg font-medium">
                    Thank you! Your review has been submitted and is pending admin approval.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Your Rating *</label>
                      <div className="flex gap-1 text-amber-400 cursor-pointer">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star 
                            key={i} 
                            onClick={() => setReviewRating(i)}
                            className={`h-6 w-6 ${i <= reviewRating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="author" className="block text-sm font-bold mb-2">Name *</label>
                      <input 
                        type="text" 
                        id="author"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-bold mb-2">Your Review *</label>
                      <textarea 
                        id="comment"
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What do you think about this product?"
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                      Submit Review
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-medium tracking-widest uppercase mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link key={rp.id} href={`/product/${rp.id}`} className="group block text-center">
                  <div className="relative aspect-square mb-4 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center p-4">
                    {rp.isNew && (
                      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                        Sale!
                      </div>
                    )}
                    <img 
                      src={rp.imageUrl} 
                      alt={rp.name}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-xs font-bold text-blue-500 mb-1">{rp.brand || "Generic"}</div>
                  <h4 className="font-semibold text-sm mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">{rp.name}</h4>
                  <div className="text-sm font-bold">Rs. {rp.price.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#0ea5e9] text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center gap-2 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span className="font-medium">Added to cart successfully!</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
