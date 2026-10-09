"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const pathname = usePathname();
  
  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Using the real number from env or fallback
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94771234567";
  const message = encodeURIComponent("Hello! I am interested in your products.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        {/* Ping Animation Layer */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        
        {/* Actual Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-110 focus:outline-none"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-8 w-8" style={{ fill: "white" }} />
        </a>
      </motion.div>
    </div>
  );
}
