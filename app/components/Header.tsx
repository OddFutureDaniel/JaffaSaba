import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import '~/styles/header.css';
import {ShoppingBag} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({header, cart}: HeaderProps) {
  return (
    <header id="header">
      <nav id="header-nav">

        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/collections/all">Store</Link>
        </div>

        <div className="nav-logo">
          <Link to="/">
            <img src="/JaffaWordmarkTransparent(1).png" alt="Jaffa Saba" />
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/pages/portfolio">Portfolio</Link>
          <Link to="/pages/contact">Contact</Link>
          <CartToggle cart={cart} />
        </div>

      </nav>
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

