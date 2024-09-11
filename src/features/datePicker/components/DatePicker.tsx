import { useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { datadogRum } from '@utils/log';
import { userAgent } from '@utils/ua';
import { Button } from '@pui/button';
import { useDatePicker } from '../hooks';
import { MONTH_ROW_HEIGHT, MONTH_ROW_PADDING } from '../constants';
import { CalendarSchema } from '../schemas';
import { DaysIndexListType } from '../types';
import { DatePickerBubble } from './DatePickerBubble';
import { ToTopButtonDate } from './DatePickerStyled';
import { DatePickerItem } from './DatePickerItem';

export interface DatePickerProps<T extends CalendarSchema = CalendarSchema> {
  /** Calendar Data */
  data: T;
  /** 기존에 선택된 옵션 수량 */
  selectedOptionsStock?: number;
  /** 달력 UI 단일 터치 여부 (싱글 or 멀티) */
  singleTouch?: boolean;
  /** 숙박 정보(n박 m일) 표시 여부 */
  displayStayInfo?: boolean;
  /** 가격 표시 여부 */
  displayPrice?: boolean;
  /** 완료 CTA 버튼 클릭 함수 */
  onClickComplete: (selected: DaysIndexListType[], data: T) => void;
  /** 날짜 선택 콜백 함수 */
  onClickDate?: (selected: DaysIndexListType[], data: T) => boolean;
}

export const DatePicker = <T extends CalendarSchema = CalendarSchema>({
  data,
  selectedOptionsStock = 0,
  singleTouch = true,
  displayStayInfo = true,
  displayPrice = true,
  onClickComplete: handleClickComplete,
  onClickDate,
}: DatePickerProps<T>) => {
  if (data === null) {
    return null;
  }
  const { isIOS, isApp } = userAgent();
  const { months } = data;

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const priceRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dateRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedList,
    priceDisplayIdx,
    selectedPrice,
    isToTopBtn,
    toTopBtnMonthIdx,
    toTopBtnDayIdx,
    isDisabled,
    nightsInfo,
    hasStayInfo,
    handleSelect,
    handleUpdateSelectedInfo,
    handleComplete,
    handleToSelectedDate,
  } = useDatePicker<T>({
    data,
    scrollRefs,
    priceRefs,
    dateRef,
    selectedOptionsStock,
    singleTouch,
    displayStayInfo,
    onClickComplete: handleClickComplete,
    onClickDate,
  });

  return (
    <Wrapper className={isIOS && isApp ? 'is-ios-app' : ''}>
      <MonthsWrapper monthHeight={MONTH_ROW_HEIGHT} padding={MONTH_ROW_PADDING}>
        <>
          {months.map((date, monthIdx) => {
            /**
             * error 재현 및 파악이 어려운 부분이 있어 오류 재발생시 log 수집
             * @issue https://app.datadoghq.com/rum/sessions?query=%40issue.age%3A%3C%3D600000%20env%3A%28stage%20OR%20development%29%20%40type%3Aerror&cols=&event=AgAAAYtfHkNdLh1R2wAAAAAAAAAYAAAAAEFZdGZIbEtCQUFBMGRFeWFIdDBUemdBRQAAACQAAAAAMDE4YjVmMWUtNjU0OS00ZjUzLTg5NzgtMzcyZTNmMjFkY2Qx&p_tab=error_details&viz=stream&from_ts=1698107302000&to_ts=1698107902000&live=false
             */
            if (selectedList[monthIdx].type === undefined) {
              datadogRum.addError(new Error('selectedList Error!'), {
                type: selectedList[monthIdx].type,
                selectedList,
                monthIdx,
              });
            }
            const { year, month } = date;
            const currentYear = new Date().getFullYear();
            const title = currentYear === year ? `${month}월` : `${year}년 ${month}월`;
            const isSelectedRow = monthIdx === toTopBtnMonthIdx;
            const isDisabledMonth = !date.days.some(({ enable }) => enable);

            return (
              /** 월(달) section */
              <div key={`${title}`} className="month-wrapper">
                <div className={classnames('month', { 'is-disabled': isDisabledMonth })}>{title}</div>

                {/* toTopButton Section */}
                <ToTopButtonDate
                  months={months}
                  isToTopBtn={isToTopBtn}
                  toTopBtnMonthIdx={toTopBtnMonthIdx}
                  toTopBtnDayIdx={toTopBtnDayIdx}
                  monthIdx={monthIdx}
                  isSelectedRow={isSelectedRow}
                  onClick={handleToSelectedDate}
                />

                {/* 날짜 Section */}
                <div
                  className="days-wrapper"
                  ref={(ref) => {
                    scrollRefs.current[monthIdx] = ref;
                  }}
                >
                  <>
                    {/* 선택된 날짜 표시 */}
                    <DatePickerBubble
                      ref={(ref) => {
                        if (isSelectedRow) {
                          dateRef.current = ref;
                        }
                      }}
                      priceRefs={priceRefs}
                      index={monthIdx}
                      selectedList={selectedList}
                      price={selectedPrice}
                      priceDisplayIdx={priceDisplayIdx}
                      onTransitionEnd={handleUpdateSelectedInfo}
                    />

                    {/* 날짜 (날짜 + 요일 + 가격) */}
                    {date.days.map((item, dayIdx) => (
                      <DatePickerItem
                        key={`${year}/${month}/${item.day}`}
                        year={year}
                        month={month}
                        days={item}
                        selectedList={selectedList}
                        monthIdx={monthIdx}
                        dayIdx={dayIdx}
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
