import React from 'react';
import { getContactEmail } from '@/lib/settings';

export const metadata = {
  title: 'Terms and Conditions - Embilipitiya Cycle Works',
};

export default async function Page() {
  const storeEmail = await getContactEmail();
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Terms and Conditions</h1>
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white">Terms and Conditions</h2>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">This website is operated by Cycleworks.lk (Embilipitiya Cycle Works). Throughout the site, the terms “we”, “us” and “our” refer to Embilipitiya Cycle Works. Cycleworks.lk offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions.</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">1. ONLINE STORE TERMS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">By agreeing to these Terms and Conditions, you represent that you are at least the age of majority in your province of residence, or that you are the age of majority and have given us your consent to allow any of your minor dependents to use this site.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">You may not use our products for any illegal or unauthorized purpose.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">You undertake to treat your personal access data confidentially and not make it available to unauthorized third parties. We cannot assume any liability for misuse of passwords unless this misuse is our fault.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">2. PRODUCTS AND INVENTORY</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Our product catalog includes bicycles, bicycle accessories, children’s items (such as rechargeable jeeps, tricycles, and baby swings), and sports equipment.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Products may be available in different variations, including size, color, model, and battery capacity.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Stock Limitations: Stock availability is managed manually. While we strive for accuracy, if an item is out of stock, it will be displayed clearly as “Out of stock” and will not be purchasable (the “Add to cart” button will be disabled).</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">3. PRICING AND PAYMENT</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Currency: All prices are listed in Sri Lankan Rupees (LKR).</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Taxes: All prices listed on the website exclude tax and VAT.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Accepted Payment Methods: We accept Credit and Debit cards, PayHere, KOKO, and Cash on Delivery (COD). Bank transfers are explicitly excluded as a payment method.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Payment Surcharges: Additional fees apply based on your selected payment method. These are applied after the product and shipping totals are calculated.

Credit/Debit Cards: 0% surcharge.



KOKO: 10% surcharge applies.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Credit/Debit Cards: 0% surcharge.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">KOKO: 10% surcharge applies.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Surcharges and payment gateway processing fees are non-refundable.</li>
</ul>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Credit/Debit Cards: 0% surcharge.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">KOKO: 10% surcharge applies.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">4. SHIPPING AND DELIVERY</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">We offer island-wide courier delivery via Prompt Xp and free in-store pickup at our Embilipitiya showroom.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Shipping Costs: Shipping is calculated on a per-product basis. The total shipping cost for multi-product carts is the sum of all individual product shipping costs. Bicycles have a fixed delivery rate of LKR 4,000.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Orders over LKR 10,000 receive free delivery to Colombo and the Western Province, however, this excludes bicycles (the LKR 4,000 delivery charge will always apply to bicycles).</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">For complete details on delivery timelines and tracking, please review our Delivery Policy.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">5. RETURNS, EXCHANGES, AND REFUNDS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Returns and exchanges are strictly governed by our Return & Exchange Policy.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">We accept returns within 7 days of delivery only for defective, damaged, incorrect, or missing items.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">We do not accept returns for a change of mind, buyer’s remorse, or incorrect size selection.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Products must be returned unused, unassembled, and in their original packaging. Test riding a bicycle or assembling a children’s item voids return eligibility.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Approved refunds are processed based on your original payment method; original delivery charges and payment surcharges (e.g., KOKO) are non-refundable unless we shipped an incorrect or defective product.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">6. COUPONS AND PROMOTIONS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">We may offer promotional coupons providing flat amount or percentage discounts.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Coupons are not stackable (cannot be used together in a single transaction).</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Usage limits apply based on total uses, though a single customer may use the same coupon multiple times if permitted by the specific coupon terms.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">7. ORDER CANCELLATIONS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Before Shipment: Orders can be canceled at no cost before they are dispatched.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">After Shipment: Cancellations are not accepted once the order has been dispatched. You must refuse delivery and follow the standard return process.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">8. CHANGES TO TERMS AND CONDITIONS</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">We reserve the right to update, change, or replace any part of these Terms and Conditions by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Note: These Terms and Conditions have been generated for standard operational use. Customers are advised that this does not constitute formal legal advice.</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">9. CONTACT INFORMATION</p>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Questions about the Terms and Conditions should be sent to us at:</p>
<ul className="list-disc pl-6 mb-4">
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Company: Embilipitiya Cycle Works (Cycleworks.lk)</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Address: Embilipitiya, Sri Lanka</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Phone / WhatsApp: +94 77 123 4567</li>
<li className="mb-2 text-zinc-600 dark:text-zinc-300">Email: {storeEmail}</li>
</ul>
<p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">Disclaimer: This policy was generated using an online tool and does not constitute formal legal advice.</p>
      </div>
    </div>
  );
}
