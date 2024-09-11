import { useCallback, useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useWebInterface } from '@hooks/useWebInterface';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { CalendarDaysModel, CalendarModel, toFlatDates } from '../models';
import {
  DatePickerMessage,
  DAY_ITEM_MARGIN_LEFT,
  DAY_ITEM_SIZE,
  MONTH_ROW_PADDING,
  SELECTED_PART_WIDTH,
} from '../constants';
import { BubbleType, SelectedPriceType } from '../types';
import { useToTopButton } from './useToTopButton';

interface Props<T extends CalendarModel = CalendarModel> {
  /** Calendar Data */
  data: T;
  /** Ref: 실제 scroll element */
  scrollRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Ref: 선택된 날짜 가격 총합 element */
  priceRefs: React.MutableRefObject<(HTMLParagraphElement | null)[]>;
  /** Ref: 선택된 날짜 element */
  dateRef: React.MutableRefObject<HTMLDivElement | null>;
  /** 달력 UI 단일 터치 여부 (싱글 or 멀티) */
  singleTouch: boolean;
  /** 숙박 정보(n박 m일) 표시 여부 */
  displayStayInfo: boolean;
  /** CTA 버튼 비활성화 여부 */
  buttonDisabled: boolean;
  /** 완료 CTA 버튼 클릭 함수 */
  onClickComplete?: (selected: CalendarDaysModel[], data: T) => void;
  /** 날짜 선택 콜백 함수 */
  onClickDate?: (selected: CalendarDaysModel[], data: T) => boolean;
}

const bubbleInitialValues: BubbleType = {
  type: 'DEFAULT',
  scrollAble: true,
  priceDisplay: false,
  textPosition: 'CENTER',
  isShow: false,
  left: 0,
  size: 0,
};

