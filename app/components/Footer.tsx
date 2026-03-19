import { Suspense } from 'react';
import { Await, Link } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({ footer: footerPromise }: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => (
          <footer className="footer">
            <div className="footer-grid">

              {/* Left — Help */}
              <div className="footer-section">
                <p className="footer-heading">HELP</p>
                <nav className="footer-nav">
                  <Link to="/pages/size-guide">Size Guides</Link>
                  <Link to="/policies/shipping-policy">Shipping</Link>
                  <Link to="/pages/faqs">FAQs</Link>
                  <Link to="/pages/contact">Contact Us</Link>
                </nav>
              </div>

              {/* Middle — Engage */}
              <div className="footer-section footer-section-center">
                <p className="footer-heading">ENGAGE</p>
                <p>Dont sleep. First to know. First to cop.</p>
                <form
                  className="footer-newsletter"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="footer-email-input"
                    required
                  />
                  <button type="submit" className="footer-email-btn">
                    Subscribe
                  </button>
                </form>
                <p className="footer-disclaimer">
                  By submitting this form you agree to receive updates about fly
                  shit.{' '}
                  <Link to="/policies/terms-of-service">View Terms</Link> and{' '}
                  <Link to="/policies/privacy-policy">Privacy</Link>.
                </p>
                <div className="footer-socials">
                  <div className="footer-socials">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">Instagram</a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">TikTok</a>
                  </div>
                </div>
              </div>

              {/* Right — Logo */}
              <div className="footer-section footer-section-right">
                <Link to="/">
                  <img
                    src="/JaffaWordmarkTransparent(1).png"
                    alt="Jaffa Saba"
                    className="footer-logo"
                  />
                </Link>
              </div>

            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}