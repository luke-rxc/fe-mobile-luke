import styled, { createGlobalStyle } from 'styled-components';
import classNames from 'classnames';
import { RefObject } from 'react';
import { Divider } from '@pui/divider';
import { Button } from '@pui/button';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { SeatAreaCarousel } from './SeatAreaCarousel';
import { SeatInfoModel, SelectSeatHandlerProps } from '../models';
import { SeatMap } from './SeatMap';
import { AreaSchema, LayoutSchema } from '../schemas';
import { SeatTypeFloating } from './SeatTypeFloating';
import { SeatImageViewer } from './SeatImageViewer';

interface SeatPickerProps {
  data: SeatInfoModel;
  handleCompleteSeatPicker: (scheduleId: number | undefined) => void;
  isSeatLockLoading: boolean;
  handleChangeArea: (item: AreaSchema) => void;
  handleSelectSeat: ({ seatData, callback }: SelectSeatHandlerProps) => void;
  handleScrollSeatMap: () => void;
  selectedSeats: LayoutSchema[];
  imageOverlayRef: RefObject<HTMLDivElement>;
  showSeatTypeFloating: boolean;
}

const DisableBodyScroll = createGlobalStyle`
  body {
    overflow: hidden !important;
  }
`;

export const SeatPicker = ({
  data,
  handleCompleteSeatPicker,
  isSeatLockLoading,
  handleChangeArea,
  handleSelectSeat,
  handleScrollSeatMap,
  selectedSeats,
  imageOverlayRef,
  showSeatTypeFloating,
}: SeatPickerProps) => {
  const { isApp } = useDeviceDetect();
  const NotifiedMaxCount = 11;
  const ableCountClassName = classNames('able-count-layout', {
    'is-mweb': !isApp,
    notified: data.selectedArea && data.selectedArea.orderAbleLayoutCount < NotifiedMaxCount,
  });
  return (
    <WrapperStyled className={isApp ? 'is-app' : ''}>
      {isApp && <DisableBodyScroll />}
      <SeatImageViewer imageData={data.image} imageOverlayRef={imageOverlayRef} />
      {data && data.selectedArea && (
        <>
          {data.showAreaTab ? (
            <CarouselStyled className={isApp ? 'is-app' : ''}>
              <SeatAreaCarousel
                data={data.areaList}
                isShowAreaTab={data.showAreaTab}
                selectedArea={data.selectedArea}
                handleChangeArea={handleChangeArea}
              />
            </CarouselStyled>
          ) : (
            <div className={ableCountClassName}>
              <span>
                {data.selectedArea?.orderAbleLayoutCount !== 0
                  ? `${data.selectedArea?.orderAbleLayoutCount}석`
                  : '매진'}
              </span>
            </div>
          )}
        </>
      )}
      <Divider className="divider" />
      <SeatMap
        items={data.layouts}
        isDisplayStage={data.displayStage}
        isShowAreaTab={data.showAreaTab}
        selectedArea={data.selectedArea}
        handleSelectSeat={handleSelectSeat}
        handleScrollSeatMap={handleScrollSeatMap}
      />
      <CtaWrapper>
        <SeatTypeFloating items={data.floatingObjects} showSeatTypeFloating={showSeatTypeFloating} />
        <Button
          variant="primary"
          size="large"
          bold
          disabled={selectedSeats.length === 0}
          onClick={() => handleCompleteSeatPicker(data.selectedArea?.scheduleId)}
          loading={isSeatLockLoading}
        >
          완료
        </Button>
      </CtaWrapper>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  &.is-app {
    height: calc(100vh - env(safe-area-inset-top));
  }

  .divider {
    height: 0.1rem;
    background: ${({ theme }) => theme.color.backgroundLayout.line};
    &::after {
      height: 0;
    }
  }

  .able-count-layout {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.9rem;
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.mini};
    &.is-mweb {
      justify-content: flex-start;
      padding-left: ${({ theme }) => `${theme.spacing.s24}`};
    }
    &.notified {
      color: ${({ theme }) => theme.color.semantic.noti};
    }
  }
`;

const CarouselStyled = styled.div`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s24}`};
  overflow: hidden;
  &.is-app {
    padding-top: 0;
  }
`;

const CtaWrapper = styled.div`
  position: fixed;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  left: 0;
  width: 100%;
  padding: 0 2.4rem;

  ${Button} {
    width: 100%;
  }
`;
