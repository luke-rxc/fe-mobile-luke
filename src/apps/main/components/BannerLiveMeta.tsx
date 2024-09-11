/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { Equalizer, LottieRef } from '@pui/lottie';

/**
 * 슬라이드 타이틀 모션
 */
const slideAnimation = keyframes`
 from { transform: translate3d(0, 0, 0); }
 to { transform: translate3d(-100%, 0, 0); }
`;

/**
 * 슬라이드 타이틀 좌측 그라디언트 마스크 노출 모션
 */
const slideMaskAnimation = keyframes`
 from { mask-size: calc(100% + 35px) 100%; }
 to { mask-size: 100% 100%; }
`;

/**
 * padding을 제외한 순수한 콘텐츠 width를 반환
 */
const getContentWidth = (element?: Element | null) => {
  if (element) {
    const styles = getComputedStyle(element);
    return element.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  }

  return 0;
};

/**
 * 콘텐츠(텍스트) 길이에 따른 상대적 애니메이션 속도값을 반환
 */
const getDurationCss = (contentWidth: number): Pick<React.CSSProperties, 'animationDuration'> => {
  /**
   * 1초에 30px을 이동
   */
  const duration = (contentWidth / 30).toFixed(2);
  return { animationDuration: `${duration}s` };
};

export interface BannerLiveMetaProps extends React.HTMLAttributes<HTMLSpanElement> {
  title: string;
}

/**
 * BannerLiveMeta
 */
export const BannerLiveMeta = styled(
  forwardRef<HTMLSpanElement, BannerLiveMetaProps>(({ title, className, ...props }, ref) => {
    const lottie = useRef<LottieRef>(null);
    const container = useRef<HTMLSpanElement>(null);
    const typography = useRef<HTMLSpanElement>(null);

    const [inView, setInViewState] = useState<boolean>(false);
    const [isSlide, setSlideState] = useState<boolean>(false);
    const [maskControlCss, setMaskControlCss] = useState<React.CSSProperties>({});
    const [slideControlCss, setSlideControlCss] = useState<React.CSSProperties>({});

    const classNames = classnames(className, {
      'is-view': inView,
      'is-slide': isSlide,
    });

    /**
     * 이퀄라이저 로띠 애니메이션이 끝나면 특정 지점에서 다시 재생
     */
    const handleAnimationEndOfEqualizer = useCallback(() => {
      lottie.current?.player?.goToAndPlay(28, true);
    }, []);

    /**
     * IntersectionObserver 변화에 따른 이벤트 핸들러
     */
    const handleChangeIntersectionView = ([entry]: IntersectionObserverEntry[]) => {
      setInViewState(entry.isIntersecting);
    };

    /**
     * IntersectionObserver 세팅
     */
    useEffect(() => {
      let observer: IntersectionObserver;

      if (container.current) {
        observer = new IntersectionObserver(handleChangeIntersectionView, { threshold: 1 });
        observer.observe(container.current);
      }

      return () => observer && observer.disconnect();
    }, []);

    /**
     * inView에 따른 로띠 애니메이션 제어
     */
    useEffect(() => {
      const player = lottie.current?.player;

      if (player) {
        player.addEventListener('complete', handleAnimationEndOfEqualizer);
        inView && player.isPaused ? player.play() : player.pause();
      }

      return () => {
        player?.removeEventListener('complete', handleAnimationEndOfEqualizer);
      };
    }, [inView]);

    /**
     * 타이틀의 슬라이딩 여부 결정과 애니메이션 초기화
     */
    useLayoutEffect(() => {
      if (typography.current) {
        const { firstChild, offsetWidth } = typography.current;
        const contentWidth = getContentWidth(firstChild as Element);
        const isLongContent = contentWidth > offsetWidth;

        // 이퀄라이져 애니메이션 처음부터 다시 실행
        lottie.current?.player?.goToAndPlay(0);

        if (isLongContent) {
          setSlideState(true);

          requestAnimationFrame(() => {
            // 타이틀이 변경되었을때 애니메이션이 처음 부터 다시시작을 위한 초기화
            setMaskControlCss({ animation: 'none' });
            setSlideControlCss({ animation: 'none' });

            requestAnimationFrame(() => {
              setMaskControlCss({});
              setSlideControlCss(getDurationCss(contentWidth));
            });
          });
        } else {
          setSlideState(false);
          setSlideControlCss({});
        }
      }
    }, [title]);

    /**
     * ref setting
     */
    useImperativeHandle(ref, () => container.current as HTMLSpanElement);

    return (
      <span ref={container} className={classNames} {...props}>
        <span className="decoration">
          <Equalizer ref={lottie} width="2.4rem" height="2.4rem" animationOptions={{ loop: false, autoplay: false }} />
        </span>

        <span ref={typography} className="title" style={maskControlCss}>
          <span className="text" style={slideControlCss} children={title} />
          {isSlide && <span className="text" style={slideControlCss} children={title} />}
        </span>
      </span>
    );
  }),
)`
  display: flex;
  align-items: center;
  justify-content: left;
  overflow: hidden;
  opacity: 0;

  .decoration {
    display: block;
    flex-shrink: 0;
    margin-right: 0.4rem;
    line-height: 0;

    ${Equalizer} *[fill] {
      fill: ${({ theme }) => theme.color.gray70};
    }

    ${Equalizer} *[stroke] {
      stroke: ${({ theme }) => theme.color.gray70};
    }
  }

  .title {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    color: ${({ theme }) => theme.color.gray70};
    font: ${({ theme }) => theme.fontType.mini};
    -webkit-text-size-adjust: none;

    .text {
      display: block;
      padding-right: 2.4rem;
    }
  }

  &.is-slide {
    .title {
      mask-position: right;
      mask-size: calc(100% + 35px) 100%;
      mask-image: linear-gradient(
        270deg,
        transparent 0px,
        rgba(0, 0, 0, 1) 35px,
        rgba(0, 0, 0, 1) calc(100% - 35px),
        transparent 100%
      );
      animation: ${slideMaskAnimation} 0.5s linear 1s forwards;
      animation-play-state: paused;

      .text {
        animation-name: ${slideAnimation};
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-play-state: paused;
        animation-delay: 1s;
      }
    }
  }

  &.is-view {
    .title,
    .title .text {
      animation-play-state: running;
    }
  }
`;
