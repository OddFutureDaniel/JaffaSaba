import { Await, Link, useLocation } from 'react-router';
import { Suspense, useId } from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import { StorePageProvider, useStorePageContext } from '~/components/StorePageContext';
import { Search, X } from 'lucide-react';
import { Aside, useAside } from '~/components/Aside';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  freeGift?: {
    title: string;
    featuredImage: { url: string; altText: string | null } | null;
    variants: { nodes: { id: string; availableForSale: boolean }[] };
  } | null;
}

function PageLayoutInner({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  freeGift,
}: PageLayoutProps) {
  const { hideGlobalLayout } = useStorePageContext();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Aside.Provider>
      <CartAside cart={cart} freeGift={freeGift} />
      <SearchOverlay />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && !hideGlobalLayout && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="realmain">{children}</main>
      {!isHomePage && (
        <Footer
          footer={footer}
          header={header}
          publicStoreDomain={publicStoreDomain}
        />
      )}
    </Aside.Provider>
  );
}

export function PageLayout(props: PageLayoutProps) {
  return (
    <StorePageProvider>
      <PageLayoutInner {...props} />
    </StorePageProvider>
  );
}

function CartAside({
  cart,
  freeGift,
}: {
  cart: PageLayoutProps['cart'];
  freeGift: PageLayoutProps['freeGift'];
}) {
  return (
    <Aside type="cart" heading="Your Bag">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" freeGift={freeGift} />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchOverlay() {
  const { type, close } = useAside();
  const isOpen = type === 'search';
  const queriesDatalistId = 'predictive-search-queries';

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <SearchFormPredictive>
        {({ fetchResults, inputRef }) => (
          <div className="search-overlay-inner">
            <Search size={18} strokeWidth={1.5} color="#1a0a00" />
            <input
  ref={inputRef}
  name="search-query"
  onChange={fetchResults}
  onFocus={fetchResults}
  placeholder="Search"
  type="text"
  className="search-overlay-input"
  autoFocus
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck={false}
/>
            <button className="search-overlay-close" onClick={close}>
              <X size={18} strokeWidth={1.5} color="#1a0a00" />
            </button>
          </div>
        )}
      </SearchFormPredictive>
      <div className="search-overlay-results">
      <SearchResultsPredictive>
  {({items, total, term, state, closeSearch}) => {
    const {products} = items;
    if (state === 'loading' && term.current) {
      return <div className="search-loading">Searching...</div>;
    }
    if (!total) {
      return <SearchResultsPredictive.Empty term={term} />;
    }
    return (
      <SearchResultsPredictive.Products
        products={products}
        closeSearch={closeSearch}
        term={term}
      />
    );
  }}
</SearchResultsPredictive>
      </div>
    </div>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}