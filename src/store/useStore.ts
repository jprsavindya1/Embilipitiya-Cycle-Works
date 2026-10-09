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
  isPublished?: boolean; // Default to true if undefined
  createdAt?: string;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'staff';
  status: 'active' | 'suspended';
}

export interface InviteToken {
  token: string;
  role: 'super_admin' | 'staff';
  used: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
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

  // Category Actions
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Admin & Staff Actions
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  activityLogs: ActivityLog[];
  inviteTokens: InviteToken[];
  
  loginAdmin: (user: AdminUser) => void;
  logoutAdmin: () => void;
  generateInvite: (role: 'super_admin' | 'staff') => Promise<string>;
  validateAndUseInvite: (token: string, newAdminData: Omit<AdminUser, 'id' | 'status' | 'role'>) => Promise<boolean>;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'status'>) => void;
  updateAdmin: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdmin: (id: string) => void;
  approveAdmin: (id: string) => void;
  suspendAdmin: (id: string) => void;
  activateAdmin: (id: string) => void;
  
  logActivity: (action: string, target: string, details?: string) => void;
  syncWithDB: () => Promise<void>;
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
      admins: [
        { id: "admin_1", name: "Super Admin", email: "admin@ecw.lk", password: "admin", role: "super_admin", status: "active" },
        { id: "admin_2", name: "Staff Member", email: "staff@ecw.lk", password: "staff", role: "staff", status: "active" }
      ],
      currentAdmin: null,
      activityLogs: [],
      inviteTokens: [],
      categories: [],

      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Internal helper to log activity
      logActivity: async (action: string, target: string, details?: string) => {
        const { currentAdmin, activityLogs } = get();
        if (!currentAdmin) return;
        
        const newLog: ActivityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          adminId: currentAdmin.id,
          adminName: currentAdmin.name,
          action,
          target,
          details,
          timestamp: new Date().toISOString()
        };
        
        set({ activityLogs: [newLog, ...activityLogs].slice(0, 500) });
        
        try {
          await fetch('/api/activity', { method: 'POST', body: JSON.stringify(newLog) });
        } catch (error) { console.error("Error saving log to DB", error); }
      },

      loginAdmin: (admin) => {
        set({ currentAdmin: admin });
        get().logActivity('User Login', admin.email, 'Logged into the system');
      },
      
      logoutAdmin: () => set({ currentAdmin: null }),
      
      generateInvite: async (role) => {
        const token = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newInvite: InviteToken = { token, role, used: false, createdAt: new Date().toISOString() };
        try {
          const res = await fetch('/api/invites', { method: 'POST', body: JSON.stringify(newInvite) });
          if (!res.ok) {
            console.error("Failed to save invite to DB");
            return '';
          }
          set((state) => ({
            inviteTokens: [...state.inviteTokens, newInvite]
          }));
        } catch (error) { 
          console.error("Error saving invite to DB", error); 
          return '';
        }
        
        get().logActivity('Generated Invite Link', `For Role: ${role}`);
        return token;
      },

      validateAndUseInvite: async (token, newAdminData) => {
        try {
          const res = await fetch('/api/admin/invite/accept', { 
            method: 'POST', 
            body: JSON.stringify({ token, ...newAdminData }) 
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Failed to accept invite:", data.message);
            return false;
          }

          const { admin } = await res.json();
          const { admins, inviteTokens } = get();

          set({
            admins: [...admins, admin],
            inviteTokens: inviteTokens.map(i => i.token === token ? { ...i, used: true } : i)
          });
          
          return true;
        } catch (error) { 
          console.error("Error saving invite use to DB", error); 
          return false;
        }
      },

      addAdmin: async (admin) => {
        const newAdmin: AdminUser = { ...admin, id: `admin_${Date.now()}`, status: 'active' };
        set((state) => ({ admins: [...state.admins, newAdmin] }));
        
        try {
          await fetch('/api/admins', { method: 'POST', body: JSON.stringify(newAdmin) });
        } catch (error) { console.error("Error saving admin to DB", error); }
        
        get().logActivity('Added New Staff', admin.name);
      },
      
      updateAdmin: async (id, updates) => {
        const oldAdmin = get().admins.find(a => a.id === id);
        set((state) => ({
          admins: state.admins.map(a => a.id === id ? { ...a, ...updates } : a),
          currentAdmin: state.currentAdmin?.id === id ? { ...state.currentAdmin, ...updates } : state.currentAdmin
        }));

        try {
          await fetch('/api/admins', { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
        } catch (error) { console.error("Error updating admin in DB", error); }

        if (oldAdmin) {
          const changes: string[] = [];
          if (updates.role && updates.role !== oldAdmin.role) changes.push(`Role changed to ${updates.role}`);
          if (updates.status && updates.status !== oldAdmin.status) changes.push(`Status changed to ${updates.status}`);
          if (updates.name && updates.name !== oldAdmin.name) changes.push(`Name changed to ${updates.name}`);
          
          if (changes.length > 0) {
            get().logActivity('Updated Staff Profile', oldAdmin.name, changes.join(' | '));
          }
        }
      },
      
      deleteAdmin: async (id) => {
        const aName = get().admins.find(a => a.id === id)?.name || id;
        set((state) => ({
          admins: state.admins.filter(a => a.id !== id)
        }));
        
        try {
          await fetch('/api/admins', { method: 'DELETE', body: JSON.stringify({ id }) });
        } catch (error) { console.error("Error deleting admin from DB", error); }
        
        get().logActivity('Deleted Staff Account', aName);
      },

      approveAdmin: async (id) => {
        const aName = get().admins.find(a => a.id === id)?.name || id;
        set((state) => ({
          admins: state.admins.map(a => a.id === id ? { ...a, status: 'active' } : a)
        }));
        
        try {
          await fetch('/api/admins', { method: 'PUT', body: JSON.stringify({ id, status: 'active' }) });
        } catch (error) { console.error("Error approving admin in DB", error); }
        
        get().logActivity('Activated Staff Account', aName);
      },

      suspendAdmin: async (id) => {
        const aName = get().admins.find(a => a.id === id)?.name || id;
        set((state) => ({
          admins: state.admins.map(a => a.id === id ? { ...a, status: 'suspended' } : a)
        }));
        
        try {
          await fetch('/api/admins', { method: 'PUT', body: JSON.stringify({ id, status: 'suspended' }) });
        } catch (error) { console.error("Error suspending admin in DB", error); }
        
        get().logActivity('Suspended Staff Account', aName);
      },

      activateAdmin: async (id) => {
        const aName = get().admins.find(a => a.id === id)?.name || id;
        set((state) => ({
          admins: state.admins.map(a => a.id === id ? { ...a, status: 'active' } : a)
        }));
        
        try {
          await fetch('/api/admins', { method: 'PUT', body: JSON.stringify({ id, status: 'active' }) });
        } catch (error) { console.error("Error activating admin in DB", error); }
        
        get().logActivity('Reactivated Staff Account', aName);
      },

      syncWithDB: async () => {
        try {
          const [productsRes, adminsRes, activityLogsRes, invitesRes, categoriesRes, reviewsRes] = await Promise.all([
            fetch('/api/products').catch(() => null),
            fetch('/api/admins').catch(() => null),
            fetch('/api/activity').catch(() => null),
            fetch('/api/invites').catch(() => null),
            fetch('/api/categories').catch(() => null),
            fetch('/api/reviews').catch(() => null)
          ]);
          
          const products = productsRes && productsRes.ok ? await productsRes.json() : get().products;
          const admins = adminsRes && adminsRes.ok ? await adminsRes.json() : get().admins;
          const activityLogs = activityLogsRes && activityLogsRes.ok ? await activityLogsRes.json() : get().activityLogs;
          const inviteTokens = invitesRes && invitesRes.ok ? await invitesRes.json() : get().inviteTokens;
          const categories = categoriesRes && categoriesRes.ok ? await categoriesRes.json() : get().categories;
          const fetchedReviews = reviewsRes && reviewsRes.ok ? await reviewsRes.json() : []; // only load approved ones from API for public
          
          set({ products, admins, activityLogs, inviteTokens, categories, reviews: fetchedReviews });
        } catch (error) {
          console.error("Failed to sync with DB", error);
        }
      },

      addCategory: async (category) => {
        set((state) => ({ categories: [...state.categories, category] }));
        try {
          await fetch('/api/categories', { method: 'POST', body: JSON.stringify(category) });
        } catch (error) { console.error("Error saving category to DB", error); }
        get().logActivity('Created Category', category.name);
      },

      updateCategory: async (id, updates) => {
        const oldCat = get().categories.find(c => c.id === id);
        const cName = oldCat?.name || id;
        
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        
        try {
          await fetch('/api/categories', { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
        } catch (error) { console.error("Error updating category in DB", error); }
        
        get().logActivity('Updated Category', cName);
      },

      deleteCategory: async (id) => {
        const cName = get().categories.find(c => c.id === id)?.name || id;
        set((state) => ({
          categories: state.categories.filter(c => c.id !== id)
        }));
        
        try {
          await fetch('/api/categories', { method: 'DELETE', body: JSON.stringify({ id }) });
        } catch (error) { console.error("Error deleting category from DB", error); }
        
        get().logActivity('Deleted Category', cName);
      },

      addProduct: async (product) => {
        set((state) => ({ products: [...state.products, product] }));
        try {
          await fetch('/api/products', { method: 'POST', body: JSON.stringify(product) });
        } catch (error) { console.error("Error saving product to DB", error); }
        get().logActivity('Created Product', product.name);
      },

      updateProduct: async (id, updates) => {
        const oldProduct = get().products.find(p => p.id === id);
        const pName = oldProduct?.name || id;
        
        let details = '';
        if (oldProduct) {
          const changes: string[] = [];
          if (updates.price && updates.price !== oldProduct.price) {
            changes.push(`Price changed from Rs. ${oldProduct.price.toLocaleString()} to Rs. ${updates.price.toLocaleString()}`);
          }
          if (updates.stock !== undefined && updates.stock !== oldProduct.stock) {
            changes.push(`Stock changed from ${oldProduct.stock} to ${updates.stock}`);
          }
          if (updates.name && updates.name !== oldProduct.name) {
            changes.push(`Name changed to "${updates.name}"`);
          }
          if (updates.category && updates.category !== oldProduct.category) {
            changes.push(`Category changed to "${updates.category}"`);
          }
          if (updates.brand && updates.brand !== oldProduct.brand) {
            changes.push(`Brand changed to "${updates.brand}"`);
          }
          
          if (changes.length > 0) {
            details = changes.join(' | ');
          } else {
            details = 'Updated minor details (e.g. description or image)';
          }
        }

        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
        
        try {
          await fetch('/api/products', { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
        } catch (error) { console.error("Error updating product in DB", error); }
        
        get().logActivity('Updated Product', pName, details);
      },

      deleteProduct: async (id) => {
        const pName = get().products.find(p => p.id === id)?.name || id;
        set((state) => ({
          products: state.products.filter(p => p.id !== id),
          cart: state.cart.filter(c => c.id !== id),
          wishlist: state.wishlist.filter(w => w.id !== id)
        }));
        
        try {
          await fetch('/api/products', { method: 'DELETE', body: JSON.stringify({ id }) });
        } catch (error) { console.error("Error deleting product from DB", error); }
        
        get().logActivity('Deleted Product', pName);
      },

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

      addReview: async (review) => {
        try {
          const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(review) });
          if (res.ok) {
            const data = await res.json();
            set((state) => ({
              reviews: [...state.reviews, data.review]
            }));
          }
        } catch (error) {
          console.error("Error saving review to DB", error);
        }
      },

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
