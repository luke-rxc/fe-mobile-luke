import styled from 'styled-components';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { Button } from '@pui/button';
import { MoreLabel } from '@constants/ui';
import { LiveActionType, SCHEDULE_MORE_VIEW_COUNT } from '../constants';
import { ScheduleItemModel } from '../models';
import { ScheduleItem, ScheduleItemProps } from './ScheduleItem';

interface Props extends Omit<ScheduleItemProps, 'item'> {
  items: Array<ScheduleItemModel> | undefined;
  showMore?: boolean;
}

const carouselOption: SwiperContainerProps = {
  loop: false,
  slidesPerView: 'auto',
  cssMode: false,
  centeredSlides: false,
  freeMode: true,
  watchSlidesProgress: true,
};

export const ScheduleItems = ({
  items,
  showMore = true,
  onClickUserAction: handleClickUserAction,
  ...props
}: Props) => {
  if ((items ?? []).length === 0) {
    return (
      <EmptyWrapperStyled>
        <EmptyStyled>등록된 콘텐츠가 없습니다</EmptyStyled>
      </EmptyWrapperStyled>
    );
  }
  const showMoreButton = SCHEDULE_MORE_VIEW_COUNT <= (items || []).length;

  return (
    <>
      <CarouselStyled {...carouselOption} className="swiper-mode">
        {(items ?? []).map((item, index) => {
          return (
            <SwiperSlide key={`carousel-${index.toString()}`}>
              <ScheduleItem {...props} item={item} onClickUserAction={handleClickUserAction} />
            </SwiperSlide>
          );
        })}
      </CarouselStyled>
      {showMore && (
        <ActionWrapperStyled>
          {showMoreButton && (
            <Button
              block
              bold
              variant="tertiaryline"
              size="large"
              onClick={handleClickUserAction(LiveActionType.LIVE_SCHEDULE_ALL)}
            >
              {MoreLabel}
            </Button>
          )}
        </ActionWrapperStyled>
      )}
    </>
  );
};

const CarouselStyled = styled(SwiperContainer)<SwiperContainerProps>`
  img {
    width: 100%;
    vertical-align: middle;
  }

  &.swiper-mode {
    & .swiper {
      padding-left: 1.6rem;
      padding-right: 1.6rem;
    }
    & .swiper-slide {
      width: calc((100vw - 8rem) / 2 + 1.6rem);
      max-width: 18.3rem;
    }
  }
`;

const ActionWrapperStyled = styled.div`
  min-height: 8rem;
  font: ${({ theme }) => theme.fontType.t20B};
  padding: 0 2.4rem 2.4rem;
  user-select: none;
`;

const EmptyWrapperStyled = styled.div`
  padding: 0 0 2.4rem;
`;
const EmptyStyled = styled.div`
  font: ${({ theme }) => theme.fontType.t14};
  color: ${({ theme }) => theme.color.gray20};
  text-align: center;
  padding: 1.2rem 0;
  user-select: none;
`;
