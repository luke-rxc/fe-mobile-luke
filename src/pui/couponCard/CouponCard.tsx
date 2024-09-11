import classNames from 'classnames';
import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';

type CouponCardStatus = 'default' | 'complete' | 'runout';

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 쿠폰명 */
  name: string;
  /** 할인 */
  discount: string;
  /** 상태 */
  status: CouponCardStatus;
  /** 배경색 */
  bgColor?: string;
  /** 텍스트 컬러 */
  textColor?: string;
}

const getBadgeLabel = (status: CouponCardStatus) => {
  switch (status) {
    case 'complete':
      return '받기 완료';
    case 'runout':
      return '쿠폰 소진';

    default:
      return null;
  }
};

const CouponCardComponent = forwardRef<HTMLDivElement, CouponCardProps>(({ name, discount, status, ...rest }, ref) => {
  const className = classNames(rest.className);
  const badgeLabel = getBadgeLabel(status);

  return (
    <div {...rest} ref={ref} className={className}>
      <p className="coupon-info-box">
        <span className="coupon-name">{name}</span>
        {badgeLabel && <CouponCardBadge label={badgeLabel} className="badge" />}
      </p>
      {status === 'runout' && <span className="overlay" />}
      <span className="coupon-discount-box">{discount}</span>
    </div>
  );
});

/**
 * Figma CouponCard 컴포넌트
 */
export const CouponCard = styled(CouponCardComponent)`
  overflow: hidden;
  position: relative;
  width: calc((100vw - 8rem) / 2);
  min-width: 12rem;
  max-width: 16.7rem;
  height: 9.6rem;
  padding: 1.2rem;
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ bgColor }) => bgColor || '#000000'};
  color: ${({ textColor }) => textColor || '#ffffff'};

  & .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.color.white70};
  }

  & .coupon-info-box {
    display: flex;
    flex-direction: column;

    .coupon-name {
      margin-bottom: 0.4rem;
      color: ${({ textColor }) => textColor || '#ffffff'};
      font: ${({ theme }) => theme.fontType.mini};
      ${({ theme }) => theme.mixin.multilineEllipsis(2, 14)}
    }
  }

  & .coupon-discount-box {
    position: absolute;
    right: 1.2rem;
    bottom: 1.2rem;
    color: ${({ textColor }) => textColor || '#ffffff'};
    font: ${({ theme }) => theme.fontType.mediumB};
  }
`;

interface CouponCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
}

const CouponCardBadgeComponent = forwardRef<HTMLDivElement, CouponCardBadgeProps>(({ label, ...rest }, ref) => {
  return (
    <span ref={ref} {...rest}>
      <span className="badge-label">{label}</span>
    </span>
  );
});

export const CouponCardBadge = styled(CouponCardBadgeComponent)`
  display: inline-flex;

  & .badge-label {
    padding: 0.3rem 0.6rem;
    border-radius: 5rem;
    background: ${({ theme }) => theme.color.gray20Dark};
    color: ${({ theme }) => theme.color.whiteLight};
    font: ${({ theme }) => theme.fontType.microB};
  }
`;
