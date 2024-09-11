import { useCallback, useEffect, useState } from 'react';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import {
  DAY_ITEM_MARGIN_LEFT,
  DAY_ITEM_SIZE,
  MONTH_ROW_PADDING,
  ToTopButtonStatus,
  TO_TOP_BUTTON_SCROLL_DURATION,
} from '../constants';
import { CalendarDaysModel, MonthsModel } from '../models';
import { BubbleType } from '../types';

interface Props {
  /** 달력 월(달)별 data */
  months: MonthsModel[];
  /** 선택한 날짜 */
  selectedDates: CalendarDaysModel[];
  /** selected Bubble */
  bubble: BubbleType[];
  /** Ref: 실제 scroll element */
  scrollRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Ref: 선택된 날짜 element */
  dateRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const useToTopButton = ({ months, selectedDates, bubble, scrollRefs, dateRef }: Props) => {
  const { generateHapticFeedback } = useWebInterface();
  // To Top Button Scroll Animation
  const [isToTopButton, setToTopButton] = useState<ToTopButtonStatus>(ToTopButtonStatus.HIDDEN);

  /** 스크롤 이동 */
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
      const { left } = bubble[index];

      setToTopButton(ToTopButtonStatus.HIDDEN);
      generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });

      if (isLeft) {
        scrollTo(scrollEl, (left - MONTH_ROW_PADDING) * 10, TO_TOP_BUTTON_SCROLL_DURATION);
        return;
      }

      const days = selectedDates.filter(({ monthIndex }) => monthIndex === index);
      const currentLastIndex = months[index].days.findIndex((day) => {
        if (JSON.stringify(day) === JSON.stringify(days[days.length - 1])) {
          return true;
        }
        return false;
      });

      const nextIndex = currentLastIndex + 1;
      const nextLeft = (DAY_ITEM_SIZE + DAY_ITEM_MARGIN_LEFT) * nextIndex + MONTH_ROW_PADDING;
      scrollTo(scrollEl, (nextLeft + MONTH_ROW_PADDING) * 10 - window.screen.width, TO_TOP_BUTTON_SCROLL_DURATION);
    }
  };

  const handleVisibilityDate = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setToTopButton(ToTopButtonStatus.HIDDEN);
      return;
    }

    const selectedWidth = dateRef.current?.offsetWidth ?? 0;
    const screenWdith = window.screen.width;

    /** 좌우 가로스크롤만 보기 위해서 boundingClientRect의 x 값 조건 추가 */
    if (entry.boundingClientRect.x < -selectedWidth) {
      setToTopButton(ToTopButtonStatus.LEFT);
      return;
    }

    if (entry.boundingClientRect.x > screenWdith) {
      setToTopButton(ToTopButtonStatus.RIGHT);
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
  }, [selectedDates]);

  return {
    isToTopButton,
    handleToSelectedDate,
  };
};
