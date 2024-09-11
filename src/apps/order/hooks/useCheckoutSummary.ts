import { useCallback, useEffect, useState } from 'react';
import { toKRW } from '@utils/toKRW';
import { useFormContext, useWatch } from 'react-hook-form';
import { CheckoutSummaryModel } from '../models';
import { SelectedCoupon } from '../types';

function toNumber(val: string | number) {
  if (typeof val === 'number') {
    return Number(val);
  }

  return Number(val.replace(/[,]/g, ''));
}

export const useCheckoutSummary = (summaryInfo: CheckoutSummaryModel) => {
  const { setValue, getValues } = useFormContext();
  const usePoint = toNumber(getValues('usePoint') ?? 0);
  const useGoodsCoupons = useWatch({ name: 'useGoodsCoupons' }) as SelectedCoupon[];
  const useCartCoupon = useWatch({ name: 'useCartCoupon' }) as SelectedCoupon | null;
  const [summary, setSummary] = useState<CheckoutSummaryModel>(summaryInfo);

  function toCheckoutSummary({
    totalSalesPrice,
    totalShippingCost,
    totalGoodsCouponPrice,
    totalCartCouponPrice,
    totalUsedPoint,
    ...other
  }: CheckoutSummaryModel): CheckoutSummaryModel {
    const orderPriceOrigin = totalSalesPrice + totalShippingCost;
    const couponSale = totalGoodsCouponPrice + totalCartCouponPrice;
    const salePrice = couponSale + totalUsedPoint;
    const diff = orderPriceOrigin - salePrice;
    const orderPrice = Math.max(diff, 0);
    const points = totalUsedPoint + Math.min(diff, 0);

    return {
      ...other,
      orderPrice,
      orderPriceText: toKRW(orderPrice),
      totalSalesPrice,
      totalSalesPriceText: toKRW(totalSalesPrice),
      totalShippingCost,
      totalShippingCostText: toKRW(totalShippingCost),
      totalUsedPoint: points,
      totalUsedPointText: points ? toKRW(points) : '',
      totalGoodsCouponPrice,
      totalGoodsCouponPriceText: totalGoodsCouponPrice ? toKRW(totalGoodsCouponPrice) : '',
      totalCartCouponPrice,
      totalCartCouponPriceText: totalCartCouponPrice ? toKRW(totalCartCouponPrice) : '',
    };
  }

  const getTotalDiscountPrice = useCallback(() => {
    const totalGoodsCouponPrice = (useGoodsCoupons ?? []).reduce((acc, item) => acc + item.couponSale, 0);
    const totalUsedPoint = usePoint;
    const totalCartCouponPrice = useCartCoupon?.couponSale ?? 0;
    const total = totalGoodsCouponPrice + totalUsedPoint + totalCartCouponPrice;

    return total > 0 ? total * -1 : 0;
  }, [usePoint, useGoodsCoupons, useCartCoupon]);

  const getTotalDiscountPriceText = useCallback(() => {
    const totalDiscountPrice = getTotalDiscountPrice();
    return toKRW(totalDiscountPrice);
  }, [getTotalDiscountPrice]);

  useEffect(() => {
    const model = toCheckoutSummary({
      ...summaryInfo,
      totalGoodsCouponPrice: (useGoodsCoupons ?? []).reduce((acc, item) => acc + item.couponSale, 0),
      totalUsedPoint: Math.max(usePoint, 0),
      totalCartCouponPrice: useCartCoupon?.couponSale ?? 0,
    });
    setSummary(model);
    setValue('orderPrice', model.orderPrice);
  }, [summaryInfo, setValue, usePoint, useGoodsCoupons, useCartCoupon]);

  return {
    summary,
    totalDiscountPrice: getTotalDiscountPrice(),
    totalDiscountPriceText: getTotalDiscountPriceText(),
  };
};
