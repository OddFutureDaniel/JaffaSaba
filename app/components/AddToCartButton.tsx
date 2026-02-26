import type {FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

type AddToCartButtonProps = {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AddToCartButton(props: AddToCartButtonProps) {
  const {
    analytics,
    children,
    disabled,
    lines,
    onClick,
    // allow className, id, data-*, aria-*, etc
    ...buttonProps
  } = props;

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={analytics ? JSON.stringify(analytics) : ''}
          />
          <button
            type="submit"
            {...buttonProps}
            onClick={onClick}
            disabled={disabled || fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}