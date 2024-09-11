import React, { forwardRef, useEffect, useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { toKRW } from '@utils/toKRW';
import { toHHMMSS } from '@utils/toTimeformat';
import { useDDay } from '@services/useDDay';
import { Image } from '@pui/image';
import { Coupon, Icon } from '@pui/icon';

/**
 * 쿠폰 만료일 표기를 위한 데이터 반환
 */
const toDisplayExpiryDate = (date: CouponListItemProps['expiryDate']) => {
  const today = new Date();
  const expiryDay = new Date(date);
  const remainingPeriod = differenceInCalendarDays(expiryDay, today);

  // 하루미만
  if (remainingPeriod < 1) {
    return { remainingPeriod, isCountDown: true, displayExpiryDate: '' };
  }

  // 일주일 이하
  if (remainingPeriod <= 7) {
    return { remainingPeriod, isCountDown: false, displayExpiryDate: `D-${remainingPeriod}` };
  }

  // 30일 이하
  if (remainingPeriod <= 30) {
    return { remainingPeriod, isCountDown: false, displayExpiryDate: `D-${remainingPeriod}` };
  }

  // 30일 초과
  return { remainingPeriod, isCountDown: false, displayExpiryDate: format(date, '~ yyyy. M. d') };
};

/**
 * 만료일 표기를 위한 Hooks (카운트다운 기능)
 */
const useDisplayExpiryDate = (date: CouponListItemProps['expiryDate']) => {
  const { displayExpiryDate, remainingPeriod, isCountDown } = toDisplayExpiryDate(date);
  const { countDown } = useDDay(isCountDown ? { time: date ?? 0 } : { time: -1, enabled: false });

  return {
    /** 만료일이 30일 이하인가? */
    remainingPeriod,
    /** 만료일 */
    displayExpiryDate: isCountDown ? toHHMMSS(countDown) : displayExpiryDate,
  };
};

export interface CouponListItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 할인 정보 */
  title: string;
  /** 쿠폰명 */
  name: string;
  /** 만료일 */
  expiryDate: number;
  /** 쿠폰 이미지 URL */
  imageURL?: string;
  /** 쿠폰 이미지 blurhash */
  blurHash?: string;
  /** 최대 할인 금액 */
  maxDiscount?: number;
  /** 최소 구매 금액 */
  minPurchase?: number;
  /** Reflection 효과 적용 위한 최신 등록 여부 */
  isUpdated?: boolean;
}

const CouponListItemComponent = forwardRef<HTMLSpanElement, CouponListItemProps>(
  ({ title, name, expiryDate, minPurchase, maxDiscount, imageURL, blurHash, isUpdated, ...props }, ref) => {
    const { displayExpiryDate, remainingPeriod } = useDisplayExpiryDate(expiryDate);

    const thumbRef = useRef<HTMLSpanElement>(null);
    // eslint-disable-next-line consistent-return
    useEffect(() => {
      if (isUpdated) {
        const reflection = setTimeout(() => {
          thumbRef.current?.classList.add('active');
        }, 200);
        return () => {
          clearTimeout(reflection);
        };
      }
    }, [isUpdated]);
    /**
     * 사용 조건 노출 여부
     */
    const displayPolicy = !!(minPurchase && maxDiscount);

    /**
     * 남은 사용 기간의 디자인 적용을 위한 className
     */
    const expiryClassNames = classnames('expiry', {
      'is-less-week': remainingPeriod <= 7,
      'is-month': remainingPeriod <= 30,
    });

    return (
      <span ref={ref} {...props}>
        <span className="coupon-thumb">
          <span className="thumb" ref={thumbRef}>
            {imageURL ? <Image lazy src={imageURL} blurHash={blurHash} /> : <Coupon size="3.2rem" color="surface" />}
          </span>
        </span>
        <span className="coupon-info">
          <span className="title">{title}</span>
          <span className="name">{name}</span>
          {displayPolicy && (
            <span className="policy">
              {!!minPurchase && <span className="policy-item">{`${toKRW(minPurchase)} 이상 구매`}</span>}
              {!!maxDiscount && <span className="policy-item">{`최대 ${toKRW(maxDiscount)}`}</span>}
            </span>
          )}
          <span className={expiryClassNames}>{displayExpiryDate}</span>
        </span>
      </span>
    );
  },
);

/**
 * Figma Coupon 컴포넌트
 */
export const CouponListItem = styled(CouponListItemComponent)`
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 11.2rem;
  padding: ${({ theme }) => theme.spacing.s12};

  .coupon-thumb {
    ${({ theme }) => theme.mixin.centerItem()};
    float: left;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 8.8rem;
    height: 8.8rem;

    .thumb {
      ${({ theme }) => theme.mixin.centerItem()};
      flex-shrink: 0;
      overflow: hidden;
      width: 6.4rem;
      height: 6.4rem;
      border-radius: 50%;
      transform: translate3d(0, 0, 0);
      background: ${({ theme }) => theme.color.text.textLink};

      &::after {
        position: absolute;
        content: '';
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.243478) 22.92%,
          rgba(255, 255, 255, 0.32) 47.92%,
          rgba(255, 255, 255, 0.236) 73.44%,
          rgba(255, 255, 255, 0) 100%
        );
        width: 17.8rem;
        height: 6rem;
        transform: translate(-120px, 0) rotate(45deg);
        transition: transform 0.8s ease-out;
      }

      &.active::after {
        transform: translate(120px, 0) rotate(45deg);
      }
    }

    ${Icon},
    ${Image} {
      flex-grow: 1;
    }
  }

  .coupon-info {
    ${({ theme }) => theme.mixin.wordBreak()};
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    min-height: 8.8rem;
    margin-left: ${({ theme }) => theme.spacing.s4};

    .title {
      display: block;
      font-size: ${({ theme }) => theme.fontSize.s18};
      font-weight: bold;
      line-height: 1.1934;
    }

    .name {
      ${({ theme }) => theme.mixin.multilineEllipsis(2, 18)}
      width: 100%;
      margin-top: ${({ theme }) => theme.spacing.s2};
      font-size: ${({ theme }) => theme.fontSize.s15};
    }

    .policy {
      display: block;
      overflow: hidden;
      margin-top: ${({ theme }) => theme.spacing.s4};
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textTertiary};

      &-item {
        &:before {
          display: inline-block;
          width: 0.1rem;
          height: 1.2rem;
          margin: ${({ theme }) => `0 ${theme.spacing.s8}`};
          background: ${({ theme }) => theme.color.backgroundLayout.line};
          content: '';
        }

        &:first-child:before {
          display: none;
        }
      }
    }

    .expiry {
      display: block;
      margin-top: ${({ theme }) => theme.spacing.s8};
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textTertiary};

      &.is-less-week {
        font-weight: bold;
        color: ${({ theme }) => theme.color.semantic.noti};
      }

      &.is-month {
        font-weight: bold;
      }
    }
  }
`;
