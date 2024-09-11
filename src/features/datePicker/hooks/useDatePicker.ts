import { useCallback, useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import findLastIndex from 'lodash/findLastIndex';
import { useWebInterface } from '@hooks/useWebInterface';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { DateType, DaysIndexListType, SelectedInfoValuesType, SelectedPriceType } from '../types';
import {
  DateStatusType,
  DAY_ITEM_MARGIN_LEFT,
  DAY_ITEM_SIZE,
  MONTH_ROW_PADDING,
  DatePickerMessage,
  DatePickerPurchasableType,
  SELECTED_PART_WIDTH,
  ToTopButtonStatus,
  TO_TOP_BUTTON_SCROLL_DURATION,
} from '../constants';
import { CalendarSchema } from '../schemas';

interface Props<T extends CalendarSchema = CalendarSchema> {
  /** Calendar Data */
  data: T;
  /** Ref: 실제 scroll element */
  scrollRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Ref: 선택된 날짜 가격 총합 element */
  priceRefs: React.MutableRefObject<(HTMLParagraphElement | null)[]>;
  /** Ref: 선택된 날짜 element */
  dateRef: React.MutableRefObject<HTMLDivElement | null>;
  /** 기존에 선택된 옵션 수량 */
  selectedOptionsStock: number;
  /** 달력 UI 단일 터치 여부 (싱글 or 멀티) */
  singleTouch: boolean;
  /** 숙박(n박 m일) 표시 여부 */
  displayStayInfo: boolean;
  /** 완료 CTA 버튼 클릭 함수 */
  onClickComplete: (selected: DaysIndexListType[], date: T) => void;
  /** 날짜 선택 콜백 함수 */
  onClickDate?: (selected: DaysIndexListType[], date: T) => boolean;
}

// 선택한 날짜 정보 초기값
const selectedInfoInitialValues: SelectedInfoValuesType = {
  days: [],
  type: 'DEFAULT',
  scrollAble: true,
  priceDisplay: false,
  textPosition: 'CENTER',
  isShow: false,
  left: 0,
  size: 0,
};

export const useDatePicker = <T extends CalendarSchema = CalendarSchema>({
  data,
  scrollRefs,
  priceRefs,
  dateRef,
  selectedOptionsStock,
  singleTouch,
  displayStayInfo,
  onClickComplete: handleClickComplete,
  onClickDate,
}: Props<T>) => {
  const { showToastMessage, generateHapticFeedback } = useWebInterface();

  const { stayNights, months, userMaxPurchaseEa = 0, userFixedPurchaseEa = 0 } = data;
  const stayDays = data.stayDays ?? stayNights + 1;

  // 선택한 날짜 표시를 위한 월(달)별 정보값
  const [selectedList, setSelectedList] = useState<SelectedInfoValuesType[]>(
    new Array(months.length).fill(selectedInfoInitialValues),
  );
  // 선택한 총합 가격이 노출될 Index
  const [priceDisplayIdx, setPriceDisplayIdx] = useState<number>(-1);
  // To Top Button Scroll Animation
  const [isToTopBtn, setToTopBtn] = useState<ToTopButtonStatus>(ToTopButtonStatus.HIDDEN);
  // 날짜 선택 횟수
  const countRef = useRef<number>(0);
  // 선택 가능한지 확인
  const availableRef = useRef<boolean>(true);
  // 월(달)별 가격 노출 여부
  const priceDisplaysRef = useRef<boolean[]>(new Array(months.length).fill(false));
  /** selectedList 값 갱신을 위한 Ref, @issue ref를 사용하지 않고 state 만 사용했을 경우에는 observer 에 값 갱신이 늦을때가 있음 */
  const selectedListRef = useRef<SelectedInfoValuesType[]>(new Array(months.length).fill(selectedInfoInitialValues));
  /** toTopButton row 위치 */
  const toTopBtnMonthIdx = selectedList.findIndex((month) => !isEmpty(month.days));
  /** toTopButton column 위치 */
  const toTopBtnDayIdx = toTopBtnMonthIdx !== -1 ? selectedList[toTopBtnMonthIdx].days[0] : -1;

  /** 연박일수 */
  const nights = selectedList.reduce((prev, current) => {
    if (isEmpty(current.days)) {
      return prev;
    }
    return prev + current.days.length;
  }, -1);
  /** 연박 정보 */
  const nightsInfo = singleTouch ? `${stayNights}박 ${stayDays}일` : `${nights}박 ${nights + 1}일`;

  /** 한개 월(달)에 선택한 날짜의 가격 총합 */
  const getSumOneMonthSelectedPrice = (month: SelectedInfoValuesType, monthIdx: number, lastMonthIdx: number) => {
    return month.days.reduce(
      (prev, current, currentIdx) => {
        if (monthIdx === lastMonthIdx && currentIdx === month.days.length - 1) {
          return prev;
        }
        return {
          minPrice: prev.minPrice + (months[monthIdx].days[current].minPrice ?? 0),
          maxPrice: prev.maxPrice + (months[monthIdx].days[current].maxPrice ?? 0),
        };
      },
      { minPrice: 0, maxPrice: 0 } as SelectedPriceType,
    );
  };

  /** 선택한 날짜의 가격 총합 */
  const selectedPrice: SelectedPriceType = selectedList.reduce(
    (prev, current, currentIdx) => {
      if (singleTouch) {
        const startIndex = selectedList.findIndex((value) => !isEmpty(value.days));
        if (startIndex === -1) {
          return prev;
        }

        const dayIndex = selectedList[startIndex].days[0];
        return {
          minPrice: months[startIndex].days[dayIndex].minPrice ?? 0,
          maxPrice: months[startIndex].days[dayIndex].maxPrice ?? 0,
        };
      }

      const lastIndex = findLastIndex(selectedList, (value) => !isEmpty(value.days));
      if (lastIndex === -1) {
        return prev;
      }

      const price = getSumOneMonthSelectedPrice(current, currentIdx, lastIndex);

      return {
        minPrice: prev.minPrice + price.minPrice,
        maxPrice: prev.maxPrice + price.maxPrice,
      };
    },
    { minPrice: 0, maxPrice: 0 } as SelectedPriceType,
  );

  /** 선택 완료 */
  const handleComplete = () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

    handleClickComplete(
      selectedList.map(({ days }) => days),
      data,
    );
  };

  const handleErrorToastMessage = (message: string) => {
    showToastMessage({ message });
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
  };

  /** selected bubble 인터랙션 이후 위치값 업데이트 */
  const handleUpdateSelectedInfo = (evt: React.TransitionEvent) => {
    if (evt.propertyName === 'width' || evt.propertyName === 'visibility') {
      setSelectedList(
        selectedList.map((info) => {
          const { days } = info;
          const startDay = days[0];

          const left = (DAY_ITEM_SIZE + DAY_ITEM_MARGIN_LEFT) * startDay + MONTH_ROW_PADDING;

          if (!left && info.left) {
            return { ...info, left };
          }
          return { ...info };
        }),
      );
    }
  };

  /** 날짜 비교 */
  const getDateStatus = (comparisonDate: DateType, standardDate?: DateType | null) => {
    const { year, month, day } = comparisonDate;
    const standard = standardDate
      ? { year: standardDate.year, month: standardDate.month, day: standardDate.day }
      : { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    const { year: standardYear, month: standardMonth, day: standardDay } = standard;

    if (standardYear === year && standardMonth === month && standardDay === day) {
      return DateStatusType.SAME;
    }

    if (
      standardYear > year ||
      (standardYear === year && standardMonth > month) ||
      (standardYear === year && standardMonth === month && standardDay > day)
    ) {
      return DateStatusType.BEFORE;
    }

    return DateStatusType.AFTER;
  };

  /** selected bubble 설정값 변경 */
  const getBubbleInfo = (list: SelectedInfoValuesType[]) => {
    return months.map((_, index) => {
      const { days, scrollAble, type } = list[index];

      const hasWhiteSpace = !scrollAble && type === 'START';
      const hasSelectedPart = type === 'CENTER' || type === 'END' || type === 'START';
      const startDay = days[0];

      /**
       * defaultLeft: 시작위치(시작날짜 index * day size) + 왼쪽 padding 값 + 시작날짜까지의 margin left 총합(날짜별 margin left * 시작날짜 위치)
       * CENTER, END type 의 경우: 앞에 selectedPart 가 붙어 시작점 margin left 값을 빼줌
       */
      const defaultLeft = DAY_ITEM_SIZE * startDay + MONTH_ROW_PADDING + DAY_ITEM_MARGIN_LEFT * (startDay + 1);
      const left = type === 'CENTER' || type === 'END' ? defaultLeft - DAY_ITEM_MARGIN_LEFT : defaultLeft;

      /**
       * defaultSize: 선택한 날짜 size 총합(날짜별 size * 선택한 날짜 갯수) + 선택한 날짜 사이의 margin left 총합(날짜별 margin left * 시작 날짜를 제외한 선택한 날짜 갯수)
       * hasWhiteSpaceSize: scrollwidth - 오른쪽 padding 값(시작위치에서 왼쪽 padding 값 계산됨) - left(시작위치)
       * hasPartSize: defaultSize + selected part size(CENTER type의 경우 양쪽으로 붙음)
       */
      const defaultSize = DAY_ITEM_SIZE * days.length + DAY_ITEM_MARGIN_LEFT * (days.length - 1);
      const hasWhiteSpaceSize =
        (scrollRefs.current[index] as HTMLDivElement).scrollWidth / 10 - MONTH_ROW_PADDING - (left ?? 0);
      const hasPartSize = defaultSize + SELECTED_PART_WIDTH * (type === 'CENTER' ? 2 : 1);

      const size = hasSelectedPart ? hasPartSize : defaultSize;

      return {
        isShow: !isEmpty(days),
        left: !isEmpty(days) ? left : selectedList[index].left,
        size: hasWhiteSpace ? hasWhiteSpaceSize : size,
      };
    });
  };

  /** 선택한 날짜 월(달)별 selected 표시 정보 업데이트 */
  const getUpdateSelectedListInfo = (list: SelectedInfoValuesType[]) => {
    const selected = [...list];
    const selectedMonthList = selected
      .map((value, index) => {
        if (isEmpty(value.days)) {
          return -1;
        }
        return index;
      })
      .filter((value) => value !== -1);

    selectedMonthList.forEach((value, index) => {
      const listValue = list[value];
      const monthsValue = months[value];
      const selectedValue = selected[value];

      const isSelectedAll =
        listValue.days.length === monthsValue.days.length &&
        listValue.days.length === new Date(monthsValue.year, monthsValue.month, 0).getDate();
      if (selectedMonthList.length > 1) {
        if (index === 0) {
          selectedValue.type = 'START';
          selectedValue.textPosition = isSelectedAll ? 'FIXED_CENTER' : 'RIGHT';
          return;
        }
        if (index === selectedMonthList.length - 1) {
          selectedValue.type = 'END';
          selectedValue.textPosition = isSelectedAll ? 'FIXED_CENTER' : 'LEFT';
          return;
        }
        selectedValue.type = 'CENTER';
        selectedValue.textPosition = 'FIXED_CENTER';
        return;
      }
      selectedValue.textPosition = selectedValue.type === 'DEFAULT' && isSelectedAll ? 'FIXED_CENTER' : 'CENTER';
    });

    return selected;
  };

  /** 선택한 날 기준 연박일수 기간 구하기 */
  const getstayDaysRange = (monthIdx: number, dayIdx: number): SelectedInfoValuesType[] => {
    const stayDaysRange: SelectedInfoValuesType[] = selectedList.map((value) => {
      return {
        ...selectedInfoInitialValues,
        scrollAble: value.scrollAble,
      };
    });
    let count = 0;

    months.forEach((date, mIdx) => {
      if (mIdx < monthIdx) {
        return;
      }
      date.days.forEach((_, dIdx) => {
        if ((mIdx === monthIdx && dIdx < dayIdx) || count >= stayDays) {
          return;
        }

        stayDaysRange[mIdx] = {
          ...stayDaysRange[mIdx],
          days: [...stayDaysRange[mIdx].days, dIdx],
          priceDisplay: true,
        };
        count += 1;
      });
    });

    return stayDaysRange;
  };

  /** 첫날과 마지막날 사이 날짜를 구함 */
  const getDateRange = (monthIdx: number, dayIdx: number): SelectedInfoValuesType[] => {
    const selectedMIdx = selectedList.findIndex((value) => !isEmpty(value.days));

    if (selectedMIdx === -1) {
      return [];
    }

    availableRef.current = true;
    const dateRange: SelectedInfoValuesType[] = selectedList.map((value) => {
      return {
        ...selectedInfoInitialValues,
        scrollAble: value.scrollAble,
      };
    });
    const selectedDIdx = selectedList[selectedMIdx].days[0];

    months.forEach((date, mIdx) => {
      // 기존 선택된 달보다 빠를경우 || 현재 선택한 달보다 느릴 경우
      if (mIdx < selectedMIdx || mIdx > monthIdx) {
        return;
      }

      date.days.forEach((day, dIdx) => {
        if (
          // 기존 선택된 첫날보다 빠를 경우
          (mIdx === selectedMIdx && dIdx < selectedDIdx) ||
          // 현재 선택한 날보다 느릴 경우
          (mIdx === monthIdx && dIdx > dayIdx) ||
          !availableRef.current
        ) {
          return;
        }

        const { enable, checkoutOnly } = day;

        // 비활성화된 날짜 or 체크인과 체크아웃 날짜 사이에 체크아웃만 가능한 날짜가 포함되어 있을 경우
        if (!enable || (dIdx !== dayIdx && checkoutOnly)) {
          availableRef.current = false;
          dateRange.length = 0;
          return;
        }

        dateRange[mIdx] = {
          ...dateRange[mIdx],
          days: [...dateRange[mIdx].days, dIdx],
          priceDisplay: true,
        };
      });
    });

    return dateRange;
  };

  /** 구매 가능 수량 확인 - 싱글타입에 패키지일 경우 수량 체크 필요없음 (기존대로 옵션창에서 체크) */
  const checkPurchasableStock = (selected: SelectedInfoValuesType[]): DatePickerPurchasableType => {
    /** 선택된 날짜는 일수 기준이지만, 구매할 때는 박수 기준이므로 초기값 = (현재 선택한 옵션 갯수 - 1) */
    const userSelectedStock = selected.reduce((prev, current) => {
      const { days } = current;
      return prev + days.length;
    }, selectedOptionsStock - 1);

    // 고정 박수 확인
    if (userFixedPurchaseEa !== 0 && userSelectedStock !== userFixedPurchaseEa) {
      return DatePickerPurchasableType.DISABLE_FIXED_STOCK;
    }

    // 최대 구매 수량 확인
    if (userMaxPurchaseEa !== 0 && userSelectedStock > userMaxPurchaseEa) {
      return DatePickerPurchasableType.DISABLE_USER_STOCK;
    }

    return DatePickerPurchasableType.ABLE;
  };

  /** 날짜 선택 */
  const handleSelect = ({ year, month, day }: DateType, monthIdx: number, dayIdx: number) => {
    const { checkoutOnly } = months[monthIdx].days[dayIdx];

    // 선택한 날짜 정보
    const rowIndex = selectedList.findIndex((value) => !isEmpty(value.days));
    const dayIndex = rowIndex !== -1 ? selectedList[rowIndex].days[0] : 0;
    const startDay =
      rowIndex !== -1
        ? {
            year: months[rowIndex].year,
            month: months[rowIndex].month,
            day: months[rowIndex].days[dayIndex].day,
          }
        : null;

    const status = getDateStatus({ year, month, day }, startDay);
    const stayDaysRange = getstayDaysRange(monthIdx, dayIdx);
    const dateRange = getDateRange(monthIdx, dayIdx);
    countRef.current += 1;

    /**
     * 첫 선택과 같은 로직이 필요한 경우 (or 조건)
     * - CALENDAR_SINGLE type 의 경우
     * - 아직 선택한 날짜가 없을 경우
     * - 출발일과 도착일 사이에 선택 불가한 날짜가 있을 경우
     * - 다음 선택일이 출발일 이후가 아닐경우
     * - 2번 선택을 완료한 경우
     */
    const isReset =
      singleTouch || rowIndex === -1 || isEmpty(dateRange) || status !== DateStatusType.AFTER || countRef.current > 2;

    if (isReset) {
      countRef.current = 1;
    }

    if (checkoutOnly && isReset) {
      handleErrorToastMessage(DatePickerMessage.ERROR_IMPOSSIBLE_CHECKIN);

      return;
    }

    const selectedRange = isReset ? stayDaysRange : dateRange;

    if (!singleTouch) {
      if (
        countRef.current > 1 &&
        checkPurchasableStock(selectedRange) === DatePickerPurchasableType.DISABLE_FIXED_STOCK
      ) {
        handleErrorToastMessage(`${userFixedPurchaseEa}박만 예약할 수 있습니다`);

        return;
      }

      if (checkPurchasableStock(selectedRange) === DatePickerPurchasableType.DISABLE_USER_STOCK) {
        handleErrorToastMessage(`최대 ${userMaxPurchaseEa}박까지 예약할 수 있습니다`);

        return;
      }
    }

    const newList = getUpdateSelectedListInfo(selectedRange);
    const newInfo = getBubbleInfo(newList);
    const newSelectedList = newList.map((value, index) => {
      return { ...value, ...newInfo[index] };
    });

    const select =
      onClickDate?.(
        newSelectedList.map(({ days }) => days),
        data,
      ) ?? true;

    if (!select) {
      return;
    }

    setPriceDisplayIdx(newSelectedList.findIndex((value, idx) => value.priceDisplay && priceDisplaysRef.current[idx]));
    setSelectedList([...newSelectedList]);
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
    selectedListRef.current = [...newSelectedList];
  };

  const scrollTo = useCallback((element: HTMLElement, to: number, duration: number) => {
    if (duration <= 0) {
      return;
    }
    const difference = to - element.scrollLeft;
    const perTick = (difference / duration) * 10;

    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      element.scrollLeft += perTick;
      element.scrollLeft !== to && scrollTo(element, to, duration - 10);
    }, 10);
  }, []);

  /** 선택한 날짜 위치로 이동 */
  const handleToSelectedDate = (index: number, isLeft: boolean) => {
    const scrollEl = scrollRefs.current[index];
    if (scrollEl) {
      const { left, days } = selectedList[index];

      setToTopBtn(ToTopButtonStatus.HIDDEN);
      generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });

      if (isLeft) {
        scrollTo(scrollEl, (left - MONTH_ROW_PADDING) * 10, TO_TOP_BUTTON_SCROLL_DURATION);
        return;
      }

      const nextIndex = days[days.length - 1] + 1;
      const nextLeft = (DAY_ITEM_SIZE + DAY_ITEM_MARGIN_LEFT) * nextIndex + MONTH_ROW_PADDING;
      scrollTo(scrollEl, (nextLeft + MONTH_ROW_PADDING) * 10 - window.screen.width, TO_TOP_BUTTON_SCROLL_DURATION);
    }
  };

  const handleVisibilityPrice = useCallback(([entry]: IntersectionObserverEntry[], index: number) => {
    priceDisplaysRef.current[index] = !!entry.isIntersecting;

    setPriceDisplayIdx(
      selectedListRef.current.findIndex((value, idx) => value.priceDisplay && priceDisplaysRef.current[idx]),
    );
  }, []);

  const handleVisibilityDate = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setToTopBtn(ToTopButtonStatus.HIDDEN);
      return;
    }

    const selectedWidth = dateRef.current?.offsetWidth ?? 0;
    const screenWdith = window.screen.width;

    /** 좌우 가로스크롤만 보기 위해서 boundingClientRect의 x 값 조건 추가 */
    if (entry.boundingClientRect.x < -selectedWidth) {
      setToTopBtn(ToTopButtonStatus.LEFT);
      return;
    }

    if (entry.boundingClientRect.x > screenWdith) {
      setToTopBtn(ToTopButtonStatus.RIGHT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let dateObserver: IntersectionObserver;

    if (dateRef.current) {
      dateObserver = new IntersectionObserver(handleVisibilityDate, {
        threshold: 0,
      });
      dateObserver.observe(dateRef.current as HTMLDivElement);
    }

    return () => dateObserver && dateObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList]);

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

    /** selected bubble 기본값 설정 */
    const bubbleInfo = getBubbleInfo(selectedList);

    selectedListRef.current = selectedList.map((info, index) => {
      if (scrollRefs.current && scrollRefs.current[index]) {
        const scrollRef = scrollRefs.current[index] as HTMLDivElement;
        if (scrollRef.offsetWidth < scrollRef.scrollWidth) {
          return { ...info, ...bubbleInfo[index], scrollAble: true };
        }
      }
      return { ...info, ...bubbleInfo[index], scrollAble: false };
    });

    setSelectedList(selectedListRef.current);

    return () => priceObserver && priceObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 구매 버튼 활성화 여부 */
  const isDisabled =
    (!singleTouch && checkPurchasableStock(selectedList) === DatePickerPurchasableType.DISABLE_FIXED_STOCK) ||
    selectedList.every((value) => isEmpty(value.days));

  return {
    selectedList,
    priceDisplayIdx,
    selectedPrice,
    isToTopBtn,
    toTopBtnMonthIdx,
    toTopBtnDayIdx,
    isDisabled,
    nightsInfo,
    hasStayInfo: displayStayInfo && nights > 0,
    handleSelect,
    handleUpdateSelectedInfo,
    handleComplete,
    handleToSelectedDate,
  };
};
