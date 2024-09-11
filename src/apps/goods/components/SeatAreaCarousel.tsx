import styled from 'styled-components';
import classNames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useRef } from 'react';
import { useWindowSize } from 'react-use';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { SeatAreaCard } from './SeatAreaCard';
import { AreaSchema } from '../schemas';

interface SeatAreaCarouselProps {
  data: AreaSchema[];
  className?: string;
  selectedArea: AreaSchema | undefined;
  isShowAreaTab: boolean;
  handleChangeArea: (item: AreaSchema) => void;
}

export const SeatAreaCarousel = ({
  data,
  className,
  selectedArea,
  isShowAreaTab,
  handleChangeArea,
}: SeatAreaCarouselProps) => {
  const { isIOSWebChrome } = useDeviceDetect();
  const elRef = useRef<HTMLDivElement>(null);
  const { width: screenWidth } = useWindowSize();
  const selectedAreaIndex = data.findIndex((area) => area.scheduleId === selectedArea?.scheduleId);
  const swiperOptions: SwiperContainerProps = {
    slidesPerView: 'auto',
    freeMode: false,
    initialSlide: selectedAreaIndex,
    spaceBetween: 12,
    watchOverflow: true,
    slideToClickedSlide: true,
    centeredSlides: true,
    ...(screenWidth <= 512 && { centeredSlidesBounds: true }),
    ...(isIOSWebChrome && { cssMode: true }),
  };
  const containerClassName = classNames(className, {
    'ios-chrome': isIOSWebChrome,
    'is-single-item': isShowAreaTab && data.length === 1,
  });

  return (
    <div ref={elRef}>
      <SwiperContainerStyled {...swiperOptions} className={containerClassName}>
        {data.map((item, index) => {
          return (
            <SwiperSlide
              key={item.scheduleId.toString()}
              className={classNames('swiper-area-slide-item', {
                'is-last-item': data.length !== 1 && index === data.length - 1,
              })}
            >
              <div className="inner">
                <SeatAreaCard
                  name={item.areaName}
                  count={item.orderAbleLayoutCount}
                  price={item.displayPrice}
                  selected={item.scheduleId === selectedArea?.scheduleId}
                  onClick={() => handleChangeArea(item)}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </SwiperContainerStyled>
    </div>
  );
};

const SwiperContainerStyled = styled(SwiperContainer)`
  &.ios-chrome {
    .swiper {
      backface-visibility: hidden;
      transform: translateZ(0);
      transform: translate3d(0, 0, 0);
    }

    & .swiper-wrapper {
      width: auto;
      padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    }
  }

  &.is-single-item {
    & .swiper {
      & .swiper-wrapper {
        display: flex;
        justify-content: center;
        transform: translate3d(0, 0, 0) !important;
      }
    }
  }

  .swiper {
    display: flex;
    flex-direction: column;
    overflow: visible;
    position: relative;
    .inner {
      width: 100%;
    }

    .swiper-area-slide-item {
      max-height: 6.4rem;
      max-width: 20.8rem;
      height: 6.4rem;
      &.is-last-item {
        margin-right: 6.9rem !important;
      }
    }
  }
`;
