const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Audi Electric Drift Go-kart for Kids 24V",
    price: 125000,
    category: "Children Items",
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
    category: "Children Items",
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
    category: "Children Items",
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
    category: "Bicycle and Accessories",
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
    category: "Children Items",
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
    category: "Bicycle and Accessories",
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
    category: "Bicycle and Accessories",
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
    category: "Sport Items",
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
    category: "Sport Items",
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

async function seedProducts() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecw_db'
  });

  for (const product of INITIAL_PRODUCTS) {
    try {
      await db.query(`
        INSERT INTO products (id, name, price, category, imageUrl, description, sku, brand, stock, rating, colors, sizes, isNew, gallery)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name)
      `, [
        product.id,
        product.name,
        product.price,
        product.category,
        product.imageUrl,
        product.description,
        product.sku,
        product.brand,
        product.stock,
        product.rating,
        JSON.stringify(product.colors || []),
        JSON.stringify(product.sizes || []),
        product.isNew ? 1 : 0,
        JSON.stringify(product.gallery || [])
      ]);
      console.log('Inserted', product.name);
    } catch (error) {
      console.error('Error inserting', product.name, error);
    }
  }

  await db.end();
  console.log('Done!');
}

seedProducts();
