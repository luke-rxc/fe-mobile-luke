import { Button } from '@pui/button';
import { Slot } from '@pui/slot';
import styled from 'styled-components';
import { useCartStock } from '../../hooks/useCartStock';

export interface Props {
  className?: string;
  buyableItemCount: number;
  isLoading?: boolean;
  totalPrice: number;
  onCheckout: () => void;
}

export const CartCheckoutButton = styled(
  ({ className, buyableItemCount, isLoading = false, onCheckout: handleCheckout, totalPrice }: Props) => {
    const { hasMoreThanStock } = useCartStock();
    const disabled = hasMoreThanStock || buyableItemCount === 0;

    return (
      <div className={className}>
        <Button
          onClick={handleCheckout}
          disabled={disabled}
          size="large"
          variant="primary"
          bold
          block
          loading={isLoading}
          description={disabled ? undefined : <Slot initialValue={0} value={totalPrice} suffix="원" />}
          haptic="tapMedium"
        >
          구매
        </Button>
      </div>
    );
  },
)`
  position: fixed;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  padding: 2.4rem 2.4rem 0 2.4rem;
  width: 100%;
  z-index: 1;
`;
