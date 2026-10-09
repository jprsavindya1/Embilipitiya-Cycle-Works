"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// The variants define the different states of the animation
const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // We don't want page transitions in the admin area as it can be distracting for heavy operational tasks
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex-grow flex flex-col min-h-screen"
    >
      {children}
    </motion.main>
  );
}
