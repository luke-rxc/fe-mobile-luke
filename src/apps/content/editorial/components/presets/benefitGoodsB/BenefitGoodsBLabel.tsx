import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { LabelLiveOnly, LabelLivePrizm, LabelPrizmOnly, LottieRef } from '@pui/lottie';

export type BenefitGoodsBTagProps = HTMLAttributes<HTMLDivElement> & {
  prizmOnly: boolean;
  liveOnly: boolean;
};

const BenefitGoodsBLabelComponent = forwardRef<HTMLDivElement, BenefitGoodsBTagProps>(
  ({ className, prizmOnly, liveOnly }, ref) => {
    const lottieRef = useRef<LottieRef>(null);
    const containerElRef = useRef<HTMLDivElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [inView, setInView] = useState(false);

    const handleIntersectionObserver = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.current && observer.current.disconnect();
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const containerRef = useCallback((el) => {
      if (!el || containerElRef.current) return;

      observer.current = new IntersectionObserver(handleIntersectionObserver, {
        threshold: 0,
      });
      observer.current.observe(el);
      containerElRef.current = el;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const obs = observer.current;
      return () => {
        obs && obs.disconnect();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (inView && lottieRef.current) {
        const { player } = lottieRef.current;
        setTimeout(() => {
          player?.play();
        }, 100);
      }
    }, [inView]);

    return (
      <div ref={ref} className={className}>
        {(prizmOnly || liveOnly) && (
          <div className="label-wrapper" ref={containerRef}>
            <div
              className={classNames('lottie-wrapper', {
                'is-both': liveOnly && prizmOnly,
                'is-prizm-only': !liveOnly && prizmOnly,
                'is-live-only': liveOnly && !prizmOnly,
              })}
            >
              <>
                {liveOnly && prizmOnly && (
                  <LabelLivePrizm ref={lottieRef} animationOptions={{ loop: false, autoplay: false }} />
                )}
                {!liveOnly && prizmOnly && (
                  <LabelPrizmOnly ref={lottieRef} animationOptions={{ loop: false, autoplay: false }} />
                )}
                {liveOnly && !prizmOnly && (
                  <LabelLiveOnly ref={lottieRef} animationOptions={{ loop: false, autoplay: false }} />
                )}
              </>
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 혜택 상품 B 태그
 */
export const BenefitGoodsBLabel = styled(BenefitGoodsBLabelComponent)`
  & .label-wrapper {
    padding: 1rem 0rem;
    & .lottie-wrapper {
      &.is-both {
        width: 19.8rem;
        height: 2rem;
      }
      &.is-prizm-only {
        width: 11.4rem;
        height: 2rem;
      }
      &.is-live-only {
        width: 10.4rem;
        height: 2rem;
      }
    }
  }
`;
