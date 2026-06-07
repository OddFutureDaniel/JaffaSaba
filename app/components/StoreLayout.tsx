import { Link } from 'react-router';

interface NavItem {
  title: string;
  url: string;
}

interface StoreLayoutProps {
  children: React.ReactNode;
  primaryNav?: NavItem[];
  categoryNav?: NavItem[];
  mainColumns?: string;
  id?: string;
}

const DEFAULT_PRIMARY_NAV: NavItem[] = [
  { title: 'Home', url: '/' },
  { title: 'Contact', url: '/pages/contact' },
];

const DEFAULT_CATEGORY_NAV: NavItem[] = [
  { title: 'All', url: '/collections/all' },
  { title: 'Auction', url: '/collections/auction' },
  { title: 'Lookbooks', url: '/collections/lookbooks' },
  { title: 'Accessories', url: '/collections/accessories' },
];

export function StoreLayout({
  children,
  primaryNav = DEFAULT_PRIMARY_NAV,
  categoryNav = DEFAULT_CATEGORY_NAV,
  mainColumns,
  id,
}: StoreLayoutProps) {
  return (
    <div className="store-page">


      <div className="store-main" id={id} style={{ gridColumn: mainColumns }}>
        {children}
      </div>

    </div>
  );
}