import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Bike, ShieldCheck, Clock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-zinc-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ebilipitiya Cycle Works</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Serving the community with premium bicycles, expert repairs, and unparalleled service since our founding.
          </p>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                What started as a small repair shop has grown into the region's premier destination for cycling enthusiasts and beginners alike. We believe that cycling is more than just a mode of transport; it's a lifestyle, a sport, and a path to better health.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Today, Ebilipitiya Cycle Works offers over 200+ products, including top-tier mountain bikes, road bikes, gym equipment, and kids' toys. Our commitment to quality and customer satisfaction remains our top priority.
              </p>
            </div>
            <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Bicycle Shop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Core Values */}
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <Bike className="h-10 w-10 text-[var(--color-brand-primary)] mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Premium Gear</h3>
              <p className="text-zinc-500 text-sm">Authorized dealer for the world's most trusted cycling brands.</p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <ShieldCheck className="h-10 w-10 text-[var(--color-brand-primary)] mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Quality Guarantee</h3>
              <p className="text-zinc-500 text-sm">Full warranty support and after-sales service on all purchases.</p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <Users className="h-10 w-10 text-[var(--color-brand-primary)] mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Expert Team</h3>
              <p className="text-zinc-500 text-sm">Passionate cyclists and professional mechanics at your service.</p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <Clock className="h-10 w-10 text-[var(--color-brand-primary)] mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Fast Service</h3>
              <p className="text-zinc-500 text-sm">Quick turnaround times on repairs and island-wide delivery.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
