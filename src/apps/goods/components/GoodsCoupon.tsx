import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { toKRW } from '@utils/toKRW';
import { CouponListModel, CouponModel } from '../models';

interface Props {
  coupon: CouponModel | null;
  isUserDownloaded: boolean;
  onCouponDownload: () => void;
  onCouponLink: () => void;
}

const getBenefitPrice = (list: CouponListModel[]) => {
  const priceList = list.filter(({ couponSale }) => couponSale).map(({ couponBenefitPrice }) => couponBenefitPrice);

  return {
    visible: priceList.length > 0,
    price: Math.min(...priceList),
  };
};

const getStatus = (isAllDownloaded: boolean, isUserDownloaded: boolean, benefitPrice: boolean) => {
  if (benefitPrice) {
    return '쿠폰적용시';
  }
  if (isAllDownloaded || isUserDownloaded) {
    return '쿠폰 다운로드 완료';
  }
  return '쿠폰 다운로드 가능';
};

export const GoodsCoupon: React.FC<Props> = ({
  coupon,
  isUserDownloaded,
  onCouponDownload,
  onCouponLink: handleCouponLink,
}) => {
  if (coupon === null) {
    return null;
  }
  const { lists, isAllDownloaded } = coupon;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expandStyles, setExpandStyles] = useState<React.CSSProperties>({});

  const isEmpty = lists.length === 0;

  const title = useMemo(() => {
    const benefitPrice = getBenefitPrice(lists);
    const status = getStatus(isAllDownloaded, isUserDownloaded, benefitPrice.visible);

    return { benefitPrice, status };
  }, [lists, isAllDownloaded, isUserDownloaded]);

  const { benefitPrice, status } = title;

  const handleCouponDownload = () => {
    onCouponDownload();
  };

  useEffect(() => {
    lists.length > 0 && setExpandStyles({ height: contentRef.current?.offsetHeight || 0 });
  }, [lists]);

  /**
   * 쿠폰 리스트가 없을 경우 쿠폰 영역 미노출
   * @example 처음에 다운 가능한 쿠폰이 있었지만 다운 실패로 리스트에서 삭제되어 쿠폰 리스트가 빌 경우
   * */
  useEffect(() => {
    isEmpty && setExpandStyles({ height: 0, transition: 'height 600ms' });
  }, [isEmpty]);

  return (
    <Wrapper style={expandStyles}>
      <div ref={contentRef} className="coupon-content">
        <div className="info-wrapper">
          <p className="download-area">
            <span className="title">{benefitPrice.visible ? `${status} ${toKRW(benefitPrice.price)}` : status}</span>
          </p>
          <CouponInfo>
            {lists.map(({ couponId, isDownloaded, display }) => (
              <li key={`${couponId}`} className={isDownloaded ? 'downloaded' : ''}>
                {display.title} {display.name}
              </li>
            ))}
          </CouponInfo>
        </div>
        {isUserDownloaded || isAllDownloaded ? (
          <Button variant="primary" size="medium" selected children="쿠폰확인" onClick={handleCouponLink} />
        ) : (
          <Button variant="primary" size="medium" children="쿠폰받기" onClick={handleCouponDownload} />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  will-change: height;

  .coupon-content {
    padding: ${({ theme }) => theme.spacing.s24} 0;
    display: flex;
    justify-content: space-between;
    font: ${({ theme }) => theme.fontType.medium};
  }

  .info-wrapper {
    flex: 1;
    margin-right: 0.4rem;
  }

  .title {
    font: ${({ theme }) => theme.fontType.mediumB};
  }

  .download-area {
    height: 1.8rem;
  }
`;

const CouponInfo = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.s12};
  & li {
    padding: ${({ theme }) => theme.spacing.s4} 0;
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textPrimary};
    word-break: break-all;

    &.downloaded {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }

    &::before {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      margin-right: 0.6rem;
      vertical-align: middle;
      border-radius: 100%;
      background: ${({ theme }) => theme.color.text.textPrimary};
      content: '';
    }

    .text {
      display: block;
      overflow: hidden;
    }

    &.downloaded::before {
      background: ${({ theme }) => theme.color.text.textDisabled};
    }
  }
`;
