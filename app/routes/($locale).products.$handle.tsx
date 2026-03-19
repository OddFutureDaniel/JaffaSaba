import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import type {LinksFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {StoreLayout} from '~/components/StoreLayout';
import productStyles from '~/styles/product.css?url';
import collectionStyles from '~/styles/collection.css?url';
import {useState, useRef} from 'react';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: collectionStyles},
  {rel: 'stylesheet', href: productStyles},
];

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Jaffa Saba | ${data?.product.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Error('Expected product handle to be defined');

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) throw new Response(null, {status: 404});

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

function Lightbox({src, onClose}: {src: string; onClose: () => void}) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <img src={src} alt="" />
      </div>
    </div>
  );
}

function ImageCarousel({images}: {images: any[]}) {
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const translateX = -(current * 100) + (dragOffset / (trackRef.current?.offsetWidth ?? 1)) * 100;

  return (
    <>
      <div
        className="product-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="product-carousel-track"
          style={{
            display: 'flex',
            width: `${images.length * 100}%`,
            transform: `translateX(${translateX / images.length}%)`,
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {images.map((img: any, i: number) => (
            <div
              key={i}
              style={{width: `${100 / images.length}%`, flexShrink: 0}}
            >
              <img
                src={img.url}
                alt={img.altText ?? ''}
                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_: any, i: number) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const images = product.images?.nodes ?? [];

  return (
    <StoreLayout mainColumns="4 / 12">
      <div className="product">

        {/* Desktop — stacked images */}
        <div className="product-images">
          {images.map((img: any) => (
            <ProductImage key={img.id} image={img} />
          ))}
        </div>

        {/* Mobile — carousel */}
        {images.length > 0 && (
          <ImageCarousel images={images} />
        )}

        <div className="product-main">
          <div className="product-title">{title}</div>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <div
            className="description"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
          <div className="product-info-section">
            <button
              className="product-info-link"
              onClick={() => setLightbox('/placeholder-sizing.jpg')}
            >
              Sizing Chart
            </button>
          </div>
          <div className="product-info-section">
            <p className="product-info-label">Shipping & Returns</p>
            <p className="product-info-text">No returns available once shipped</p>
            <button
              className="product-info-link"
              onClick={() => setLightbox('/placeholder-shipping.jpg')}
            >
              View Shipping Information
            </button>
          </div>
        </div>

        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </StoreLayout>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 50) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;