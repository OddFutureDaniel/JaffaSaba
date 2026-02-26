import { Link, useLoaderData } from 'react-router';
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
      products(first: 15) {
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

const IMG_W = 19; // % of viewport width
const IMG_H = 28; // % of viewport height — fixed so top range is usable

const getBestPosition = (placed: { top: number; left: number; w: number; h: number }[]) => {
  const candidates = 40;
  let bestPos = { top: 10, left: 10, w: IMG_W, h: IMG_H };
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < candidates; attempt++) {
    // top range: 10% to 60% (leaves room for image height)
    const top = 10 + Math.random() * 50;
    // left range: 5% to 75% (leaves room for image width)
    const left = 5 + Math.random() * 70;

    const overlapping = placed.some(p => {
      const overlapX = Math.max(0, Math.min(left + IMG_W, p.left + p.w) - Math.max(left, p.left));
      const overlapY = Math.max(0, Math.min(top + IMG_H, p.top + p.h) - Math.max(top, p.top));
      const overlapArea = overlapX * overlapY;
      return overlapArea / (IMG_W * IMG_H) > 0.1;
    });

    if (overlapping) continue;

    const score = placed.length === 0
      ? Math.random() * 100
      : placed.reduce((acc, p) => {
          const cx = left + IMG_W / 2;
          const cy = top + IMG_H / 2;
          const pcx = p.left + p.w / 2;
          const pcy = p.top + p.h / 2;
          return acc + Math.sqrt(Math.pow(cx - pcx, 2) + Math.pow(cy - pcy, 2));
        }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestPos = { top, left, w: IMG_W, h: IMG_H };
    }
  }

  return bestPos;
};

export default function Homepage() {
  const { showcaseImages } = useLoaderData<typeof loader>();
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const activePositions = useRef<Map<number, { top: number; left: number; w: number; h: number }>>(new Map());
  const queueRef = useRef<number[]>([]);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showcaseImages.length === 0) return;

    const totalImages = imagesRef.current.length;
    const visibleDuration = 4000;
    const fadeIn = 2;
    const fadeOut = 2;
    const fadeOutMs = fadeOut * 1000;
    const interval = 1500; // ms between each new image appearing

    // Build shuffled queue of image indices
    const buildQueue = () => {
      const q = Array.from({ length: totalImages }, (_, i) => i);
      // shuffle
      for (let i = q.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q[i], q[j]] = [q[j], q[i]];
      }
      return q;
    };

    queueRef.current = buildQueue();

    const showNext = () => {
      if (queueRef.current.length === 0) {
        queueRef.current = buildQueue();
      }

      const i = queueRef.current.shift()!;
      const img = imagesRef.current[i];
      if (!img) return;

      const placed = Array.from(activePositions.current.values());
      const pos = getBestPosition(placed);

      activePositions.current.set(i, pos);
      gsap.set(img, { top: `${pos.top}%`, left: `${pos.left}%`, opacity: 0 });

      gsap.timeline()
        .to(img, { opacity: 1, duration: fadeIn, ease: 'power2.inOut' })
        .to(img, { opacity: 0, duration: fadeOut, ease: 'power2.inOut', delay: visibleDuration / 1000 })
        .call(() => activePositions.current.delete(i));

      schedulerRef.current = setTimeout(showNext, interval);
    };

    showNext();

    const maxScroll = 900;
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / maxScroll, 1);
      gsap.to(ctaRef.current, {
        opacity: progress,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
      activePositions.current.clear();
      gsap.killTweensOf(imagesRef.current);
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
          <Link to="/collections/all">Shop New Items</Link>
        </div>
      </section>
    </main>
  );
}