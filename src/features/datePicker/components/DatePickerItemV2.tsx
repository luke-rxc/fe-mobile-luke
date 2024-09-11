import styled from 'styled-components';
import classnames from 'classnames';
import { DAY_ITEM_SIZE } from '../constants';
import { priceConvertUnit } from '../utils';
import { CalendarDaysModel } from '../models';

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

interface DatePickerItemV2Props {
  item: CalendarDaysModel;
  selectedDates: CalendarDaysModel[];
  selectedMonth: boolean;
  displayPrice: boolean;
  onClick: (dayInfo: CalendarDaysModel) => void;
}

export const DatePickerItemV2 = ({
  item,
  selectedDates,
  selectedMonth,
  displayPrice,
  onClick: handleClick,
}: DatePickerItemV2Props) => {
  const { day, dayOfWeek, minPrice = 0, maxPrice, enable } = item;

  const isSelected = selectedDates.some((value) => JSON.stringify(value) === JSON.stringify(item));
  const isVisiblePrice = displayPrice && enable && !!minPrice;
  const isAllPriceSame = minPrice === maxPrice;

  return (
    <DateItemWrapper
      type="button"
      dateSize={DAY_ITEM_SIZE}
      className={classnames({ 'is-disabled': !enable })}
      disabled={!enable}
      onClick={() => handleClick(item)}
    >
      <div className={classnames('date', { selected: isSelected, 'selected-row': selectedMonth })}>
        <span>{day}</span>
        <span className="day-of-week">{dayOfWeek}</span>
      </div>
      {isVisiblePrice && (
        <PriceComponents
          price={minPrice}
          isAllPriceSame={isAllPriceSame}
          isSelected={isSelected}
          isShow={selectedMonth}
        />
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
