import styled from 'styled-components';
import classnames from 'classnames';
import { DAY_ITEM_SIZE, ToTopButtonStatus } from '../constants';
import { CalendarSchema } from '../schemas';

interface ToTopButtonDateProps {
  months: CalendarSchema['months'];
  isToTopBtn: ToTopButtonStatus;
  toTopBtnMonthIdx: number;
  toTopBtnDayIdx: number;
  monthIdx: number;
  isSelectedRow: boolean;
  onClick: (index: number, isLeft: boolean) => void;
}

export const ToTopButtonDate = ({
  months,
  isToTopBtn,
  toTopBtnMonthIdx,
  toTopBtnDayIdx,
  monthIdx,
  isSelectedRow,
  onClick: handleClick,
}: ToTopButtonDateProps) => {
  const toTopButtons = new Array(2).fill([]);

  return (
    <>
      {toTopButtons.map((_, index) => {
        const isLeft = index === 0;
        const isAppear =
          isSelectedRow && (isLeft ? isToTopBtn === ToTopButtonStatus.LEFT : isToTopBtn === ToTopButtonStatus.RIGHT);

        const classNames = isLeft ? 'is-left' : 'is-right';

        return (
          <ToTopButton
            type="button"
            key={isLeft ? 'ToTopButtonLeft' : 'ToTopButtonRight'}
            className={classnames(classNames, {
              'is-appear': isAppear,
            })}
            dateSize={DAY_ITEM_SIZE}
            onClick={() => handleClick(monthIdx, isLeft)}
          >
            {toTopBtnDayIdx !== -1 && (
              <>
                <span>{months[toTopBtnMonthIdx].days[toTopBtnDayIdx].day}</span>
                <span className="day-of-week">{months[toTopBtnMonthIdx].days[toTopBtnDayIdx].dayOfWeek}</span>
              </>
            )}
          </ToTopButton>
        );
      })}
    </>
  );
};

const ToTopButton = styled.button<{ dateSize: number }>`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: ${({ theme }) => theme.zIndex.floating};
  ${({ theme }) => theme.absolute({ t: 56 })};
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ dateSize }) => `${dateSize}rem`};
  height: 4.8rem;
  background: ${({ theme }) => theme.color.brand.tint};
  border-radius: 2.4rem;
  font: ${({ theme }) => theme.fontType.smallB};
  color: ${({ theme }) => theme.color.white};
  transition: all 0.15s ease-in-out;

  &.is-left {
    transform: rotate(-160deg);
    left: ${({ dateSize }) => `-${dateSize}rem`};

    &.is-appear {
      left: 0.8rem;
    }
  }

  &.is-right {
    transform: rotate(160deg);
    right: ${({ dateSize }) => `-${dateSize}rem`};

    &.is-appear {
      right: 0.8rem;
    }
  }

  &.is-appear {
    visibility: visible;
    transform: rotate(0deg);
    transition: all 0.2s ease-in-out;
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.color.white};
    opacity: 0;
    content: '';
  }

  &:active {
    transform: scale(0.96);
    &:after {
      opacity: 0.2;
    }
  }

  .day-of-week {
    font: ${({ theme }) => theme.fontType.micro};
  }
`;
