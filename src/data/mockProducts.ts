export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
};

export const ALL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "CBR Rechargeable 12V Battery Operated Ride On Bike",
    price: 13899,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/cbrToy1.jpg",
    isNew: true,
  },
  {
    id: "p2",
    name: "Audi Electric Drift Go-kart for Kids 24V",
    price: 125000,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/gocart1.jpg",
  },
  {
    id: "p3",
    name: "Children Rechargeable Motorcycle / Bike for Kids TK – 400",
    price: 15000,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/tk400-cover.webp",
  },
  {
    id: "p4",
    name: "KENSTAR GMT BICYCLE 26 Inch",
    price: 35000,
    category: "Bicycles and Accessories",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/kb-red-1.png",
    isNew: true,
  },
  {
    id: "p5",
    name: "Kids BMW S1000RR Super bike Rechargeable Battery Operated Ride on Bike",
    price: 35000,
    category: "Children Items",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/1000rrthumb.jpg",
  },
  {
    id: "p6",
    name: "Kids BMX Bicycle 20″",
    price: 28500,
    category: "Bicycles and Accessories",
    imageUrl: "https://ecw.sprintcodelabs.com/wp-content/uploads/2026/03/Hot-Selling-Early-Rider-Balance-Bike.jpg",
    isNew: true,
  },
  {
    id: "p7",
    name: "Adjustable Dumbbell Set 20KG",
    price: 25000,
    category: "Sport Items",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p8",
    name: "Pro Badminton Racket",
    price: 8500,
    category: "Sport Items",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true,
  }
];

export const FEATURED_PRODUCTS: Product[] = [...ALL_PRODUCTS];

export const COMBINED_PRODUCTS = [...ALL_PRODUCTS];
