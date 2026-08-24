"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        // Success! Cookie is set by the backend
        router.push("/admin/orders"); // Direct to orders since that's what they wanted
      } else {
        const data = await res.json();
        alert(data.message || "Invalid credentials. Try admin@ecw.com / admin123");
      }
    } catch (error) {
      alert("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.jpeg" alt="ECW Logo" className="h-16 w-auto mx-auto mb-6 dark:invert rounded-full border border-zinc-200 dark:border-zinc-800" />
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-zinc-500 mt-2">Sign in to manage Ebilipitiya Cycle Works</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-zinc-200/60 dark:border-zinc-800">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="admin@ecw.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Password</label>
                <a href="#" className="text-xs text-[var(--color-brand-primary)] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl font-bold mt-4 h-12" disabled={isLoading}>
              {isLoading ? "Signing in..." : (
                <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
