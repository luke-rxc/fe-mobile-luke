import { Slot } from '@pui/slot';
import { HTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { toNumber } from '../../utils';
import { DescriptionItem, DescriptionList } from '../order/DescriptionList';

export interface CheckoutMileageViewerProps extends HTMLAttributes<HTMLDivElement> {
  pointBalance: number;
}

export const CheckoutMileageViewer = ({ pointBalance, ...rest }: CheckoutMileageViewerProps) => {
  const { getValues } = useFormContext();
  const usedPoint = getValues('usePoint') ?? '';

  return (
    <DescriptionList {...rest}>
      <DescriptionItem
        title="보유금액"
        text={<Slot initialValue={pointBalance} value={pointBalance - toNumber(usedPoint)} suffix="원" />}
        textAlign="right"
      />
    </DescriptionList>
  );
};
