/* Cspell:disable */
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Swiper, SwiperProps } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, FreeMode, EffectFade } from 'swiper';
import 'swiper/swiper-bundle.min.css';

/**
 * https://swiperjs.com/react
 * swiper 공통 적용 모듈
 * Navigation: https://swiperjs.com/swiper-api#navigation
 * Pagination: https://swiperjs.com/swiper-api#pagination
 * Scrollbar: https://swiperjs.com/swiper-api#scrollbar
 * Autoplay: https://swiperjs.com/swiper-api#autoplay
 * Fade: https://swiperjs.com/swiper-api#fade-effect
 */
SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, FreeMode, EffectFade]);

export type SwiperContainerProps = SwiperProps & {
  /** 스와이퍼 컨트롤러 커스텀 테마 옵션 */
  controlTheme?: SwiperControlTheme;
};

const SwiperContainerComponent = forwardRef<HTMLDivElement, SwiperContainerProps>(
  ({ children, className, controlTheme, ...props }, ref) => {
    return (
      <div ref={ref} className={className}>
        <Swiper {...props}>{children}</Swiper>
      </div>
    );
  },
);

/**
 * swiper를 생성하기 위한 공통 swiper 컨테이너 컴포넌트
 */
export const SwiperContainer = styled(SwiperContainerComponent)`
  --swiper-theme-color: ${({ controlTheme, theme }) => controlTheme?.color ?? theme.color.brand.tint};
  line-height: 0;
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    bottom: 0;
    padding-bottom: 1.6rem;
  }

  .swiper-pagination-bullet {
    position: relative;
    background-color: ${({ controlTheme, theme }) => controlTheme?.color ?? theme.color.gray20};
    opacity: ${({ controlTheme }) => (controlTheme ? 0.3 : 0.6)};
    transition: all 0.2s ease-out;

    &.swiper-pagination-bullet-active {
      background-color: ${({ controlTheme, theme }) => controlTheme?.color ?? theme.color.brand.tint};
      border-radius: 3rem;
      opacity: 1;
    }
  }

  .swiper-pagination:before {
    ${({ controlTheme }) => {
      if (controlTheme?.paginationOverlay) {
        const overlay = controlTheme.paginationOverlay;
        if (overlay === 'white' || overlay === 'black') {
          const bgColorNum = overlay === 'white' ? 255 : 0;
          const toOpacity = overlay === 'white' ? 1 : 0.4;
          return css`
            background: linear-gradient(
              rgba(${bgColorNum}, ${bgColorNum}, ${bgColorNum}, 0),
              rgba(${bgColorNum}, ${bgColorNum}, ${bgColorNum}, ${toOpacity})
            );
            position: absolute;
            bottom: 0;
            display: block;
            width: 100%;
            height: 9.6rem;
            pointer-events: none;
            content: '';
          `;
        }
        return null;
      }
      return null;
    }}
  }

  /** Swiper Version 업데이트 및 성능관련 추가 CSS 삽입 */
  .swiper-container {
    overflow: hidden;
  }
  .swiper-slide {
    -webkit-overflow-scrolling: touch !important;
    backface-visibility: hidden;
    ${({ effect }) => {
      if (effect === 'fade') {
        return `
          background-position: center;
          background-size: cover;
        `;
      }
      return 'transform: translate3d(0, 0, 0) !important;';
    }}
  }
  .swiper-wrapper {
    transform-style: preserve-3d !important;
  }
`;

/**
 * navigation, pagination, scrollbar 관련 테마
 */
type SwiperControlTheme = {
  /** 테마 컬러 코드 */
  color?: string;
  /**  페이지네이션 오버레이 - 백그라운드 그라데이션 적용 */
  paginationOverlay?: 'white' | 'black' | '';
};
/* Cspell:enable */
