/* eslint-disable react-hooks/exhaustive-deps */
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { toCouponsModel } from '../models';
import { getActiveCoupon } from '../apis';
import { ACTIVE_COUPON_QUERY_KEY, REGISTER_COUPON_EVENT_TYPE } from '../constants';
import { RegisterCouponReceiveProps } from '../types';
/**
 * 사용가능 쿠폰 조회 Service
 */
export const useCouponService = () => {
  /**
   * 전체 쿠폰수
   */
  const total = useRef<number>(0);
  /**
   * 신규 추가 쿠폰 id
   */
  const reflectionTargetRef = useRef<number>(-1);
  const { receiveValues } = useWebInterface();
  /**
   * Coupon 리스트 Infinite Query
   */
  const listQuery = useInfiniteQuery(
    ACTIVE_COUPON_QUERY_KEY,
    ({ pageParam: nextParameter }) => getActiveCoupon({ nextParameter }),
    {
      getNextPageParam: ({ nextParameter }) => nextParameter,
      select: ({ pages, ...params }) => {
        total.current = get(head(pages), 'metadata.count', 0);
        return {
          pages: pages.flatMap((data) => toCouponsModel(data, reflectionTargetRef.current)),
          ...params,
        };
      },
      cacheTime: 0,
    },
  );

  useEffect(() => {
    // 쿠폰 등록 완료 후, receiveValues 활용한 쿠폰 리스트 refetch 처리
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues as RegisterCouponReceiveProps;
      if (type === REGISTER_COUPON_EVENT_TYPE.ON_SUCCESS && data.couponId) {
        reflectionTargetRef.current = data.couponId;
        listQuery.refetch();
      }
    }
  }, [receiveValues]);

  return {
    total: total.current,
    coupons: listQuery.data?.pages || [],
    couponsError: listQuery.error,
    isCouponsError: listQuery.isError,
    isCouponsLoading: listQuery.isLoading,
    isCouponsSuccess: listQuery.isSuccess,
    isCouponsFetching: listQuery.isFetching,
    hasMoreCoupons: listQuery.hasNextPage,
    handleLoadCoupons: listQuery.fetchNextPage,
    handleRefetchCoupons: listQuery.refetch,
  };
};
