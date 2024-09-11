import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Checkmark } from '@pui/icon';
import { convertHexToRGBA } from '@utils/color';
import { useDDay } from '@services/useDDay';
import { toDateFormat } from '@utils/date';
import { toHHMMSS } from '@utils/toTimeformat';
import type { CouponCardModel } from '../../models';
import { usePresetViewSizeService } from '../../services';
import { FakeView } from './FakeView';

export type CouponCardProps = HTMLAttributes<HTMLDivElement> &
  CouponCardModel & {
    /** 스티키 모션 적용여부 */
    isSticky?: boolean;
    /** 쿠폰이 위치할 타일 뎁스 */
    tileDepth?: number;
    /** 카드 기본 노출 영역 */
    visibleView?: number;
    /** 타일 뎁스별 노출 사이즈 */
    tileStepValue?: number;
    /** 인트로 카드로 노출 여부 */
    intro?: boolean;
  };
const CouponCardComponent = forwardRef<HTMLDivElement, CouponCardProps>(
  (
    {
      className,
      title,
      label,
      benefitPrice,
      benefitUnit,
      startDateTime,
      endDateTime,
      downloaded = false,
      remain = true,
      isSticky = false,
      tileDepth = 0,
      visibleView = 128,
      tileStepValue = 16,
      intro = false,
      displayDateTime,
    },
    ref,
  ) => {
    const { viewRef, handleGetViewSize } = usePresetViewSizeService();
    const couponRef = useRef<HTMLDivElement>(null);
    const isStarted = useMemo(() => {
      const targetData = displayDateTime ? new Date(displayDateTime).getTime() : new Date().getTime();
      return startDateTime <= targetData;
    }, [displayDateTime, startDateTime]);

    const {
      remainDay,
      countDown,
      handleReset: handleResetTimer,
    } = useDDay(isStarted ? { time: endDateTime, enabled: true } : { time: -1, enabled: false });

    const [displayTime, setDisplayTime] = useState('');
    const [overlayOpacity, setOverlayOpacity] = useState<number>(1);
    const [textOpacity, setTextOpacity] = useState<number>(isSticky && tileDepth === 0 ? 0 : 1);

    useEffect(() => {
      if (!isStarted) {
        setDisplayTime(`${toDateFormat(startDateTime, 'yyyy. MM. dd')} 오픈 예정`);
        return;
      }

      let time = '';
      if (remainDay > 30) {
        time = `~ ${toDateFormat(endDateTime, 'yyyy. MM. dd')}`;
      } else if (remainDay > 0) {
        time = `D-${remainDay}`;
      } else if (countDown > 0) {
        time = toHHMMSS(countDown);
      } else {
        time = '';
      }
      setDisplayTime(time);
    }, [isStarted, remainDay, startDateTime, countDown, endDateTime]);

    const handleChangeScroll = useCallback(() => {
      const couponEl = couponRef.current;
      if (!couponEl) return;
      const couponScrollY = couponEl.getBoundingClientRect().top;
      const overlayOpacityStart = 1; // 오버레이 bg 투명도 시작값
      const overlayOpacityEnd = 0; // 오버레이 bg 투명도 종료값
      const textOpacityStart = 0; // 텍스트 영역 투명도 시작값
      const textOpacityEnd = 1; // 텍스트 영역 투명도 종료값
      const step = tileStepValue * tileDepth; // 16 단위로 뎁스별 카드 노출

      // 스크롤시 오버레이, 텍스트 오퍼시티 변화 계산
      const viewSize = handleGetViewSize();
      const cardStartY = viewSize - (visibleView + step);
      const cardEndY = viewSize - (visibleView + step + couponEl.offsetHeight);

      let targetOverlayOpacity =
        ((overlayOpacityStart - overlayOpacityEnd) * (couponScrollY - cardEndY)) / (cardStartY - cardEndY) +
        overlayOpacityEnd;
      targetOverlayOpacity = Math.max(Math.min(+targetOverlayOpacity.toFixed(2), 1), 0);

      let targetTextOpacity =
        ((textOpacityStart - textOpacityEnd) * (couponScrollY - cardEndY)) / (cardStartY - cardEndY) + textOpacityEnd;
      targetTextOpacity = Math.max(Math.min(+targetTextOpacity.toFixed(2), 1), 0);

      setOverlayOpacity(targetOverlayOpacity);
      if (tileDepth === 0) {
        setTextOpacity(intro ? 0 : targetTextOpacity);
      }
    }, [tileStepValue, tileDepth, handleGetViewSize, visibleView, intro]);

    const handleIntersectionObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', handleChangeScroll);
          } else {
            window.removeEventListener('scroll', handleChangeScroll);
          }
        });
      },
      [handleChangeScroll],
    );

    const handleChangeVisible = useCallback(() => {
      handleResetTimer();
    }, [handleResetTimer]);

    useEffect(() => {
      let observer: IntersectionObserver;

      if (couponRef.current && isSticky) {
        observer = new IntersectionObserver(handleIntersectionObserver, {
          threshold: 0,
        });
        observer.observe(couponRef.current);
      }

      return () => {
        observer && observer.disconnect();
        window.removeEventListener('scroll', handleChangeScroll);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      // 페이지 뷰 변경 될때 상태 체크
      window.addEventListener('visibilitychange', handleChangeVisible);
      return () => {
        window.removeEventListener('visibilitychange', handleChangeVisible);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={ref} className={classNames(`${className} tile-depth${tileDepth + 1}`)}>
        <div className="shadow" style={{ opacity: overlayOpacity }} />
        <div className="coupon-card" ref={couponRef}>
          <div className="overlay" style={{ opacity: overlayOpacity }} />
          <div
            className={classNames('coupon-box', {
              'is-downloaded': downloaded,
              'is-runout': !remain,
            })}
            style={{ opacity: textOpacity }}
          >
            <div className="coupon-text">
              <div className="title">{title}</div>
              {label && <div className="sub-title">{label}</div>}
              {!downloaded && remain && displayTime && <div className="date">{displayTime}</div>}
              <div className="benefit">
                <span className="price">{benefitPrice}</span>
                <span className="unit">{benefitUnit}</span>
              </div>
            </div>
            <div className="state">
              <div className="state-inner">
                <>
                  {downloaded && (
                    <>
                      <Checkmark />
                      받기 완료
                    </>
                  )}
                  {!downloaded && !remain && <>쿠폰 소진</>}
                </>
              </div>
            </div>
          </div>
        </div>
        <FakeView ref={viewRef} />
      </div>
    );
  },
);

/**
 * 쿠폰 카드 컴포넌트
 */
export const CouponCard = styled(CouponCardComponent)`
  position: relative;
  width: 100%;
  background-color: ${({ background, theme }) => background || theme.color.brand.tint};
  border-radius: ${({ theme }) => theme.radius.r8};
  color: ${({ color, theme }) => color || theme.color.white};
  & .shadow {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    box-shadow: 0rem 0.4rem 2.4rem rgba(0, 0, 0, 0.12);
    border-radius: ${({ theme }) => theme.radius.r8};
  }
  & .coupon-card {
    height: 14.4rem;
  }
  & .overlay {
    opacity: 1;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.radius.r8};
    transition: opacity 0.1s;
  }
  &.tile-depth2 .overlay {
    background: ${({ background, theme }) =>
      `${
        !background || background === '#000000'
          ? convertHexToRGBA(theme.color.white, 0.1)
          : convertHexToRGBA(theme.color.black, 0.1)
      }`};
  }
  &.tile-depth3 .overlay {
    background: ${({ background, theme }) =>
      `${
        !background || background === '#000000'
          ? convertHexToRGBA(theme.color.white, 0.2)
          : convertHexToRGBA(theme.color.black, 0.2)
      }`};
  }
  & .coupon-box {
    position: relative;
    height: 100%;
    opacity: ${({ isSticky }) => (isSticky ? 0 : 1)};

    & .coupon-text {
      opacity: 1;
      padding: 1.6rem 1.6rem 1.2rem 1.6rem;

      & .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font: ${({ theme }) => theme.content.contentStyle.fontType.small};
      }
      & .sub-title {
        margin-top: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font: ${({ theme }) => theme.content.contentStyle.fontType.micro};
      }
      & .date {
        margin-top: 0.8rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      }

      & .benefit {
        position: absolute;
        bottom: 1.2rem;
        right: 1.6rem;
        & .price {
          font: ${({ theme }) => theme.content.contentStyle.fontType.headlineB};
        }
        & .unit {
          margin-left: 0.2rem;
          font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
        }
      }
    }
    & .state {
      display: none;
      & .state-inner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
        ${Checkmark} {
          margin-right: 0.4rem;
        }
      }
    }
    &.is-downloaded {
      & .coupon-text {
        opacity: 0.2;
      }
      & .state {
        display: block;
        & .state-inner {
          margin-left: -0.8rem;
        }
      }
    }
    &.is-runout {
      & .coupon-text {
        opacity: 0.2;
      }
      & .state {
        display: block;
      }
    }
  }
`;
