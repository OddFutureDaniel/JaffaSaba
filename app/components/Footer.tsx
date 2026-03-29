import { useRef, useEffect } from 'react';
import { Suspense } from 'react';
import { Await, Link } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

function RotatingLogo() {
  const imgRef = useRef<HTMLImageElement>(null);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const animate = () => {
      if (isHovering.current) {
        rotationRef.current = (rotationRef.current + 0.9) % 360;
        img.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    
      <img
        ref={imgRef}
        src="/JaffaLogo.png"
        alt="Jaffa Saba"
        className="footer-logo"
        onMouseEnter={() => { isHovering.current = true; }}
        onMouseLeave={() => { isHovering.current = false; }}
      />
   
  );
}

function InstagramIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
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
                  <Link to="/pages/size-guide">Sizing</Link>
                  <Link to="/policies/shipping-policy">Shipping</Link>
                  <Link to="/pages/contact">Contact</Link>
                </nav>
              </div>

              {/* Middle — Engage */}
              <div className="footer-section footer-section-center">
  
                
                <form
                  className="footer-newsletter"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="email"
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
                  <Link to="/pages/terms-of-service">View Terms</Link> and{' '}
                  <Link to="/pages/privacy-policy">Privacy</Link>.
                </p>
                <div className="footer-socials">
                  <a
                    href="https://instagram.com/jaffasaba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={30} />
                  </a>
                  <a
                    href="https://tiktok.com/@jaffasaba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="TikTok"
                  >
                    <TikTokIcon size={30} />
                  </a>
                </div>
              </div>

              {/* Right — Logo */}
              <div className="footer-section footer-section-right">
                <RotatingLogo />
              </div>

            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}