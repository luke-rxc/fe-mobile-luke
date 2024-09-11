import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, TouchEvent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { convertHexToRGBA } from '@utils/color';
import type { ReviewDetailModel } from '../models';
import { ReviewDetailContent } from './ReviewDetailContent';
import { ReviewDetailGoods } from './ReviewDetailGoods';

export type ReviewDetailFloatingProps = HTMLAttributes<HTMLDivElement> & {
  review: ReviewDetailModel;
  onClickContent: (e: MouseEvent<HTMLDivElement>) => void;
  onReportReview: () => void;
};
const ReviewDetailFloatingComponent = forwardRef<HTMLDivElement, ReviewDetailFloatingProps>(
  ({ className, review, onClickContent, onReportReview }, ref) => {
    const { content, goods } = review;
    const [isActive, setIsActive] = useState(false);
    const [isTop, setIsTop] = useState(true);
    const { isAndroid } = useDeviceDetect();
    const timeId = useRef<NodeJS.Timeout | null>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    /**
     * 더보기 옵션이 열려있거나 svg 요소가 클릭 된 경우에는 press 효과를 적용하지 않는다.
     */
    const handleModalTouchStart = ({ target, currentTarget }: TouchEvent<HTMLDivElement>) => {
      const dropMenuEl = currentTarget.querySelector('.drop-options');
      const targetEl = target as HTMLElement;
      const moreBtnEl =
        !!(targetEl.tagName === 'circle' || targetEl.tagName === 'svg') || targetEl.classList.contains('btn-more');

      if (dropMenuEl || moreBtnEl) {
        return;
      }
      setIsActive(true);
    };

    const handleModalTouchEnd = () => {
      setIsActive(false);
    };

    const handleScroll = () => {
      const top = window.scrollY;
      setIsTop(top < 24);
    };

    const modalElRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useCallback((el) => {
      if (!el || modalElRef.current) return;
      modalElRef.current = el;

      setContentHeight(el.offsetHeight);
    }, []);

    useEffect(() => {
      const modalEl = modalElRef.current;
      if (!modalEl) return;
      if (timeId.current) clearTimeout(timeId.current);
      if (isTop) {
        const duration = isAndroid ? 600 : 800;
        modalEl.style.display = 'block';
        modalEl.style.animationName = 'bouncing';
        modalEl.style.animationDuration = `${duration}ms`;
      } else {
        const duration = isAndroid ? 200 : 400;
        modalEl.style.animationName = 'bouncing-out';
        modalEl.style.animationDuration = `${duration}ms`;
        modalEl.style.animationTimingFunction = `cubic-bezier(0.24, 0.79, 0.57, 0.97)`;

        timeId.current = setTimeout(() => {
          modalEl.style.display = 'none';
        }, duration);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTop]);

    useEffect(() => {
      window.addEventListener('scroll', handleScroll, false);
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll, false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className={classNames(className, {
          'is-aos': isAndroid,
        })}
        ref={ref}
      >
        <FloatingContentStyled ref={modalRef} viewHeight={contentHeight}>
          <div
            className={classNames('review-info modal', {
              'is-active': isActive,
            })}
            onTouchStart={handleModalTouchStart}
            onTouchEnd={handleModalTouchEnd}
            onClick={onClickContent}
          >
            <ReviewDetailContent review={content} modalType onReportReview={onReportReview} />
          </div>
          {goods && <ReviewDetailGoods className="modal" id={content.id} goods={goods} />}
        </FloatingContentStyled>
      </div>
    );
  },
);

export const ReviewDetailFloating = styled(ReviewDetailFloatingComponent)`
  ${({ theme }) => theme.mixin.fixed({ b: 'env(safe-area-inset-bottom)', l: 0, r: 0 })};
`;

const FloatingContentStyled = styled('div').attrs(({ viewHeight }: { viewHeight: number }) => {
  return { viewHeight };
})`
  @keyframes bouncing {
    40% {
      transform: translate3d(0rem, -0.6rem, 0rem);
    }

    100% {
      transform: translate3d(0rem, 0rem, 0rem);
    }
  }

  @keyframes bouncing-out {
    0% {
      transform: translate3d(0rem, 0rem, 0rem);
    }

    100% {
      transform: ${({ viewHeight }) => `translate3d(0rem, calc(env(safe-area-inset-bottom) + ${viewHeight}px), 0rem)`};
    }
  }

  width: 100%;
  padding: 0.8rem;
  transform: ${({ viewHeight }) => `translate3d(0rem, calc(env(safe-area-inset-bottom) + ${viewHeight}px), 0rem)`};
  animation-fill-mode: forwards;

  & .modal {
    border-radius: ${({ theme }) => theme.radius.r12};
    background: ${({ theme }) => convertHexToRGBA(theme.color.whiteVariant1, 0.6)};
    box-shadow: 0 0.2rem 3.2rem rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4rem);
  }

  &.is-aos {
    .modal {
      background: ${({ theme }) => convertHexToRGBA(theme.color.whiteVariant1, 0.95)};
      backdrop-filter: none;
    }
  }

  & .review-info {
    transition: all 0.2s;

    &.is-active {
      transform: scale(0.96);

      &::before {
        z-index: 4;
        ${({ theme }) => theme.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        border-radius: ${({ theme }) => theme.radius.r12};
        background: ${({ theme }) => convertHexToRGBA(theme.color.black, 0.03)};
        content: '';
      }
    }
  }
  ${ReviewDetailContent} {
    & .content {
      padding: 0.8rem 2.4rem 2.4rem 2.4rem;
    }
  }

  ${ReviewDetailGoods} {
    margin-top: 0.8rem;
  }
`;
