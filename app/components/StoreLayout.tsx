import { useState } from 'react';
import { Link } from 'react-router';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useAside } from '~/components/Aside';
import { useStorePageContext } from '~/components/StorePageContext';

interface NavItem {
  title: string;
  url: string;
}

interface StoreLayoutProps {
  children: React.ReactNode;
  primaryNav?: NavItem[];
  categoryNav?: NavItem[];
  mainColumns?: string;
}

const DEFAULT_PRIMARY_NAV: NavItem[] = [
  { title: 'Home', url: '/' },
  { title: 'Portfolio', url: '/pages/portfolio' },
  { title: 'Contact', url: '/pages/contact' },
];

const DEFAULT_CATEGORY_NAV: NavItem[] = [
  { title: 'Bandanas', url: '/collections/bandanas' },
  { title: 'Lookbooks', url: '/collections/lookbooks' },
  { title: 'Accessories', url: '/collections/accessories' },
];

export function StoreLayout({
  children,
  primaryNav = DEFAULT_PRIMARY_NAV,
  categoryNav = DEFAULT_CATEGORY_NAV,
  mainColumns = '4 / 12',
}: StoreLayoutProps) {
  const { open } = useAside();
  const { setHideGlobalLayout } = useStorePageContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="store-page">
      <div className="store-grid">

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

        {mobileMenuOpen && (
          <div className="store-mobile-menu">
            {[...primaryNav, ...categoryNav].map((item) => (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}

        <div className="store-spacer" />

        <div className="store-sidebar">
          <nav className="store-nav">
            <div className="store-nav-primary">
              {primaryNav.map((item) => (
                <Link key={item.url} to={item.url}>{item.title}</Link>
              ))}
            </div>
            <div className="store-nav-categories">
              {categoryNav.map((item) => (
                <Link key={item.url} to={item.url}>{item.title}</Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="store-main" style={{ gridColumn: mainColumns }}>
          {children}
        </div>

      </div>
    </div>
  );
}