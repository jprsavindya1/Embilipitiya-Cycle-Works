"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Button } from "@/components/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [storeEmail, setStoreEmail] = useState("embilipitiyacycleworks911@gmail.com");

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.contact_email) {
          setStoreEmail(data.settings.contact_email);
        }
      })
      .catch(console.error);
  }, []);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-zinc-500">
            Have a question about a product, need repair services, or just want to say hi? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium border border-green-200 dark:border-green-800">
                  Your message has been sent successfully. We will get back to you soon!
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <input required type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <input required type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input required type="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea required id="message" value={formData.message} onChange={handleChange} rows={5} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all resize-none"></textarea>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 lg:pl-8 flex flex-col justify-center">
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Store</h3>
                <p className="text-zinc-500">Main Street<br/>Embilipitiya, Sri Lanka</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Phone & WhatsApp</h3>
                <a 
                  href="https://wa.me/94771234567" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-500 hover:text-[var(--color-brand-primary)] transition-colors"
                >
                  +94 77 123 4567
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-zinc-500">{storeEmail}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                <p className="text-zinc-500">Mon - Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
