import React, { useState, useEffect, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { Swiper } from 'swiper/types';
import classnames from 'classnames';
import { Theme } from '@styles/theme';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { EventBannerItem, EventBannerItemProps } from './EventBannerItem';

export interface EventBannerListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** 배너 리스트 */
  list: EventBannerItemProps[];
  /** 배너 Swiper시 Indexing을 받을 수 있는 Callback */
  onIndexChange?: (index: number) => void;
  /** 리스트 탭시 리스트 정보를 받을 수 있는 Callback */
  onClick?: EventBannerItemProps['onClick'];
  /** Background 테마 색상(theme color) */
  bgColor?: keyof Theme['color'];
}

const EventBannerListComponent = forwardRef<HTMLDivElement, EventBannerListProps>(
  ({ list, onIndexChange: handleIndexChange, onClick: handleClick, bgColor, className, ...props }, ref) => {
    const [inView, setInView] = useState<boolean>(false);
    const element = useRef<HTMLDivElement>(null);
    const isMultipleList = list.length > 1;

    const handleActiveIndexChange = (swiper: Swiper) => {
      const { realIndex } = swiper;
      handleIndexChange?.(realIndex);
    };

    /**
     * Intersection Observer 콜백함수
     */
    const onIntersect = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    };

    /**
     * Intersection Observer 구독/해제
     */
    useEffect(() => {
      let observer: IntersectionObserver;

      if (element.current) {
        observer = new IntersectionObserver(onIntersect, { threshold: 0.8 });
        observer.observe(element.current);
      }

      return () => observer && observer.disconnect();
    }, []);

    return (
      <div
        ref={element}
        className={classnames(className, {
          multiple: isMultipleList,
        })}
        {...props}
      >
        <SwiperContainer
          slidesPerView={1}
          effect="fade"
          pagination={
            isMultipleList
              ? {
                  clickable: false,
                }
              : false
          }
          fadeEffect={{ crossFade: true }}
          onActiveIndexChange={handleActiveIndexChange}
          loop={isMultipleList}
          ref={ref}
        >
          {list.map((item, index) => {
            return (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <EventBannerItem
                    {...item}
                    pseudoActive={list.length === 1}
                    active={inView && isActive}
                    onClick={handleClick}
                    idx={index}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </SwiperContainer>
      </div>
    );
  },
);

/**
 * #### Figma의 Banner ([Interaction Guide 문서 링크](https://www.notion.so/rxc/Interaction-Guide-9095d540ceda4a33b781678f523951e6#93b435edd1454354b69b6d5b68dfd599))
 * ###### Proto Example Router : /proto/banner
 */
export const EventBannerList = styled(EventBannerListComponent)`
  ${({ theme, bgColor }) => `background: ${bgColor ? theme.color[bgColor] : 'inherit'}`};
  padding: ${({ theme }) => `${theme.spacing.s8} 0 ${theme.spacing.s24} 0`};

  &.multiple {
    padding-bottom: 4.4rem;
  }

  .swiper.swiper-fade {
    overflow: initial !important;
  }

  /** Swiper Moving(Touch Move)도중에는 효과를 보여주지 않음 */
  .swiper-slide-active {
    opacity: 1 !important;
  }
  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0 !important;
  }

  .swiper-pagination-bullets {
    bottom: -2rem !important;
    padding: 0 !important;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
  }

  .swiper-pagination-bullet {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 !important;
    margin-right: 0.8rem !important;
  }

  .swiper-pagination-bullet:last-child {
    margin: 0 !important;
  }
`;
