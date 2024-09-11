import React, { useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import clamp from 'lodash/clamp';
import { Swiper as SwiperClass } from 'swiper/types';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { CategoryShortcutItem, CategoryShortcutItemProps } from './CategoryShortcutItem';

/**
 * 스크롤 진행율에 대한 최소값(overscroll 상황을 고려하여 최소값을 0이 아닌 -2로 세팅)
 */
const MIN_PROGRESS = -2;
/**
 * 스크롤 진행율에 대한 최대값(overscroll 상황을 고려하여 최대값을 1이 아닌 2로 세팅
 */
const MAX_PROGRESS = 2;
/**
 * Parallax시 최소 이동 가능한 translateX 값
 */
const MIN_TRANSLATE = 10;
/**
 * Parallax시 최대 이동 가능한 translateX 값
 */
const MAX_TRANSLATE = 90;
/**
 * 패럴랙스 방향(스크롤반대 방향)
 */
const PARALLAX_DIRECTION = -1;
/**
 * isAllSlideInViewRef를 구하기 위한 오차범위값
 */
const SLIDE_SIZE_ERROR_RANGE = 48;

/**
 * Swiper 인스턴스 객체 타입.
 * 실제로는 제공하는 값이지만 SwiperClass에 정의되지 않은 프로퍼티 추가 정의
 */
type Swiper = SwiperClass & {
  size?: number;
  virtualSize?: number;
};

/**
 * CategoryShortcutListProps
 */
export interface CategoryShortcutListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CategoryShortcutItemProps[];
  onClickCategoryShortcutLink: (item: CategoryShortcutItemProps) => void;
}

export const CategoryShortcutListComponent: React.FC<CategoryShortcutListProps> = ({
  items,
  onClickCategoryShortcutLink: onClickItem,
  ...props
}) => {
  const swiperRef = useRef<Swiper>();
  const containerRef = useRef<HTMLDivElement>(null);
  const centerPosRef = useRef<number[]>([]);
  const isAllSlideInViewRef = useRef<boolean>(false);

  /**
   * swiper 이동거리를 백분율(0 ~ 1) 반환
   */
  const getProgress = (): number => {
    const swiper = swiperRef.current;
    const { virtualSize = 0, translate = 0, progress = 0 } = swiper || {};

    if (!swiper) {
      return 0;
    }

    if (isAllSlideInViewRef.current) {
      /**
       * swiper.translate 값은 스크롤방향의 반대 방향을 취하고 있기 때문에
       * PARALLAX_DIRECTION를 곱하지 않음. 만약 스크롤방향으로 패럴렉스 효과를 주고 싶다면
       * 해당 코드에 -1 을 곱해야함.
       *
       * 1.2를 곱하는 이유는 모든 슬라이드가 보여진 상태에서 오버스크롤을 했을때 패럴렉스 효과를
       * 좀 더 강하게 보여주기 위함
       */
      return (translate / virtualSize) * 1.2;
    }

    return clamp(progress, MIN_PROGRESS, MAX_PROGRESS) * PARALLAX_DIRECTION;
  };

  /**
   * 슬라이드 인덱스에 따라 차등적으로 center position값을 설정
   */
  const updateCenterPosRef = () => {
    const { size = 0, virtualSize = 0, slides } = swiperRef.current || {};
    const length = slides?.length || 0;

    isAllSlideInViewRef.current = Math.abs(size - virtualSize) < SLIDE_SIZE_ERROR_RANGE;

    if (isAllSlideInViewRef.current) {
      centerPosRef.current = new Array(length).fill(0);
      return;
    }

    if (length > 1) {
      const stepSize = 1 / (length - 1);
      const steps = Array.from({ length }, (_, i) => i * stepSize);
      centerPosRef.current = steps;
      return;
    }

    centerPosRef.current = [0];
  };

  /**
   * CategoryShortcutList 컴포넌트 내부에 패럴랙스 효과를 위한 css 변수 세팅
   */
  const updateStyleProperty = (mutation?: MutationRecord) => {
    const swiper = swiperRef.current;
    const container = containerRef.current;
    const centerPos = centerPosRef.current;

    if (!swiper || !container || !centerPos) {
      return;
    }
    const duration = mutation ? (mutation.target as HTMLElement).style.transitionDuration : '0ms';
    const progress = getProgress();

    container.style.setProperty('--duration', duration);
    centerPos.forEach((pos, i) => {
      container.style.setProperty(
        `--progress${i + 1}`,
        `-${clamp((progress + pos + 2) * 25, MIN_TRANSLATE, MAX_TRANSLATE)}%`,
      );
    });
  };

  const handleInitSwiper = (s: SwiperClass) => {
    swiperRef.current = s;
    updateCenterPosRef();
    updateStyleProperty();
  };

  useLayoutEffect(() => {
    const target = swiperRef.current?.$wrapperEl[0];
    const observer = new MutationObserver(([mutation]) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        updateStyleProperty(mutation);
      }
    });

    if (target) {
      observer.observe(target, { attributes: true });
      updateStyleProperty();
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} {...props}>
      <SwiperContainer freeMode slidesPerView="auto" onInit={handleInitSwiper} onResize={handleInitSwiper}>
        {items.map((item, index) => (
          <SwiperSlide
            key={item.id}
            children={<CategoryShortcutItem index={index} onClick={onClickItem} {...item} />}
          />
        ))}
      </SwiperContainer>
    </div>
  );
};

export const CategoryShortcutList = styled(CategoryShortcutListComponent)`
  overflow: hidden;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s32} `};

  .swiper {
    overflow: visible;
    font-size: 0;
  }

  .swiper-slide {
    width: auto;
    padding-right: ${({ theme }) => theme.spacing.s12};

    &:last-child {
      padding-right: 0;
    }
  }
`;
