import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  freeGift?: {
    title: string;
    featuredImage: {url: string; altText: string | null} | null;
    variants: {nodes: {id: string; availableForSale: boolean}[]};
  } | null;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

const FREE_GIFT_HANDLE = 'sample-gene-2023-dog-tags';

function AutoSubmitForm() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.click();
  }, []);

  return <button ref={ref} type="submit" style={{display: 'none'}} />;
}

export function CartMain({layout, cart: originalCart, freeGift}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const freeGiftVariantId = freeGift?.variants?.nodes?.[0]?.id;
  const freeGiftAvailable = freeGift?.variants?.nodes?.[0]?.availableForSale;

  const freeGiftLine = cart?.lines?.nodes?.find(
    (line) => line.merchandise.product.handle === FREE_GIFT_HANDLE
  );
  const freeGiftLineId = freeGiftLine?.id;
  const freeGiftAlreadyInCart = !!freeGiftLineId;

  const nonGiftItemCount =
    cart?.lines?.nodes?.filter(
      (line) => line.merchandise.product.handle !== FREE_GIFT_HANDLE
    ).length ?? 0;

  const isEligible = nonGiftItemCount > 0;
  const cartHasItems = (cart?.lines?.nodes?.length ?? 0) > 0;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">Line items</p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>

        {/* Auto-remove free gift if no longer eligible */}
        {freeGiftLineId && !isEligible && (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{lineIds: [freeGiftLineId]}}
          >
            <AutoSubmitForm />
          </CartForm>
        )}

        {/* Free gift promo — show only when eligible and not already in cart */}
        {isEligible && freeGift && freeGiftAvailable && !freeGiftAlreadyInCart && (
          <div className="free-gift-box">
            <p className="free-gift-label">ELIGIBLE</p>
            <div className="free-gift-inner">
              {freeGift.featuredImage && (
                <img
                  src={freeGift.featuredImage.url}
                  alt={freeGift.featuredImage.altText ?? freeGift.title}
                  className="free-gift-image"
                />
              )}
              <div className="free-gift-info">
                <p className="free-gift-title">{freeGift.title}</p>
                <p className="free-gift-price">Free</p>
                <CartForm
                  route="/cart"
                  action={CartForm.ACTIONS.LinesAdd}
                  inputs={{
                    lines: [{merchandiseId: freeGiftVariantId, quantity: 1}],
                  }}
                >
                  <button type="submit" className="free-gift-btn">
                    Add to bag
                  </button>
                </CartForm>
              </div>
            </div>
          </div>
        )}

        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>Empty. That's embarrassing.</p>
      <br />
      <Link to="/collections/all" onClick={close} prefetch="viewport">
        Go fix that →
      </Link>
    </div>
  );
}