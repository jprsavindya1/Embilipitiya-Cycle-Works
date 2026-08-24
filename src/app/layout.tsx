import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ebilipitiya Cycle Works",
  description: "Premium e-commerce platform for bicycles and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
