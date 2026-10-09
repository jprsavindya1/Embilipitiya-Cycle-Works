import React from 'react';
import { getContactEmail } from '@/lib/settings';

export const metadata = {
  title: 'Delivery Policy - Embilipitiya Cycle Works',
};

export default async function Page() {
  const storeEmail = await getContactEmail();
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Delivery Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white">Delivery Policy</h2>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Cycleworks.lk (Embilipitiya Cycle Works) delivers island-wide across Sri Lanka. We offer in-store pickup (free) and courier delivery (charges apply) for bicycles, accessories, children items, and sports gear.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">DELIVERY OPTIONS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">1. In-Store Pickup (Free – Always Available)</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Available for all products at no cost</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Order online, collect from Embilipitiya Cycle Works showroom</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Pickup ready within 1-2 working days after order confirmation</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Bring order confirmation email and ID for collection</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Available Mon-Sat 8:00 AM – 6:00 PM (Closed Sunday)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Pickup Address:Embilipitiya Cycle WorksEmbilipitiya, Sri LankaPhone/WhatsApp: +94 77 123 4567</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">2. Courier Delivery (Island-Wide)</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Shipping costs calculated per product using WooCommerce Per-Product Shipping. Total cart shipping = sum of all product shipping costs.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">DELIVERY TIMELINES</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Note: Timelines are estimates. Delays due to weather, courier capacity, or public holidays are beyond our control. We notify via email/SMS if delays occur.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">SHIPPING COSTS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Shipping costs vary by product category and delivery location. Costs displayed at checkout before payment.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Estimated Shipping Costs</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Bicycle Delivery (via Prompt Xp):</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Fixed rate: LKR 4,000 per bicycle (island-wide)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Other Products (via Prompt Xp – Weight-Based):</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Example Calculations:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">2 kg package = LKR 500 (first kg) + LKR 140 (second kg) = LKR 640</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">5 kg package = LKR 500 + (4 × LKR 140) = LKR 1,060</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Product Category Estimates:</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Multi-Product Orders: Shipping = sum of individual product costs. Bicycles charged at LKR 4,000 each; other items calculated by total weight.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Free Shipping: Orders over LKR 10,000 receive free delivery to Colombo and Western Province (excludes bicycles – LKR 4,000 delivery charge always applies). Other areas still apply standard shipping.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Courier Partner: Cycleworks.lk uses Prompt Xp for all deliveries.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">PAYMENT METHODS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">We accept the following payment methods at checkout:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Credit/Debit Cards (0% surcharge)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">PayHere (online payment gateway)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">KOKO (10% surcharge applies)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Cash on Delivery (COD) – Pay courier upon delivery</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Payment method surcharges displayed at checkout before finalizing order.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">ORDER PROCESSING</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">TRACKING YOUR ORDER</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">For Courier Deliveries:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Tracking number provided in shipment notification email</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Track via courier’s website/app (courier name specified in email)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Contact us at {storeEmail} or +94 77 123 4567 for tracking assistance</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">For In-Store Pickup:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Email notification when order ready for collection</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Collect within 7 days of ready notification (after 7 days, storage fees may apply)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">DELIVERY INSPECTION</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Inspect your order immediately upon delivery:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Check outer packaging for visible damage before signing</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">If damaged, note on courier receipt and take photos</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Open package within 24 hours and verify contents</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Report missing/defective items within 24 hours to {storeEmail} or +94 77 123 4567</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Failure to report damage/defects within 24 hours may affect return eligibility. See Return & Exchange Policy for details.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">FAILED DELIVERY ATTEMPTS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">If courier cannot deliver (recipient unavailable, incorrect address):</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">1st Attempt: Courier contacts you to reschedule</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">2nd Attempt: Made within 1-2 days of first attempt</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">3rd Attempt: Final attempt; if failed, order returned to Embilipitiya showroom</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Returned Orders: Reshipping requires new shipping fee payment. Refunds processed minus original shipping cost (allow 7-14 working days).</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">SPECIAL HANDLING</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Large/Heavy Items (bicycles, rechargeable jeeps, go-karts, gym equipment):</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">May require curbside delivery (courier delivers to building entrance, not inside home)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Assembly/installation not included unless specified at time of purchase</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Inspect immediately; report damage within 24 hours</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Fragile Items (baby swings, TOLO cars):</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Extra protective packaging used</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Handle with care upon receipt</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Check for damage before courier leaves</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">UNDELIVERABLE ADDRESSES</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">We deliver to residential and commercial addresses across Sri Lanka. However:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">PO Box addresses: Not accepted for courier delivery (in-store pickup only)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Incomplete addresses: Orders held until complete address provided</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Remote areas: Delivery possible but may incur extra fees; we contact you for confirmation</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Ensure delivery address is complete with landmarks, contact number, and alternative contact.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">ORDER CANCELLATIONS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Before Shipment: Cancel anytime at no cost via {storeEmail} or +94 77 123 4567</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">After Shipment: Cannot cancel; refuse delivery and follow Return & Exchange Policy</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Refunds: Processed within 3-7 working days (payment processing fees non-refundable for KOKO/cards)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">CONTACT FOR DELIVERY ISSUES</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">For delivery delays, tracking problems, or address changes:</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Cycleworks.lkEmbilipitiya Cycle WorksEmbilipitiya, Sri Lanka</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Phone: +94 77 123 4567WhatsApp: +94 77 123 4567 (Click to chat – fastest response)Email: {storeEmail}</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Business Hours:Monday – Saturday: 8:00 AM – 6:00 PMSunday: Closed</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">We are committed to ensuring timely, safe delivery of your Cycleworks.lk orders. Contact us immediately if you experience any delivery issues.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Disclaimer: This policy was generated using an online tool and does not constitute formal legal advice.</p>
      </div>
    </div>
  );
}
