import React from 'react';
import { getContactEmail } from '@/lib/settings';

export const metadata = {
  title: 'Return and Exchange Policy - Embilipitiya Cycle Works',
};

export default async function Page() {
  const storeEmail = await getContactEmail();
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Return and Exchange Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white">Return and Exchange Policy</h2>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">At Cycleworks.lk (Embilipitiya Cycle Works), customer satisfaction is our priority. This Return & Exchange Policy outlines the conditions under which products purchased from cycleworks.lk may be returned or exchanged.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">RETURN ELIGIBILITY</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Returns and exchanges are accepted within 7 days from the date of delivery for the following reasons only:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Defective Products: Manufacturing defects that prevent normal use (e.g., bicycle brakes not functioning, rechargeable jeep won’t charge due to factory defect)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Damaged Products: Items damaged during shipping (damage must be reported within 24 hours of delivery)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Incorrect Products: Wrong item, size, color, or model delivered</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Missing Items: Incomplete order or missing accessories</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Important: Returns for change of mind, buyer’s remorse, or incorrect size selection are not accepted.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">PRODUCT CATEGORIES & CONDITIONS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Bicycles and Bicycle Accessories</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Must be unused, unassembled (if delivered unassembled), and in original packaging</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">All original tags, manuals, warranty cards, and accessories must be included</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Test rides or assembly voids return eligibility (exchanges for defects only)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">A restocking fee of 10% may apply if bicycle shows signs of use or minor damage</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Children Items (Rechargeable Jeeps, Tricycles, Go-Karts, Baby Walkers, Push Scooters, TOLO Cars, Baby Swings)</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Must be in original, unopened packaging with all manufacturer seals intact</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Once assembled or used, returns not accepted (exchanges for manufacturing defects only)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Batteries must not have been charged or installed</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Sport Items (Cricket, Carom, Volleyball, Badminton, Gym Equipment)</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Must be unused, unworn, and in original packaging</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Protective seals and tags must remain intact</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">No returns on opened or used sports equipment (hygiene and safety reasons)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">NON-RETURNABLE ITEMS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">The following items cannot be returned or exchanged under any circumstances:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Products purchased during clearance or final sale promotions</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Custom-ordered or personalized items</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Products with removed serial numbers or tampered warranty seals</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Items damaged due to misuse, negligence, or improper storage</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Helmets, protective gear, or hygiene-related products once opened</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">RETURN PROCESS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">To initiate a return or exchange, follow these steps:</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">EXCHANGES</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Exchanges are available for defective or incorrect products subject to stock availability:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Same Product Exchange: If the same model/size/color is available, we will exchange one-to-one at no cost</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Alternative Product: If original item is out of stock, you may select an alternative of equal or greater value (price difference applies for higher-priced items)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Size/Color Changes: Available only if product is unused and in original packaging (subject to 7-day return window)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Exchange requests must be submitted within 7 days of delivery. Shipping costs for exchanges are borne by the customer unless the error was on our part[web:36].</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">REFUNDS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Refunds are issued only when:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">The product is defective or damaged, and a replacement is not available</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">An incorrect product was delivered, and the correct item is out of stock</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">The order was cancelled before shipment</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Refund Processing Times</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Table 1: Refund processing times by payment method</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Note: Original delivery charges are non-refundable unless we shipped an incorrect or defective product. Payment gateway processing fees (e.g., KOKO 10% surcharge) are non-refundable.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">WARRANTY & MANUFACTURER DEFECTS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Products with manufacturer warranties (bicycles, rechargeable vehicles, gym equipment) are covered under the respective brand’s warranty terms:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Manufacturing defects reported within 7 days are handled via return/exchange</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Defects reported after 7 days are referred to the manufacturer’s warranty service</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Warranty claims require original invoice, warranty card, and product serial number</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Contact us at {storeEmail} for warranty claim assistance</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">DAMAGED OR MISSING ITEMS ON DELIVERY</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Inspect your order immediately upon delivery:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Damaged Packaging: If the outer box is visibly damaged, note this with the courier and contact us within 24 hours with photos</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Missing Items: Report missing products or accessories within 24 hours via email or WhatsApp-we will arrange delivery of missing items at no cost</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Defective on Arrival: If a product is defective when unboxed, report within 24 hours for priority replacement</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Failure to report damage or defects within 24 hours may affect your eligibility for free return shipping.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">CANCELLATIONS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Before Shipment: Orders can be cancelled at no cost. Contact us immediately at {storeEmail} or +94 77 123 4567</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">After Shipment: Cancellations are not accepted once the order is dispatched. You may refuse delivery and follow the return process</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Refunds for Cancellations: Processed within 3-7 working days to the original payment method (payment processing fees are non-refundable for KOKO/card payments)</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">RETURN SHIPPING COSTS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Table 2: Return shipping cost responsibility</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">CUSTOMER RESPONSIBILITIES</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">To ensure smooth return/exchange processing:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Keep all original packaging, tags, manuals, and accessories until you are satisfied with your purchase</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Inspect products immediately upon delivery and report issues within 24 hours</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Provide clear photos and accurate descriptions when submitting return requests</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Ship returns using a traceable courier method (recommended) and retain tracking information</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Do not use, assemble, or alter products if you intend to return them</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">POLICY UPDATES & EXCEPTIONS</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">We reserve the right to modify this Return & Exchange Policy at any time. Changes will be posted on this page with an updated “Last Updated” date. Material changes will be communicated via email to registered customers.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">In exceptional circumstances, management may approve returns or exchanges outside the stated policy at its sole discretion. Such decisions are made on a case-by-case basis and do not set precedent for future claims.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">CONTACT INFORMATION</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">For return/exchange requests, questions, or assistance:</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Cycleworks.lkEmbilipitiya Cycle WorksEmbilipitiya, Sri Lanka</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Phone: +94 77 123 4567WhatsApp: +94 77 123 4567 (Click to chat)Email: {storeEmail}Website: www.cycleworks.lk</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Business Hours:Monday – Saturday: 8:00 AM – 6:00 PMSunday: Closed</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">We are committed to resolving all return and exchange requests promptly and professionally. Your satisfaction is our priority</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Disclaimer: This policy was generated using an online tool and does not constitute formal legal advice.</p>
      </div>
    </div>
  );
}
