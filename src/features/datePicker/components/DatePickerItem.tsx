import styled from 'styled-components';
import classnames from 'classnames';
import { DAY_ITEM_SIZE } from '../constants';
import { DateType, SelectedInfoValuesType } from '../types';
import { priceConvertUnit } from '../utils';
import { CalendarDaysSchema } from '../schemas';

interface PriceComponentsProps {
  price: number;
  isAllPriceSame: boolean;
  isSelected: boolean;
  isShow: boolean;
}

const PriceComponents = ({ price, isAllPriceSame, isSelected, isShow }: PriceComponentsProps) => {
  const { price: convertedPrice, unit } = priceConvertUnit(price);

  return (
    <PriceWrapper className={classnames('description', { selected: isSelected, 'selected-row': isShow })}>
      {convertedPrice}
      {unit}
      {!isAllPriceSame && '~'}
    </PriceWrapper>
  );
};

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font: ${({ theme }) => theme.fontType.micro};
  margin-top: ${({ theme }) => theme.spacing.s2};
  opacity: 1;
  will-change: opacity;

  &.selected {
    opacity: 0;
  }

  &.selected-row {
    transition: opacity 0.2s;
  }
`;

interface DatePickerItemProps {
  year: number;
  month: number;
  days: CalendarDaysSchema;
  selectedList: SelectedInfoValuesType[];
  monthIdx: number;
  dayIdx: number;
  displayPrice: boolean;
  onClick: (selected: DateType, monthIdx: number, datIdx: number) => void;
}

export const DatePickerItem = ({
  year,
  month,
  days,
  selectedList,
  monthIdx,
  dayIdx,
  displayPrice,
  onClick: handleClick,
}: DatePickerItemProps) => {
  const { day, dayOfWeek, minPrice = 0, maxPrice, enable } = days;
  const { isShow, days: monthIdxDays } = selectedList[monthIdx];

  const isSelected = monthIdxDays.some((value) => value === dayIdx);
  const isVisiblePrice = displayPrice && enable && !!minPrice;
  const isAllPriceSame = minPrice === maxPrice;

  return (
    <DateItemWrapper
      type="button"
      className={classnames({ 'is-disabled': !enable })}
      disabled={!enable}
      onClick={() => handleClick({ year, month, day }, monthIdx, dayIdx)}
      dateSize={DAY_ITEM_SIZE}
    >
      <div className={classnames('date', { selected: isSelected, 'selected-row': isShow })}>
        <span>{day}</span>
        <span className="day-of-week">{dayOfWeek}</span>
      </div>
      {isVisiblePrice && (
        <PriceComponents price={minPrice} isAllPriceSame={isAllPriceSame} isSelected={isSelected} isShow={isShow} />
      )}
    </DateItemWrapper>
  );
};

const DateItemWrapper = styled.button<{ dateSize: number }>`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
  width: ${({ dateSize }) => `${dateSize}rem`};
  height: 6.4rem;
  margin-left: ${({ theme }) => theme.spacing.s8};
  font: ${({ theme }) => theme.fontType.small};

  &:last-child {
    margin-right: ${({ theme }) => theme.spacing.s8};
  }

  &.is-disabled {
    color: ${({ theme }) => theme.color.text.textDisabled};
    pointer-events: none;
  }

  .date {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${({ dateSize }) => `${dateSize}rem`};
    height: ${({ dateSize }) => `${dateSize}rem`};

    &.selected-row {
      transition: all 0.2s;
    }

    &.selected {
      font: ${({ theme }) => theme.fontType.smallB};
      color: ${({ theme }) => theme.color.white};
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      border-radius: 50%;
      content: '';
    }

    &:active {
      &:after {
        opacity: 1;
        background: ${({ theme }) => theme.color.states.pressedCell};
      }
    }

    .day-of-week {
      font: ${({ theme }) => theme.fontType.micro};
    }
  }

  .description {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font: ${({ theme }) => theme.fontType.micro};
    margin-top: ${({ theme }) => theme.spacing.s2};
    opacity: 1;

    &.selected {
      opacity: 0;
    }

    &.selected-row {
      transition: opacity 0.2s;
    }
  }
`;
