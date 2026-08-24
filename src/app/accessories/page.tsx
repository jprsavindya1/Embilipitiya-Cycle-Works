"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

const ACCESSORIES = [
  {
    id: "a1",
    name: "Giro Synthe MIPS Helmet",
    price: 45000,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true,
  },
  {
    id: "a2",
    name: "Kryptonite U-Lock",
    price: 15000,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1596704176219-940cb65ebaf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "a3",
    name: "Lezyne Macro Drive 1300XXL",
    price: 25000,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1572979204040-c6511a0b3b44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "a4",
    name: "CamelBak Podium Water Bottle",
    price: 3500,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1601758124277-22f25b425553?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  }
];

export default function AccessoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Accessories</h1>
        <p className="text-zinc-500 mb-8 max-w-2xl">
          Upgrade your ride with our premium selection of cycling accessories, from high-performance helmets to essential safety gear.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ACCESSORIES.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
