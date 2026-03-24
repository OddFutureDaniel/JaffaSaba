import { Link, useLoaderData } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import type { Route } from './+types/_index';
import gsap from 'gsap';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Jaffa Saba' }];
};

export async function loader(args: Route.LoaderArgs) {
  const { context, request } = args;
  const { storefront } = context;
  const { collection } = await storefront.query(SHOWCASE_QUERY);
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const isMobile = cookieHeader.includes('viewport=mobile');
  return {
    isMobile,
    showcaseImages: collection?.products.nodes.map((p: any) => p.featuredImage) ?? [],
  };
}

const SHOWCASE_QUERY = `#graphql
  query ShowcaseImages {
    collection(handle: "homepage-showcase") {
      products(first: 15) {
        nodes {
          featuredImage { url altText width height }
        }
      }
    }
  }
` as const;

const IMG_W = 19;
const IMG_H = 28;

function getPosition(activePos: Map<number, { top: number; left: number }>) {
  const maxAttempts = 40;

  for (let i = 0; i < maxAttempts; i++) {
    const top = 10 + Math.random() * 50;
    const left = 5 + Math.random() * 65;

    const overlapping = Array.from(activePos.values()).some(p => {
      const overlapX = Math.max(0, Math.min(left + IMG_W, p.left + IMG_W) - Math.max(left, p.left));
      const overlapY = Math.max(0, Math.min(top + IMG_H, p.top + IMG_H) - Math.max(top, p.top));
      return (overlapX * overlapY) / (IMG_W * IMG_H) > 0.15;
    });

    if (!overlapping) return { top, left };
  }

  // fallback if no clean position found
  return {
    top: 10 + Math.random() * 50,
    left: 5 + Math.random() * 65,
  };
}

export default function Homepage() {
  const { showcaseImages, isMobile: serverIsMobile } = useLoaderData<typeof loader>();
  const ctaRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const activePositions = useRef<Map<number, { top: number; left: number }>>(new Map());
  const [isMobile, setIsMobile] = useState<boolean>(serverIsMobile);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 750);
    const handleResize = () => setIsMobile(window.innerWidth <= 750);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showcaseImages.length === 0 || isMobile) return;

    const imgs = imagesRef.current.filter(Boolean);
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Set all images to initial hidden state
    imgs.forEach((img) => {
      gsap.set(img, { opacity: 0 });
    });

    const loop = (index: number) => () => {
      const img = imgs[index];
      if (!img) return;

      const { top, left } = getPosition(activePositions.current);
      activePositions.current.set(index, { top, left });

      gsap.set(img, { top: `${top}%`, left: `${left}%`, opacity: 0 });

      gsap.timeline()
        .to(img, { opacity: 1, duration: 2, ease: 'power2.inOut' })
        .to(img, { opacity: 0, duration: 2, ease: 'power2.inOut', delay: 2 })
        .call(() => {
          activePositions.current.delete(index);
          const t = setTimeout(loop(index), 3000 + Math.random() * 8000);
          timers.push(t);
        });
    };

    imgs.forEach((_, i) => {
      const t = setTimeout(loop(i), i * 1800);
      timers.push(t);
    });

    const maxScroll = 900;
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / maxScroll, 1);
      gsap.to(ctaRef.current, { opacity: progress, duration: 0.3, ease: 'power2.out' });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('scroll', handleScroll);
      activePositions.current.clear();
      gsap.killTweensOf(imgs);
    };
  }, [showcaseImages, isMobile]);

  return (
    <main className="homepage">
      <section id="hero">

        {isMobile === null ? null : isMobile ? (
          <div id="mobile-hero">
            <img
              src="https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_7344_e846ad79-9da7-4d1a-86a1-c0d7f76040b0.jpg?v=1771438811"
              alt="Jaffa Saba"
            />
            <Link to="/collections/all" id="mobile-hero-cta">Enter</Link>
          </div>
        ) : (
          <>
            <div id="hero-images">
              {showcaseImages.map((image: any, i: number) => (
                <div
                  key={i}
                  className="hero-image"
                  ref={(el) => { if (el) imagesRef.current[i] = el; }}
                >
                  <img src={image.url} alt={image.altText ?? ''} />
                </div>
              ))}
            </div>
            <div id="shop-cta" ref={ctaRef}>
              <Link to="/collections/all">Shop New Items</Link>
            </div>
          </>
        )}

      </section>
    </main>
  );
}