import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
  description?: string;
  sku?: string;
  brand?: string;
  stock?: number;
  colors?: string[]; // Array of hex codes
  sizes?: string[]; // Array of size strings
  rating?: number;
  gallery?: string[]; // Array of additional image URLs
}

interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  approved: boolean;
}

interface StoreState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  
  // Auth Actions
  setUser: (user: User | null) => void;
  logout: () => void;

  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist Actions
  toggleWishlist: (product: Product) => void;

  // Review Actions
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'approved'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Audi Electric Drift Go-kart for Kids 24V",
    price: 125000,
    category: "Go-Kart",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/gocart1.jpg",
    description: "Looking for the ultimate toy for your little one? The Audi Electric Go-Kart, equipped with a powerful 24V battery, is every child’s dream who loves speed and adventure. Designed for kids aged 4 to 12 , this stylish go-kart is packed with exciting features that are sure to get their hearts racing.",
    sku: "ECW-GOKART-01",
    brand: "Audi",
    stock: 12,
    rating: 5,
    colors: ["#ff0000", "#000000", "#ffffff"],
    isNew: true
  },
  {
    id: "p2",
    name: "CBR Rechargeable 12V Battery Operated Ride On Bike",
    price: 13899,
    category: "Rechargeable Jeeps and Bikes",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/cbrToy1.jpg",
    description: "Honda CBR Rechargeable 12V Battery Operated Ride On Bike for Kids with Hand Accelerator 2 to 7 Years (Red). In The Box: 1 Bike, 1 Charger, 1 Manual.",
    sku: "ECW-CBR-001",
    brand: "CBR",
    stock: 25,
    rating: 4.5,
    colors: ["#ff0000"]
  },
  {
    id: "p3",
    name: "Children Rechargeable Motorcycle / Bike for Kids TK – 400",
    price: 15000,
    category: "Rechargeable Jeeps and Bikes",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/tk400-cover.webp",
    description: "Let Your Child Ride In Style With This Rechargeable Electric Motorcycle For Kids. Designed With Fun And Safety In Mind, This Stylish Bike Features A Simple One-Button Start, Engaging English Story Mode, USB And MP3 Music Options, And A Bright LED Headlamp For Safe Evening Rides.",
    sku: "TK-400",
    brand: "Generic",
    stock: 45,
    rating: 4,
    colors: ["#0000ff", "#ff0000", "#ffffff"]
  },
  {
    id: "p4",
    name: "KENSTAR GMT BICYCLE 26 Inch",
    price: 35000,
    category: "Bicycle",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/kb-red-1.png",
    description: "Type: Mountain Gear Bicycles. Wheel Size: 26″ x 2.125″. Frame / Cross Bar And Fork Build: Steel Sus. Frame/ Sus.Fork. Handle Bar / Stem: Steel Swallow MTB Bar. Rims/Wheels Build: Alloy.",
    sku: "KEN-GMT-26",
    brand: "Lumala",
    stock: 5,
    rating: 5,
    colors: ["#ff0000", "#000000", "#0000ff"],
    sizes: ["26\""]
  },
  {
    id: "p5",
    name: "Kids BMW S1000RR Super bike",
    price: 35000,
    category: "Rechargeable Jeeps and Bikes",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/1000rrthumb.jpg",
    description: "BMW S1000RR Superbike Rechargeable Battery Operated Ride on Bike for Kids, Hand Accelerator(3 to 8 years) Metallic Red. In The Box: 1 Bike, 1 Charger, 1 Manual.",
    sku: "BMW-S1000RR",
    brand: "BMW",
    stock: 8,
    rating: 5,
    colors: ["#ff0000", "#0000ff"]
  },
  {
    id: "p6",
    name: "Kids BMX Bicycle 20″",
    price: 28500,
    category: "Bicycle",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/Hot-Selling-Early-Rider-Balance-Bike.jpg",
    description: "This 20-inch BMX bicycle is designed for young riders who want a fun and durable bike. It features a strong steel frame, comfortable seat, and easy handling for everyday riding. Perfect for kids learning tricks or riding around the neighborhood.",
    sku: "BMX-20-KIDS",
    brand: "BMX",
    stock: 153,
    rating: 4.8,
    colors: ["#0000ff", "#00ff00", "#ff0000"],
    sizes: ["16\"", "20\"", "24\"", "26\""],
    isNew: true
  },
  {
    id: "p7",
    name: "Lumala Supernova Front Suspension Dual Disk",
    price: 15000,
    category: "Bicycle",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/lumala.jpg",
    description: "18″ Steel Suspension (Cold Rolled Carbon) • 21 speed gear system • 30mm Aluminium Rims • DSI branded tyer / tubes • Alloy brake lever • Oversized Handle bar & stem • Disc brakes alloy",
    sku: "LUM-SUP-01",
    brand: "Lumala",
    stock: 22,
    rating: 4,
    colors: ["#000000", "#ffff00"]
  },
  {
    id: "p8",
    name: "Mikasa Volleyball Gold Cup",
    price: 2500,
    category: "Volleyball",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/mikasa3.webp",
    description: "Enjoy playing volleyball with the Mikasa MV210 Premium Synthetic Volleyball. Perfect for beginners, this official size ball is designed for fun and practice.",
    sku: "MIK-VB-01",
    brand: "Mikasa",
    stock: 150,
    rating: 4.5,
    colors: ["#ffff00", "#0000ff"]
  },
  {
    id: "p9",
    name: "QUANTUM T120 TREADMILL",
    price: 120000,
    category: "Gym Equipment",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/gym1.webp",
    description: "Experience the perfect blend of performance and convenience with the Quantum T120 treadmill, featuring 25 intelligent workout programs and speeds up to 16 km/h to match your fitness goals.",
    sku: "Q-T120",
    brand: "Quantum Fitness",
    stock: 4,
    rating: 5,
    colors: ["#000000"]
  },
  {
    id: "p10",
    name: "R1 Battery Operated Ride On Bike For Kids",
    price: 75000,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/r1thum.jpeg",
    description: "Mini R1 Battery Operated Ride On Bike For Kids. PACKAGE CONTENTS: Sports ride on bike, Charger, Assembly Manual Instruction. AGE LIMIT: Suitable for Kids of age Upto 1 to 4 Years.",
    sku: "CBR-R1-MINI",
    brand: "CBR",
    stock: 14,
    rating: 4,
    colors: ["#ff0000", "#000000"]
  },
  {
    id: "p11",
    name: "Rechargeable 400 RS Bike for Kids",
    price: 17000,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/yelow-rs.jpg",
    description: "Perfect for kids aged 2-7 years. Rechargeable Bike 400 RS with a powerful 6V rechargeable battery. Single motor design for safe and fun rides. Max load capacity of 35 Kg, ensuring durability and stability.",
    sku: "RS-400",
    brand: "Generic",
    stock: 35,
    rating: 4.5,
    colors: ["#ffff00"]
  },
  {
    id: "p12",
    name: "SF Blade Patriot Original English Willow",
    price: 125000,
    category: "Sport Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/sf-blade-patriot-ew-bat.jpg",
    description: "SF Blade Patriot Original English Willow (Full). Step up your cricket game with the SF Blade Patriot Original English Willow Bat, crafted for players who demand power, precision, and performance.",
    sku: "SF-PATRIOT-EW",
    brand: "SF",
    stock: 6,
    rating: 5
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      products: INITIAL_PRODUCTS,
      cart: [],
      wishlist: [],
      reviews: [],

      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      addProduct: (product) => set((state) => ({
        products: [...state.products, product]
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id),
        cart: state.cart.filter(c => c.id !== id),
        wishlist: state.wishlist.filter(w => w.id !== id)
      })),

      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) => set((state) => {
        const exists = state.wishlist.some((item) => item.id === product.id);
        if (exists) {
          return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
        }
        return { wishlist: [...state.wishlist, product] };
      }),

      addReview: (review) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            ...review,
            id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString(),
            approved: false
          }
        ]
      })),

      approveReview: (id) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, approved: true } : r)
      })),

      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ecw-storage-v2',
    }
  )
);
