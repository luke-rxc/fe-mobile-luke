import { useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { userAgent } from '@utils/ua';
import { Button } from '@pui/button';
import { useDatePickerV2 } from '../hooks';
import { MONTH_ROW_HEIGHT, MONTH_ROW_PADDING } from '../constants';
import { CalendarSchema } from '../schemas';
import { ToTopButtonDate } from './DatePickerStyled';
import { DatePickerBubbleV2 } from './DatePickerBubbleV2';
import { DatePickerItemV2 } from './DatePickerItemV2';
import { CalendarDaysModel, CalendarModel, toCalendarData } from '../models';

export interface DatePickerV2Props<T extends CalendarSchema = CalendarSchema> {
  /** Calendar Data */
  data: T;
  /** 달력 UI 단일 터치 여부 (싱글 or 멀티) */
  singleTouch?: boolean;
  /** 숙박 정보(n박 m일) 표시 여부 */
  displayStayInfo?: boolean;
  /** 가격 표시 여부 */
  displayPrice?: boolean;
  /** CTA 버튼 비활성화 여부 */
  buttonDisabled?: boolean;
  /** 완료 CTA 버튼 클릭 함수 */
  onClickComplete?: (selected: CalendarDaysModel[], data: CalendarModel<T>) => void;
  /** 날짜 선택 콜백 함수 */
  onClickDate?: (selected: CalendarDaysModel[], data: CalendarModel<T>) => boolean;
}

export const DatePickerV2 = <T extends CalendarSchema = CalendarSchema>({
  data,
  singleTouch = true,
  displayStayInfo = true,
  displayPrice = true,
  buttonDisabled = false,
  onClickComplete,
  onClickDate,
}: DatePickerV2Props<T>) => {
  if (data === null) {
    return null;
  }

  const { isIOS, isApp } = userAgent();
  const calendar = toCalendarData<T>(data);

  const { months } = calendar;

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const priceRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dateRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedDates,
    selectedPrice,
    bubble,
    priceDisplayMonth,
    checkInMonth,
    checkInDate,
    isToTopButton,
    isDisabled,
    nightsInfo,
    hasStayInfo,
    handleSelect,
    handleComplete,
    handleToSelectedDate,
  } = useDatePickerV2<CalendarModel<T>>({
    data: calendar,
    scrollRefs,
    priceRefs,
    dateRef,
    singleTouch,
    displayStayInfo,
    buttonDisabled,
    onClickComplete,
    onClickDate,
  });

  return (
    <Wrapper className={isIOS && isApp ? 'is-ios-app' : ''}>
      <MonthsWrapper monthHeight={MONTH_ROW_HEIGHT} padding={MONTH_ROW_PADDING}>
        <>
          {months.map((date, index) => {
            const { year, month } = date;
            const currentYear = new Date().getFullYear();
            const title = currentYear === year ? `${month}월` : `${year}년 ${month}월`;
            const isSelectedRow = index === checkInMonth;
            const isDisabledMonth = date.days.every(({ enable }) => !enable);

            return (
              /** 월(달) section */
              <div key={`${title}`} className="month-wrapper">
                <div className={classnames('month', { 'is-disabled': isDisabledMonth })}>{title}</div>

                {/* toTopButton Section */}
                <ToTopButtonDate
                  months={months}
                  isToTopBtn={isToTopButton}
                  toTopBtnMonthIdx={checkInMonth}
                  toTopBtnDayIdx={checkInDate}
                  monthIdx={index}
                  isSelectedRow={isSelectedRow}
                  onClick={handleToSelectedDate}
                />

                {/* 날짜 Section */}
                <div
                  className="days-wrapper"
                  ref={(ref) => {
                    scrollRefs.current[index] = ref;
                  }}
                >
                  <>
                    {/* 선택된 날짜 표시 */}
                    <DatePickerBubbleV2
                      ref={(ref) => {
                        if (isSelectedRow) {
                          dateRef.current = ref;
                        }
                      }}
                      priceRefs={priceRefs}
                      index={index}
                      bubble={bubble[index]}
                      price={selectedPrice}
                      priceDisplayMonth={priceDisplayMonth}
                    />

                    {/* 날짜 (날짜 + 요일 + 가격) */}
                    {date.days.map((item) => (
                      <DatePickerItemV2
                        key={`${year}/${month}/${item.day}`}
                        item={item}
                        selectedDates={selectedDates}
                        selectedMonth={bubble[index].isShow}
                        displayPrice={displayPrice}
                        onClick={handleSelect}
                      />
                    ))}
                  </>
                </div>
              </div>
            );
          })}
        </>
      </MonthsWrapper>

      {/* CTA Section */}
      <ButtonWrapper>
        <Button
          variant="primary"
          size="large"
          bold
          disabled={isDisabled}
          onClick={handleComplete}
          description={hasStayInfo && nightsInfo}
        >
          완료
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // 하단 완료 버튼 영역(80) + 고정 여백(24)
  padding-bottom: 10.4rem;

  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }
`;

const MonthsWrapper = styled.div<{ monthHeight: number; padding: number }>`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  flex: 1 1 auto;

  .month-wrapper {
    position: relative;
    margin-bottom: 8rem;
  }

  .month {
    display: flex;
    align-items: center;
    height: ${({ monthHeight }) => `${monthHeight}rem`};
    padding-left: ${({ theme }) => theme.spacing.s24};
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};

    &.is-disabled {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
  }

  .days-wrapper {
    ${({ theme }) => theme.absolute({ t: 0, l: 0 })};
    width: 100%;
    display: flex;
    padding: ${({ monthHeight, padding }) => `${monthHeight}rem ${padding}rem ${padding}rem`};
    color: ${({ theme }) => theme.color.text.textTertiary};
    overflow: hidden;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ButtonWrapper = styled.div`
  position: fixed;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  left: 0;
  width: 100%;
  padding: 0 2.4rem;

  ${Button} {
    width: 100%;
  }
`;
