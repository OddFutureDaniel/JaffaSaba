import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
          draggable={false}
        />
      </div>
    </div>
  );
}

function Lightbox({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCollection = project.images.length > 1;

  const prev = () => setActiveIndex(i => (i - 1 + project.images.length) % project.images.length);
  const next = () => setActiveIndex(i => (i + 1) % project.images.length);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="plb-overlay" onClick={onClose} onKeyDown={handleKey} tabIndex={0}>
      <div className="plb-inner">
        <button className="plb-close" onClick={onClose}>
          <X size={16} strokeWidth={1.5} color="white" />
        </button>
        <div className="plb-info">
          <p className="plb-title">{project.title}</p>
          {project.bio && <p className="plb-bio">{project.bio}</p>}
          {isCollection && (
            <p className="plb-count">
              {activeIndex + 1} / {project.images.length}
            </p>
          )}
        </div>
        <div className="plb-main" onClick={e => e.stopPropagation()}>
          <img
            src={project.images[activeIndex]}
            alt={project.title}
            className="plb-img"
          />
        </div>
        {isCollection && (
          <div className="plb-strip-wrap" onClick={e => e.stopPropagation()}>
            <div className="plb-arrows">
              <button className="plb-arrow" onClick={prev}>
                <ChevronLeft size={20} strokeWidth={1.5} color="white" />
              </button>
              <button className="plb-arrow" onClick={next}>
                <ChevronRight size={20} strokeWidth={1.5} color="white" />
              </button>
            </div>
            <div className="plb-strip">
              {project.images.map((src, i) => (
                <button
                  key={i}
                  className={`plb-thumb${i === activeIndex ? ' plb-thumb--active' : ''}`}
                  onClick={() => setActiveIndex(i)}
                >
                  <img src={src} alt={`${project.title} ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Alternate alignment pattern for mobile archive
const ALIGNMENTS = ['left', 'right', 'left', 'right', 'left'];

export default function Portfolio() {
  const [lightboxProject, setLightboxProject] = useState<PortfolioProject | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - (wrapperRef.current?.offsetLeft ?? 0);
    scrollLeft.current = wrapperRef.current?.scrollLeft ?? 0;
    if (wrapperRef.current) wrapperRef.current.style.cursor = 'grabbing';
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (wrapperRef.current) wrapperRef.current.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (wrapperRef.current) wrapperRef.current.style.cursor = 'grab';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (wrapperRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1.1;
    dragDistance.current = Math.abs(walk);
    if (wrapperRef.current) wrapperRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="portfolio-page">

      {/* Desktop horizontal strip */}
      <div
        className="portfolio-strip-wrapper"
        ref={wrapperRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="portfolio-strip">
          {portfolioProjects.map((project, i) => (
            <PortfolioCard
              key={project.id}
              project={project}
              index={i}
              totalCards={portfolioProjects.length}
              cardRefs={cardRefs}
              onClick={() => {
                if (dragDistance.current < 5) setLightboxProject(project);
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile vertical archive */}
      <div className="portfolio-archive">
        {portfolioProjects.map((project, i) => {
          const align = ALIGNMENTS[i % ALIGNMENTS.length];
          const isWide = i % 3 === 0;
          return (
            <div
              key={project.id}
              className={`portfolio-archive-item portfolio-archive-item--${align}${isWide ? ' portfolio-archive-item--wide' : ''}`}
              onClick={() => setLightboxProject(project)}
            >
              <span className="portfolio-archive-index">({String(i + 1).padStart(2, '0')})</span>
              <div className="portfolio-archive-img-wrap">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <div className="portfolio-archive-meta">
                <span className="portfolio-archive-title">{project.title}</span>
                <span className="portfolio-archive-category">{project.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
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