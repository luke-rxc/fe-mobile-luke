import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useAuth } from '@hooks/useAuth';
import { useEffect } from 'react';
import { MenuList, UserProfile } from '../components';
import { useCouponService, usePointService } from '../services';

export const MypageMainContainer = () => {
  const { isLoading, userInfo, refetchUserInfo } = useAuth();
  const { coupon, isCouponLoading } = useCouponService();
  const { point, isPointLoading } = usePointService();
  const isMenuListLoading = isCouponLoading || isPointLoading;

  useHeaderDispatch({
    type: 'mweb',
    enabled: !isLoading,
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    refetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userInfo && <UserProfile userInfo={userInfo} />}
      <MenuList
        isLoading={isMenuListLoading}
        couponCount={coupon?.length}
        point={point?.usablePoint}
        isPrizmPayReRegistrationRequired={userInfo?.isPrizmPayReRegistrationRequired}
      />
    </>
  );
};
