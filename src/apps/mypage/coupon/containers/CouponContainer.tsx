import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { List } from '@pui/list';
import { TitleSection } from '@pui/titleSection';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { CouponListItem } from '@pui/couponListItem';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { Button } from '@pui/button';
import { AppLinkTypes } from '@constants/link';
import { useModal } from '@hooks/useModal';
import { useEffect } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { toAppLink } from '@utils/link';
import { useCouponService, useLogService } from '../services';
import { LoadingSpinner } from '../components';
import { CouponDrawerRegisterContainer } from './CouponDrawerRegisterContainer';
import { COUPON_STRING } from '../constants';

/**
 * MY Page > 쿠폰리스트 컨테이너
 */
export const CouponContainer = styled(({ className }) => {
  const {
    total,
    coupons,
    couponsError,
    isCouponsFetching,
    isCouponsError,
    isCouponsLoading,
    hasMoreCoupons,
    handleLoadCoupons,
  } = useCouponService();
  const { logViewCoupon } = useLogService();
  const { isApp } = useDeviceDetect();
  const { openModal } = useModal();
  const titleSuffix = total < 1 ? '' : total;

  /**
   * header 설정
   */
  useHeaderDispatch({
    type: 'mweb',
    title: `${COUPON_STRING.TITLE} ${total}`,
    enabled: !isCouponsLoading,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * 쿠폰 등록 버튼 클릭
   */
  const handleRegister = () => {
    if (isApp) {
      toAppLink(AppLinkTypes.COUPON_REGISTER);
    } else {
      openModal({
        nonModalWrapper: true,
        render: (props) => <CouponDrawerRegisterContainer {...props} />,
      });
    }
  };

  /**
   * 쿠폰 페이지 진입 시 이벤트 로깅
   */
  useEffect(() => {
    logViewCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * initializing
   */
  if (isCouponsLoading) {
    return <LoadingSpinner />;
  }

  /**
   * API Error Case
   */
  if (isCouponsError) {
    return <PageError error={couponsError} />;
  }

  if (isEmpty(coupons)) {
    return (
      <PageError
        title={COUPON_STRING.EMPTY.TITLE}
        description={COUPON_STRING.EMPTY.DESCRIPTION}
        actionLabel={COUPON_STRING.EMPTY.ACTIONLABEL}
        onAction={handleRegister}
      />
    );
  }

  return (
    <div className={className}>
      <TitleSection
        title={`${COUPON_STRING.SECTION.TITLE} ${titleSuffix}`}
        suffix={
          <Button className="add-button" size="medium" variant="tertiaryline" onClick={handleRegister}>
            {COUPON_STRING.SECTION.BUTTON_TITLE}
          </Button>
        }
      />
      <InfiniteScroller
        disabled={!hasMoreCoupons || isCouponsFetching}
        loading={isCouponsFetching}
        onScrolled={handleLoadCoupons}
      >
        <List source={coupons} component={CouponListItem} />
      </InfiniteScroller>
    </div>
  );
})`
  padding-bottom: 2.4rem;
  .add-button {
    width: 5.8rem;
  }
`;
