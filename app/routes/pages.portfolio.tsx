import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useAside } from '~/components/Aside';
import { portfolioProjects, type PortfolioProject } from '~/lib/portfolioData';
import gsap from 'gsap';

export const meta = () => [{ title: 'Jaffa Saba | Portfolio' }];

function PortfolioCard({
  project,
  index,
  totalCards,
  cardRefs,
  onClick,
}: {
  project: PortfolioProject;
  index: number;
  totalCards: number;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseW = 150;
  const hoverW = 260;
  const baseH = 190;
  const hoverH = 320;
  const push = (hoverW - baseW) / 2;

  const handleMouseEnter = () => {
    setIsHovered(true);
    for (let i = 0; i < index; i++) {
      const card = cardRefs.current[i];
      if (card) gsap.to(card, { x: -push, duration: 0.4, ease: 'power2.inOut' });
    }
    for (let i = index + 1; i < totalCards; i++) {
      const card = cardRefs.current[i];
      if (card) gsap.to(card, { x: push, duration: 0.4, ease: 'power2.inOut' });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardRefs.current.forEach((card) => {
      if (card) gsap.to(card, { x: 0, duration: 0.4, ease: 'power2.inOut' });
    });
  };

  return (
    <div
      ref={(el) => { cardRefs.current[index] = el; }}
      className="portfolio-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className={`portfolio-card-meta${isHovered ? ' portfolio-card-meta--visible' : ''}`}>
        <span className="portfolio-card-title">{project.title}</span>
        <span className="portfolio-card-category">{project.category}</span>
      </div>
      <div
        className="portfolio-card-img-wrapper"
        style={{
          width: isHovered ? `${hoverW}px` : `${baseW}px`,
          height: isHovered ? `${hoverH}px` : `${baseH}px`,
          clipPath: isHovered
            ? 'polygon(100% 0%, 97% 39%, 100% 100%, 26% 98%, 0% 100%, 3% 49%, 0% 0%, 74% 2%)'
            : 'none',
          transition: 'width 0.4s ease, height 0.4s ease, clip-path 0.4s ease',
        }}
      >
        <img
          className="portfolio-card-img"
          src={project.images[0]}
          alt={project.title}
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { open } = useAside();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxProject, setLightboxProject] = useState<PortfolioProject | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const PRIMARY_NAV = [
    { title: 'Home', url: '/' },
    { title: 'Contact', url: '/pages/contact' },
  ];

  const CATEGORY_NAV = [
    { title: 'All', url: '/collections/all' },
    { title: 'Auction', url: '/collections/auction' },
    { title: 'Lookbooks', url: '/collections/lookbooks' },
    { title: 'Accessories', url: '/collections/accessories' },
  ];

  return (
    <div className="portfolio-page">

      <div className="store-grid-wrapper">
        <header className="store-header">
          <div className="store-header-logo">
            <Link to="/">
              <img src="/JaffaWordmarkTransparent(1).png" alt="Jaffa Saba" />
            </Link>
          </div>
          <div className="store-header-icons">
            <button
              className="icon-btn mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen
                ? <X size={20} strokeWidth={1.5} color="#1a0a00" />
                : <Menu size={20} strokeWidth={1.5} color="#1a0a00" />
              }
            </button>
            <button className="icon-btn" onClick={() => open('search')}>
              <Search size={18} strokeWidth={1.5} color="#1a0a00" />
            </button>
            <button className="icon-btn" onClick={() => open('cart')}>
              <ShoppingBag size={18} strokeWidth={1.5} color="#1a0a00" />
            </button>
          </div>
        </header>
      </div>

      {mobileMenuOpen && (
        <div className="store-mobile-menu">
          {[...PRIMARY_NAV, ...CATEGORY_NAV].map((item) => (
            <Link key={item.url} to={item.url} onClick={() => setMobileMenuOpen(false)}>
              {item.title}
            </Link>
          ))}
        </div>
      )}

      <div className="portfolio-strip-wrapper">
        <div className="portfolio-strip">
          {portfolioProjects.map((project, i) => (
            <PortfolioCard
              key={project.id}
              project={project}
              index={i}
              totalCards={portfolioProjects.length}
              cardRefs={cardRefs}
              onClick={() => setLightboxProject(project)}
            />
          ))}
        </div>
      </div>

      {lightboxProject && (
        <div className="portfolio-lightbox-overlay" onClick={() => setLightboxProject(null)}>
          <div className="portfolio-lightbox" onClick={e => e.stopPropagation()}>
            <button className="portfolio-lightbox-close" onClick={() => setLightboxProject(null)}>
              <X size={18} strokeWidth={1.5} />
            </button>
            <img src={lightboxProject.images[0]} alt={lightboxProject.title} />
            <p className="portfolio-lightbox-title">{lightboxProject.title}</p>
            <p className="portfolio-lightbox-category">{lightboxProject.category}</p>
          </div>
        </div>
      )}

      <div className="portfolio-footer">
        <span className="portfolio-footer-left">Jaffa Saba</span>
        <Link to="/pages/contact" className="portfolio-footer-center">(Contact)</Link>
        <div className="portfolio-footer-right">
          <form className="portfolio-footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="email"
              className="portfolio-footer-email"
            />
            <button type="submit" className="portfolio-footer-btn">Subscribe</button>
          </form>
        </div>
      </div>

    </div>
  );
}