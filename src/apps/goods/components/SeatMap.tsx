import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components';
import { Empty, Stand, Wheelchair } from '@pui/icon';
import { AreaSchema, LayoutSchema } from '../schemas';
import { SelectSeatHandlerProps } from '../models';

interface SeatMapProps {
  items: LayoutSchema[][];
  isDisplayStage: boolean | undefined;
  isShowAreaTab: boolean | null;
  handleSelectSeat: ({ seatData, callback }: SelectSeatHandlerProps) => void;
  handleScrollSeatMap: () => void;
  selectedArea: AreaSchema | undefined;
}

interface SeatItemProps {
  data: LayoutSchema;
  handleSelectedSeats: ({ seatData, callback }: SelectSeatHandlerProps) => void;
}

export const SeatItem = ({ data, handleSelectedSeats }: SeatItemProps) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(false);
  const disabled = !data.enable;
  const iconDefaultProps = {
    size: '2rem',
    // eslint-disable-next-line no-nested-ternary
    colorCode: disabled ? theme.color.text.textDisabled : selected ? theme.color.white : theme.color.black,
  };
  const seatLayoutClassName = classnames('layout-seat', {
    selected,
    disabled,
  });
  const seatLabelClassName = classnames('layout-seat-label', {
    selected,
    disabled,
  });

  const removeSpaceString = (value: string) => {
    return value.replace(/\s/gi, '');
  };

  return (
    <>
      {(data.object === 'SEAT' ||
        data.object === 'PART_VIEW_SEAT' ||
        data.object === 'STANDING' ||
        data.object === 'WHEELCHAIR_SEAT') && (
        <div
          className={seatLayoutClassName}
          onClick={() =>
            handleSelectedSeats({ seatData: data, callback: (isSelectedSeats) => setSelected(!isSelectedSeats) })
          }
        >
          {data.object === 'SEAT' &&
            data.names.map((name) => {
              return (
                <span key={name} className={seatLabelClassName}>
                  {removeSpaceString(name)}
                </span>
              );
            })}
          {data.object === 'PART_VIEW_SEAT' && <Empty {...iconDefaultProps} />}
          {data.object === 'STANDING' && <Stand {...iconDefaultProps} />}
          {data.object === 'WHEELCHAIR_SEAT' && <Wheelchair {...iconDefaultProps} />}
        </div>
      )}
      {data.object === 'OTHER_COMPANY' && (
        <div className={seatLayoutClassName}>
          {data.names.map((name) => {
            return (
              <span key={name} className={seatLabelClassName}>
                {removeSpaceString(name)}
              </span>
            );
          })}
        </div>
      )}
      {data.object === 'BLANK' && <BlankStyled />}
      {data.object === 'WAY_ROW' && <WayRowStyled />}
      {data.object === 'WAY_COL' && <WayColStyled />}
      {data.object === 'WAY_CROSS' && <WayCrossStyled />}
    </>
  );
};

export const SeatMap = ({
  items,
  isDisplayStage,
  isShowAreaTab,
  handleSelectSeat,
  handleScrollSeatMap,
  selectedArea,
}: SeatMapProps) => {
  const seatMapWrapperRef = useRef<HTMLDivElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const stageLayoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const seatMap = seatMapWrapperRef.current;

      if (seatMap) {
        seatMap.style.visibility = 'hidden';
      }
    };
  }, [selectedArea]);

  useEffect(() => {
    const seatMap = seatMapWrapperRef.current;
    const stageWrapper = stageWrapperRef.current;
    const stageLayout = stageLayoutRef.current;
    setTimeout(() => {
      const SeatMapHorizontalPadding = 48;
      if (seatMap) {
        // 가로 스크롤 중앙 이동
        if (seatMap.scrollWidth > seatMap.offsetWidth) {
          if (isDisplayStage && stageWrapper && stageLayout) {
            stageWrapper.style.width = `${(seatMap.scrollWidth - SeatMapHorizontalPadding) / 10}rem`;
          }
          const centerPositionX = (seatMap.scrollWidth - seatMap.offsetWidth) / 2;
          seatMap.scrollTo(centerPositionX, 0);
        }
        seatMap.style.visibility = 'visible';
      }
    }, 0);
    setTimeout(() => {
      seatMap && seatMap.addEventListener('scroll', handleScrollSeatMap);
    }, 100);
    return () => {
      seatMap && seatMap.removeEventListener('scroll', handleScrollSeatMap);
      if (isDisplayStage && stageWrapper) {
        stageWrapper.style.width = 'auto';
      }
      seatMap && seatMap.scrollTo(0, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisplayStage, isShowAreaTab, selectedArea]);

  return (
    <WrapperStyled ref={seatMapWrapperRef}>
      {isDisplayStage && (
        <SeatStageStyled ref={stageWrapperRef}>
          <div className="stage-layout" ref={stageLayoutRef}>
            <span>STAGE</span>
          </div>
        </SeatStageStyled>
      )}
      {items.map((rowData, rowIndex) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <RowStyled key={`layout-row-${rowIndex}`}>
            {rowData.map((colData) => {
              return <SeatItem key={colData.id} data={colData} handleSelectedSeats={handleSelectSeat} />;
            })}
          </RowStyled>
        );
      })}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  visibility: hidden;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  gap: ${({ theme }) => `${theme.spacing.s8}`};
  width: 100%;
  height: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.s24} ${theme.spacing.s24} calc(12.4rem + env(safe-area-inset-bottom)) ${theme.spacing.s24}`};
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SeatStageStyled = styled.div`
  display: flex;
  height: 6.4rem;
  padding-bottom: 3.2rem;
  justify-content: center;
  .stage-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32rem;
    height: 3.2rem;
    padding: 1.6rem 6.7rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.smallB};
    border-radius: ${({ theme }) => theme.radius.r8};
    background: ${({ theme }) => theme.color.gray3};
  }
`;

const RowStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  gap: ${({ theme }) => `${theme.spacing.s8}`};
  .layout-seat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 4.8rem;
    width: 4.8rem;
    background: ${({ theme }) => theme.color.background.surface};
    border-radius: 4rem;
    border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    &.selected {
      background: ${({ theme }) => theme.color.brand.tint};
      border: 0px;
    }
    &.disabled {
      cursor: not-allowed;
      border: 0px;
      background: ${({ theme }) => theme.color.states.disabledBg};
    }
    &:not(.selected) {
      &:active {
        background: ${({ theme }) => theme.color.states.pressedCell};
      }
    }
  }
  .layout-seat-label {
    width: 3.6rem;
    text-align: center;
    font: ${({ theme }) => theme.fontType.micro};
    color: ${({ theme }) => theme.color.text.textPrimary};
    &.selected {
      font: ${({ theme }) => theme.fontType.microB};
      color: ${({ theme }) => theme.color.white};
    }
    &.disabled {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
  }
`;

const BlankStyled = styled.div`
  display: flex;
  width: 4.8rem;
  height: 4.8rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const WayRowStyled = styled.div`
  display: flex;
  width: 4.8rem;
  height: 1.2rem;
  justify-content: center;
  align-items: center;
`;

const WayColStyled = styled.div`
  display: flex;
  width: 1.2rem;
  height: 4.8rem;
  justify-content: center;
  align-items: center;
`;

const WayCrossStyled = styled.div`
  display: flex;
  width: 1.2rem;
  height: 1.2rem;
  justify-content: center;
  align-items: center;
`;
