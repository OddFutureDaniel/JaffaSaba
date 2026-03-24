import { StoreLayout } from '~/components/StoreLayout';

export default function TermsOfService() {
  return (
    <StoreLayout mainColumns="3 / 11">
      <div className="policy-page">
        <p className="policy-heading">Terms of Service</p>
        <p className="policy-updated">Last updated: March 2026</p>

        <div className="policy-body">

          <div className="policy-section">
            <p className="policy-section-title">1. Overview</p>
            <p>These terms govern your use of jaffasaba.com and any purchase made through the site. By accessing the site or placing an order, you agree to be bound by these terms. The site is operated by Jaffa Saba, based in England.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">2. Products</p>
            <p>We sell physical and digital products. Many items are one-of-a-kind or handmade. Where products are handmade, the item received may differ slightly from the image shown — this is inherent to the nature of handmade goods and is not considered a defect.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">3. Pricing</p>
            <p>All prices are listed in GBP and are inclusive of any applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice. Prices at the time of order confirmation are final.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">4. Orders</p>
            <p>By placing an order you are making an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including in cases of pricing errors, suspected fraud, or stock unavailability. You will be notified and any payment refunded promptly.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">5. Payment</p>
            <p>Payment is processed securely through Shopify Payments. We accept major credit and debit cards. We do not store your card details — all payment data is handled by our payment processor in accordance with PCI DSS standards.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">6. Returns & Refunds</p>
            <p>We do not accept returns or offer refunds on the following:</p>
            <ul>
              <li>Digital products — all sales are final upon delivery</li>
              <li>One-of-a-kind (1/1) items</li>
              <li>Items that have been used, washed, or altered</li>
            </ul>
            <p>A return or refund may be considered only if the item received is genuinely faulty or significantly not as described. In this case, please contact us within 7 days of receiving your order at jaffasabainfo@gmail.com with photos and a description of the fault. We will assess each case individually.</p>
            <p>Handmade items may differ from images shown. This variation is not grounds for a return.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">7. Shipping</p>
            <p>Shipping times and costs are displayed at checkout. We are not responsible for delays caused by couriers, customs, or circumstances outside our control. Risk of loss passes to you upon dispatch.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">8. Intellectual Property</p>
            <p>All content on this site — including images, text, designs, and branding — is the property of Jaffa Saba. You may not reproduce, distribute, or use any content without prior written permission.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">9. Limitation of Liability</p>
            <p>To the fullest extent permitted by law, Jaffa Saba shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site or purchase of products. Our liability is limited to the value of the order in question.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">10. Governing Law</p>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">11. Contact</p>
            <p>For any questions regarding these terms, contact us at <a href="mailto:jaffasabainfo@gmail.com">jaffasabainfo@gmail.com</a>.</p>
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}