export const useDatePickerV2 = <T extends CalendarModel = CalendarModel>({
  data,
  scrollRefs,
  priceRefs,
  dateRef,
  singleTouch,
  displayStayInfo,
  buttonDisabled,
  onClickComplete: handleClickComplete,
  onClickDate: handleClickDate,
}: Props<T>) => {
  const { showToastMessage, generateHapticFeedback } = useWebInterface();

  const { stayNights, months } = data;
  const stayDays = data.stayDays ?? stayNights + 1;

  /** 선택한 날짜 */
  const [selectedDates, setSelectedDates] = useState<CalendarDaysModel[]>([]);
  /** selected bubble */
  const [bubble, setBubble] = useState<BubbleType[]>(new Array(months.length).fill(bubbleInitialValues));
  /** 가격 표시 노출 월(달) index */
  const [priceDisplayMonth, setPriceDisplayMonth] = useState<number>(-1);
  /** bubble ref - 옵저버에서 bubble 참조하기 위해 필요 */
  const bubbleRef = useRef<BubbleType[]>([]);
  /** 체크인 날짜 선택 여부 */
  const isFirstTouch = useRef<boolean>(true);

  const { isToTopButton, handleToSelectedDate } = useToTopButton({
    months,
    selectedDates,
    bubble,
    scrollRefs,
    dateRef,
  });

  /** date flat list */
  const dates = toFlatDates(months);
  /** 구매 버튼 활성화 여부 */
  const isDisabled = buttonDisabled || isEmpty(selectedDates);
  /** 연박 일수 */
  const nights = selectedDates.length - 1;
  /** 연박 정보 */
  const nightsInfo = singleTouch ? `${stayNights}박 ${stayDays}일` : `${nights}박 ${nights + 1}일`;
  /** 선택한 날짜의 가격 총합 */
  const selectedPrice: SelectedPriceType = singleTouch
    ? {
        minPrice: selectedDates[0].minPrice ?? 0,
        maxPrice: selectedDates[0].maxPrice ?? 0,
      }
    : selectedDates.reduce(
        (prev, current, currentIndex) => {
          if (currentIndex === selectedDates.length - 1) {
            return { ...prev };
          }

          return {
            minPrice: prev.minPrice + (current.minPrice ?? 0),
            maxPrice: prev.maxPrice + (current.maxPrice ?? 0),
          };
        },
        { minPrice: 0, maxPrice: 0 } as SelectedPriceType,
      );

  /** 에러 토스트 */
  const handleErrorToastMessage = (message: string) => {
    showToastMessage({ message });
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
  };

  /** bubble size 관련 정보 구하기 */
  const getBubbleSizeInfo = ({
    bubbleInfo,
    startDayIndex,
    countDay,
    index,
  }: {
    bubbleInfo: BubbleType;
    startDayIndex: number;
    countDay: number;
    index: number;
  }) => {
    const { scrollAble, type } = bubbleInfo;
    const hasWhiteSpace = !scrollAble && type === 'START';

    const hasSelectedPart = type === 'CENTER' || type === 'END' || type === 'START';
    /**
     * defaultLeft: 시작위치(시작날짜 index * day size) + 왼쪽 padding 값 + 시작날짜까지의 margin left 총합(날짜별 margin left * 시작날짜 위치)
     * CENTER, END type 의 경우: 앞에 selectedPart 가 붙어 시작점 margin left 값을 빼줌
     */
    const defaultLeft = DAY_ITEM_SIZE * startDayIndex + MONTH_ROW_PADDING + DAY_ITEM_MARGIN_LEFT * (startDayIndex + 1);
    const left = type === 'CENTER' || type === 'END' ? defaultLeft - DAY_ITEM_MARGIN_LEFT : defaultLeft;

    /**
     * defaultSize: 선택한 날짜 size 총합(날짜별 size * 선택한 날짜 갯수) + 선택한 날짜 사이의 margin left 총합(날짜별 margin left * 시작 날짜를 제외한 선택한 날짜 갯수)
     * hasWhiteSpaceSize: scrollwidth - 오른쪽 padding 값(시작위치에서 왼쪽 padding 값 계산됨) - left(시작위치)
     * hasPartSize: defaultSize + selected part size(CENTER type의 경우 양쪽으로 붙음)
     */
    const defaultSize = DAY_ITEM_SIZE * countDay + DAY_ITEM_MARGIN_LEFT * (countDay - 1);
    const whiteSpaceSize =
      (scrollRefs.current[index] as HTMLDivElement).scrollWidth / 10 - MONTH_ROW_PADDING - (left ?? 0);
    const hasPartSize = defaultSize + SELECTED_PART_WIDTH * (type === 'CENTER' ? 2 : 1);

    const size = hasSelectedPart ? hasPartSize : defaultSize;

    return {
      ...bubbleInfo,
      isShow: !!countDay,
      left: countDay ? left : 0,
      size: hasWhiteSpace ? whiteSpaceSize : size,
    };
  };

  /** bubble 정보 업데이트 */
  const updateBubble = (stayDates: CalendarDaysModel[]) => {
    // 선택한 날짜 정보 (월, 시작일, 갯수)
    const selected: { months: number[]; startDates: (CalendarDaysModel | null)[]; countDay: number[] } = {
      months: [],
      startDates: new Array(months.length).fill(null),
      countDay: new Array(months.length).fill(0),
    };

    stayDates.forEach((dayInfo) => {
      const { monthIndex } = dayInfo;
      selected.countDay[monthIndex] += 1;
      if (!selected.months.includes(monthIndex)) {
        selected.months.push(monthIndex);
        selected.startDates[monthIndex] = dayInfo;
      }
    });

    setBubble((bubbleInfo) =>
      bubbleInfo.map((info, index) => {
        const updateBubbleInfo = { ...info };

        const checkIn = stayDates[0].flatIndex;
        const checkOut = stayDates[stayDates.length - 1].flatIndex;

        const { days } = months[index];
        const startDay = days[0].flatIndex;
        const endDay = days[days.length - 1].flatIndex;

        const startDayIndex = days.findIndex(
          (day) => JSON.stringify(day) === JSON.stringify(selected.startDates[index]),
        );

        const isSelectedAll = startDay >= checkIn && endDay <= checkOut;
        const selectedMonths = selected.months;

        if (selectedMonths.length > 1) {
          if (index === selectedMonths[0]) {
            updateBubbleInfo.type = 'START';
            updateBubbleInfo.textPosition = isSelectedAll ? 'FIXED_CENTER' : 'RIGHT';
          } else if (index === selectedMonths[selectedMonths.length - 1]) {
            updateBubbleInfo.type = 'END';
            updateBubbleInfo.textPosition = isSelectedAll ? 'FIXED_CENTER' : 'LEFT';
          } else {
            updateBubbleInfo.type = 'CENTER';
            updateBubbleInfo.textPosition = 'FIXED_CENTER';
          }
        } else {
          updateBubbleInfo.type = 'DEFAULT';
          updateBubbleInfo.textPosition =
            updateBubbleInfo.type === 'DEFAULT' && isSelectedAll ? 'FIXED_CENTER' : 'CENTER';
        }

        return {
          ...getBubbleSizeInfo({
            bubbleInfo: { ...updateBubbleInfo },
            startDayIndex,
            countDay: selected.countDay[index],
            index,
          }),
        };
      }),
    );
  };

  /** 연박 기간 구하기 */
  const getStayDates = (selectedDate: CalendarDaysModel, isCheckIn: boolean) => {
    const { flatIndex } = selectedDate;

    let checkIn = isCheckIn ? flatIndex : selectedDates[0].flatIndex;
    let checkOut = isCheckIn ? checkIn + stayDays : flatIndex + 1;

    if (checkIn >= checkOut) {
      checkIn = flatIndex;
      checkOut = checkIn + stayDays;
      isFirstTouch.current = false;
    } else {
      isFirstTouch.current = !isCheckIn;
    }

    let stayDates = dates.slice(checkIn, checkOut);
    const realDates = stayDates.slice(0, -1);

    const hasDisabledDate =
      !singleTouch && (isEmpty(realDates) || realDates.some(({ enable, checkoutOnly }) => !enable || checkoutOnly));

    if (hasDisabledDate) {
      checkIn = flatIndex;
      checkOut = checkIn + stayDays;
      isFirstTouch.current = false;

      stayDates = dates.slice(checkIn, checkOut);
    }

    return isEmpty(stayDates) ? selectedDates : stayDates;
  };

  /** 날짜 선택 */
  const handleSelect = (selectedDate: CalendarDaysModel) => {
    const stayDates = getStayDates(selectedDate, singleTouch || isFirstTouch.current);

    if (stayDates[0].checkoutOnly) {
      isFirstTouch.current = true;
      handleErrorToastMessage(DatePickerMessage.ERROR_IMPOSSIBLE_CHECKIN);

      return;
    }

    const clickDateCb = handleClickDate?.(stayDates, data) ?? true;

    if (!clickDateCb) {
      isFirstTouch.current = true;

      return;
    }

    updateBubble(stayDates);
    setSelectedDates(stayDates);
  };

  /** 선택 완료 */
  const handleComplete = () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

    handleClickComplete?.(selectedDates, data);
  };

  /** 가격 표시 월(달) 업데이트 */
  const updatePriceDisplayMonth = () => {
    if (isEmpty(selectedDates)) {
      return;
    }

    const { monthIndex } = selectedDates[0];

    setPriceDisplayMonth(
      bubbleRef.current.findIndex(({ isShow, priceDisplay }, index) => isShow && priceDisplay && index >= monthIndex),
    );
  };

  const handleVisibilityPrice = useCallback(([entry]: IntersectionObserverEntry[], index: number) => {
    bubbleRef.current[index].priceDisplay = entry.isIntersecting;

    setBubble(() => [...bubbleRef.current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bubbleRef.current = [...bubble];

    updatePriceDisplayMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubble]);

  useEffect(() => {
    let priceObserver: IntersectionObserver;

    months.forEach((_, index) => {
      const priceRef = priceRefs.current[index] as HTMLParagraphElement;
      if (priceRef) {
        priceObserver = new IntersectionObserver((entry) => handleVisibilityPrice(entry, index), {
          threshold: 0,
        });
        priceObserver.observe(priceRef);
      }
    });

    setBubble((bubbleInfo) =>
      bubbleInfo.map((info, index) => {
        if (scrollRefs.current && scrollRefs.current[index]) {
          const scrollRef = scrollRefs.current[index] as HTMLDivElement;
          if (scrollRef.offsetWidth < scrollRef.scrollWidth) {
            return { ...info, scrollAble: true };
          }
        }
        return { ...info, scrollAble: false };
      }),
    );

    return () => priceObserver && priceObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedDates,
    selectedPrice,
    bubble,
    priceDisplayMonth,
    checkInMonth: isEmpty(selectedDates) ? -1 : selectedDates[0].monthIndex,
    checkInDate: isEmpty(selectedDates) ? -1 : selectedDates[0].dayIndex,
    isToTopButton,
    isDisabled,
    nightsInfo,
    hasStayInfo: displayStayInfo && nights > 0,
    handleSelect,
    handleComplete,
    handleToSelectedDate,
  };
};
