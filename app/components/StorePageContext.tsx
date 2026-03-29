import { createContext, useContext } from 'react';
import { useLocation } from 'react-router';

const STORE_LAYOUT_ROUTES = [
  '/collections/all',
  '/collections/',
  '/products/',
  '/pages/',
  '/password',
];

interface StorePageContextType {
  hideGlobalLayout: boolean;
}

const StorePageContext = createContext<StorePageContextType>({
  hideGlobalLayout: false,
});

export function StorePageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideGlobalLayout = STORE_LAYOUT_ROUTES.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <StorePageContext.Provider value={{ hideGlobalLayout }}>
      {children}
    </StorePageContext.Provider>
  );
}

export function useStorePageContext() {
  return useContext(StorePageContext);
}