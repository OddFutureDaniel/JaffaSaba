import type { Route } from './+types/collections.all';
import { useLoaderData } from 'react-router';
import { getPaginationVariables, Money } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { StoreLayout } from '~/components/StoreLayout';

const HIDDEN_PRODUCT_HANDLES = ['sample-gene-2023-dog-tags'];

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Jaffa Saba | Store' }];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return { ...criticalData };
}

async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 20 });
  const [{ products }] = await Promise.all([
    storefront.query(CATALOG_QUERY, { variables: { ...paginationVariables } }),
  ]);
  return { products };
}

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage: {
    id: string;
    altText: string | null;
    url: string;
    width: number;
    height: number;
  } | null;
  images: {
    nodes: {
      id: string;
      url: string;
      altText: string | null;
      width: number;
      height: number;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export default function AllProducts() {
  const { products } = useLoaderData<typeof loader>();
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const visibleProducts = products.nodes.filter(
    (product: ProductNode) => !HIDDEN_PRODUCT_HANDLES.includes(product.handle)
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(card);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [visibleProducts]);

  return (
    <StoreLayout mainColumns="4 / 11">
      <div className="product-grid">
        {visibleProducts.map((product: ProductNode, i: number) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className={`product-card${product.images?.nodes?.[1] ? ' has-secondary' : ''}`}
            ref={(el) => { cardRefs.current[i] = el; }}
          >
            <div className="product-card-image">
              {product.featuredImage && (
                <img
                  className="product-img-primary"
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                />
              )}
              {product.images?.nodes?.[1] && (
                <img
                  className="product-img-secondary"
                  src={product.images.nodes[1].url}
                  alt={product.images.nodes[1].altText ?? product.title}
                />
              )}
            </div>
            <div className="product-card-details">
              <span className="product-card-title">{product.title}</span>
              <span className="product-card-price">
                <Money data={product.priceRange.minVariantPrice} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </StoreLayout>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    description
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;