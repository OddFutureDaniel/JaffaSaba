import {Suspense, useState} from 'react';
import {Await, Link} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import '~/styles/header.css';
import {ShoppingBag, Menu} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({header, cart}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header id="header">
      <nav id="header-nav">

        {/* Hamburger — mobile only */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={22} strokeWidth={1.5} color="#1a0a00" />
        </button>

        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/collections/all">Store</Link>
        </div>

        {/* Logo absolutely centred always */}
        <div className="nav-logo">
          <Link to="/">
            <img src="/JaffaWordmarkTransparent(1).png" alt="Jaffa Saba" />
          </Link>
        </div>

        <div className="nav-right">
          <Link className="nav-portfolio" to="/pages/portfolio">Portfolio</Link>
          <Link className="nav-contact" to="/pages/contact">Contact</Link>
          <CartToggle cart={cart} />
        </div>

      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/collections/all" onClick={() => setMenuOpen(false)}>Store</Link>
          <Link to="/pages/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/pages/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
}

export function HeaderMenu() {
  return null;
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();

  return (
    <button className="cart-toggle" onClick={() => open('cart')}>
      <ShoppingBag size={20} strokeWidth={1.5} color="#1a0a00" />
      {count !== null && count > 0 && (
        <span className="cart-count">{count}</span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(resolvedCart) => {
          const cartData = resolvedCart as CartApiQueryFragment | null;
          return <CartBadge count={cartData?.totalQuantity ?? 0} />;
        }}
      </Await>
    </Suspense>
  );
}