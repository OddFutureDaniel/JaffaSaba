import {useOptimisticCart, type OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartForm} from '@shopify/hydrogen';

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
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart, freeGift}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const freeGiftVariantId = freeGift?.variants?.nodes?.[0]?.id;
  const freeGiftAvailable = freeGift?.variants?.nodes?.[0]?.availableForSale;
  const freeGiftAlreadyInCart = cart?.lines?.nodes?.some(
    (line) => line.merchandise.id === freeGiftVariantId
  );

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">Line items</p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              if ('parentRelationship' in line && line.parentRelationship?.parent) {
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

        {/* Free gift promo */}
        {cartHasItems && freeGift && freeGiftAvailable && !freeGiftAlreadyInCart && (
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
      <p>
      Empty. That's embarrassing.
      </p>
      <br />
      <Link to="/collections/all" onClick={close} prefetch="viewport">
        Go fix that →
      </Link>
    </div>
  );
}
