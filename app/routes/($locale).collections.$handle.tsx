import {useLoaderData, redirect} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Money} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {StoreLayout} from '~/components/StoreLayout';
import {Link} from 'react-router';
import {useEffect, useRef} from 'react';
import gsap from 'gsap';


export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Jaffa Saba | ${data?.collection.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 20});

  if (!handle) throw redirect('/collections');

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

type ProductNode = {
  id: string;
  handle: string;
  title: string;
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

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(card, {opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'});
            observer.disconnect();
          }
        },
        {threshold: 0.1},
      );
      observer.observe(card);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [collection.products.nodes]);

  return (
    <StoreLayout mainColumns="4 / 11">
      <div className="product-grid">
        {collection.products.nodes.map((product: ProductNode, i: number) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className={`product-card${product.images?.nodes?.[1] ? ' has-secondary' : ''}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
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
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </StoreLayout>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;