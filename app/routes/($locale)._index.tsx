import { useLoaderData } from 'react-router';
import { useEffect, useRef } from 'react';
import type { Route } from './+types/_index';
import gsap from 'gsap';
import '~/styles/homepage.css';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Jaffa Saba' }];
};

export async function loader(args: Route.LoaderArgs) {
  const { context } = args;
  const { storefront } = context;

  const { collection } = await storefront.query(SHOWCASE_QUERY);

  return {
    showcaseImages: collection?.products.nodes.map(
      (p: any) => p.featuredImage
    ) ?? [],
  };
}

const SHOWCASE_QUERY = `#graphql
  query ShowcaseImages {
    collection(handle: "homepage-showcase") {
      products(first: 10) {
        nodes {
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

const getRandomPosition = (placed: { top: number; left: number; w: number; h: number }[]) => {
  const imgW = 30;
  const imgH = 35;
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = 5 + Math.random() * 40;
    const left = 5 + Math.random() * 60;

    const overlapping = placed.some(p => {
      const overlapX = Math.max(0, Math.min(left + imgW, p.left + p.w) - Math.max(left, p.left));
      const overlapY = Math.max(0, Math.min(top + imgH, p.top + p.h) - Math.max(top, p.top));
      const overlapArea = overlapX * overlapY;
      const imgArea = imgW * imgH;
      return overlapArea / imgArea > 0.3;
    });

    if (!overlapping) return { top, left, w: imgW, h: imgH };
  }

  return { top: 5 + Math.random() * 40, left: 5 + Math.random() * 60, w: imgW, h: imgH };
};

export default function Homepage() {
  const { showcaseImages } = useLoaderData<typeof loader>();
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (showcaseImages.length === 0) return;

    document.body.style.overflow = 'hidden';

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const totalImages = imagesRef.current.length;
    const visibleDuration = 2.5;
    const fadeIn = 1.5;
    const fadeOut = 1;
    const gapBetween = 1;
    const cycleDuration = fadeIn + visibleDuration + fadeOut + gapBetween;

    imagesRef.current.forEach((img, i) => {
      const cycle = () => {
        // Get current positions of all other visible images
        const placed = imagesRef.current
          .filter((_, idx) => idx !== i)
          .map(el => {
            const rect = el.getBoundingClientRect();
            const heroRect = heroRef.current!.getBoundingClientRect();
            return {
              top: ((rect.top - heroRect.top) / heroRect.height) * 100,
              left: ((rect.left - heroRect.left) / heroRect.width) * 100,
              w: 30,
              h: 35,
            };
          });

        const pos = getRandomPosition(placed);
        gsap.set(img, { top: `${pos.top}%`, left: `${pos.left}%` });

        gsap.timeline()
          .to(img, { opacity: 1, duration: fadeIn, ease: 'power2.inOut' })
          .to(img, { opacity: 0, duration: fadeOut, ease: 'power2.inOut', delay: visibleDuration });
      };

      const staggerDelay = (cycleDuration / totalImages) * i * 1000;

      const t = setTimeout(() => {
        cycle();
        const iv = setInterval(cycle, cycleDuration * 1000);
        intervals.push(iv);
      }, staggerDelay);

      timers.push(t);
    });

    let scrollY = 0;
    const maxScroll = 2500;
    let unlocked = false;
    let unlockTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollY = Math.max(0, Math.min(maxScroll, scrollY + e.deltaY));
      const progress = scrollY / maxScroll;

      gsap.to(ctaRef.current, {
        opacity: progress,
        duration: 0.3,
        ease: 'power2.out',
      });

      if (scrollY >= maxScroll && !unlocked) {
        unlockTimeout = setTimeout(() => {
          unlocked = true;
          document.body.style.overflow = '';
          window.removeEventListener('wheel', handleWheel);
        }, 1000);
      } else if (scrollY < maxScroll) {
        clearTimeout(unlockTimeout);
      }
    };

    const handleScroll = () => {
      if (window.scrollY === 0 && unlocked) {
        unlocked = false;
        scrollY = maxScroll;
        document.body.style.overflow = 'hidden';
        window.addEventListener('wheel', handleWheel, { passive: false });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      clearTimeout(unlockTimeout);
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showcaseImages]);

  return (
    <main className="homepage">
      <section id="hero" ref={heroRef}>
        <div id="hero-images">
          {showcaseImages.map((image: any, i: number) => (
            <div
              key={i}
              className="hero-image"
              ref={(el) => {
                if (el) imagesRef.current[i] = el;
              }}
            >
              <img src={image.url} alt={image.altText ?? ''} />
            </div>
          ))}
        </div>

        <div id="shop-cta" ref={ctaRef}>
          <a href="/collections/all">Shop New Items</a>
        </div>
      </section>

      <footer id="footer">
        <p>© Jaffa Saba</p>
      </footer>
    </main>
  );
}