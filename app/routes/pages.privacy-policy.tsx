import { StoreLayout } from '~/components/StoreLayout';

export default function PrivacyPolicy() {
  return (
    <StoreLayout mainColumns="3 / 11">
      <div className="policy-page">
        <p className="policy-heading">Privacy Policy</p>
        <p className="policy-updated">Last updated: March 2026</p>

        <div className="policy-body">

          <div className="policy-section">
            <p className="policy-section-title">1. Who We Are</p>
            <p>Jaffa Saba is an independent brand based in England. We operate jaffasaba.com. For any privacy-related queries, contact us at <a href="mailto:jaffasabainfo@gmail.com">jaffasabainfo@gmail.com</a>.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">2. What Data We Collect</p>
            <p>When you make a purchase or create an account, we may collect:</p>
            <ul>
              <li>Name and contact details (email address, phone number)</li>
              <li>Billing and shipping address</li>
              <li>Payment information (processed securely by Shopify — we do not store card details)</li>
              <li>Order history and transaction data</li>
              <li>Email address if you subscribe to our newsletter</li>
            </ul>
            <p>When you browse the site, we may also collect technical data such as your IP address, browser type, and pages visited through Shopify's built-in analytics.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">3. How We Use Your Data</p>
            <p>We use your data to:</p>
            <ul>
              <li>Process and fulfil your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer service enquiries</li>
              <li>Send marketing emails if you have opted in (you can unsubscribe at any time)</li>
              <li>Improve the performance and experience of the site</li>
            </ul>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">4. Legal Basis for Processing</p>
            <p>Under UK GDPR, we process your data on the following bases:</p>
            <ul>
              <li>Contract — to fulfil your order</li>
              <li>Legitimate interests — to improve our services and prevent fraud</li>
              <li>Consent — for marketing communications, which you can withdraw at any time</li>
            </ul>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">5. Data Sharing</p>
            <p>We do not sell or share your personal data with third parties for their own marketing purposes. Your data may be shared with:</p>
            <ul>
              <li>Shopify Inc. — our e-commerce platform provider, who processes data on our behalf</li>
              <li>Shipping carriers — solely for the purpose of delivering your order</li>
              <li>Payment processors — to handle transactions securely</li>
            </ul>
            <p>All third parties are required to handle your data in accordance with applicable data protection law.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">6. Data Retention</p>
            <p>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Order data is typically retained for 7 years for accounting purposes. You may request deletion of your data at any time (subject to legal obligations).</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">7. Your Rights</p>
            <p>Under UK GDPR you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:jaffasabainfo@gmail.com">jaffasabainfo@gmail.com</a>. We will respond within 30 days.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">8. Cookies</p>
            <p>Our site uses cookies to enable core functionality such as shopping cart and checkout. Shopify may also use cookies for analytics and fraud prevention. You can control cookies through your browser settings, though disabling them may affect site functionality.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">9. Security</p>
            <p>We take reasonable technical and organisational measures to protect your data. Payment information is encrypted and processed by Shopify in accordance with PCI DSS standards. However, no method of transmission over the internet is completely secure.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">10. Changes to This Policy</p>
            <p>We may update this policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </div>

          <div className="policy-section">
            <p className="policy-section-title">11. Complaints</p>
            <p>If you believe we have not handled your data correctly, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.</p>
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}