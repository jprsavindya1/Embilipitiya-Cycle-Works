"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopAnnouncementBar() {
  const pathname = usePathname();
  const [announcementText, setAnnouncementText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide on admin pages
    if (pathname.startsWith('/admin')) {
      setIsVisible(false);
      return;
    }

    // Fetch public settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/public');
        const data = await res.json();
        
        if (data.settings) {
          setAnnouncementText(data.settings.announcement_text || "");
          const enabled = data.settings.announcement_enabled === "true";
          setIsEnabled(enabled);
          setIsVisible(enabled);
        }
      } catch (error) {
        console.error("Failed to fetch announcement settings:", error);
      }
    };
    
    fetchSettings();
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && isEnabled && announcementText && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[var(--color-brand-primary)] text-white w-full overflow-hidden"
        >
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-center relative min-h-[40px]">
            <p className="text-sm font-medium text-center pr-8 sm:pr-0">
              {announcementText}
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 p-1 rounded-full transition-colors focus:outline-none"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
