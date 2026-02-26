import {Image} from '@shopify/hydrogen';

type ShopifyImageLike =
  | {
      __typename?: 'Image';
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    }
  | null
  | undefined;

export function ProductImage({image}: {image: ShopifyImageLike}) {
  if (!image) return <div className="product-image" />;

  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}