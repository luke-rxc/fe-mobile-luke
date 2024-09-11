/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useRef, useCallback, useState, useEffect, useLayoutEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import toNumber from 'lodash/toNumber';
import { v4 as uuid } from 'uuid';
import { useUpdateEffect } from 'react-use';
import { Tab, TabProps } from '@pui/tab';
import debounce from 'lodash/debounce';

const easeOutCubic = (
  startTime: number,
  currentTime: number,
  startValue: number,
  finishValue: number,
  duration: number,
) => {
  const progress = 1 - (1 - (currentTime - startTime) / duration) ** 3;
  const value = finishValue - startValue;

  return startValue + value * progress;
};

/** tabs 영역의 배경생을 오버라이딩하기 위한 css variable명 */
export const TABLIST_BACKGROUND_CSS_VARIABLE_NAME = '--tabs-background';

export type TabsRefType = { tabs: HTMLDivElement; scrollToSelectedTab: () => void };

export type TabDataType = Record<string, unknown> | number | string;

export interface TabsProps<T extends TabDataType = TabDataType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tab을 생성하기 위한 데이터 */
  data?: T[];
  /** Tab 타입 */
  type?: TabProps['type'];
  /** 현재 선택된 Tab value */
  value?: string | number;
  /** 초기 선택된 Tab value */
  defaultValue?: string | number;
  /** 액션버튼 영역 */
  suffix?: React.ReactNode;
  /** Tab 클릭시 실행할 콜백 함수 */
  onChange?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: T, index: number) => void;
  /** map key를 생성(getKey는 옵셔널이지만 항상 사용하길 권장합니다) */
  getKey?: (data: T, index: number) => string;
  /** Tab의 label props를 생성 */
  getLabel?: (data: T, index: number) => string;
  /** Tab value를 생성 */
  getValue?: (data: T, index: number) => string | number;
  /** Tab에 전달할 props를 생성 */
  getTabProps?: (data: T, index: number) => Partial<TabProps>;
}

const TabsComponent = forwardRef<TabsRefType, TabsProps<TabDataType>>(
  (
    {
      data,
      type = 'underline',
      value,
      defaultValue,
      suffix,
      className,
      onChange,
      getKey,
      getLabel,
      getValue,
      getTabProps,
      ...props
    },
    ref,
  ) => {
    // element refs
    const containerRef = useRef<HTMLDivElement>(null);
    const tabListInnerRef = useRef<HTMLDivElement>(null);
    const tabListRef = useRef<HTMLDivElement>(null);
    const suffixInnerRef = useRef<HTMLDivElement>(null);

    // value refs
    const tabListScrollPosX = useRef<number>();
    const scrollRequestAnimationId = useRef<number>();
    const isSuffixVisibilityLocked = useRef<boolean>(true);
    const [selectValue, setSelectValue] = useState<string | number | null>(value ?? defaultValue ?? null);

    // root element classnames
    const classNames = classnames(className);

    /**
     * tab key props 반환
     */
    const getTabKey = (item: TabDataType, index: number): string => {
      if (getKey) {
        return getKey(item, index);
      }

      if (isObject(item)) {
        return `${item?.value || item?.label || uuid().slice(8)}`;
      }

      return `${item}`;
    };

    /**
     * tab label props 반환
     */
    const getTabLabel = (item: TabDataType, index: number): string | number => {
      if (getLabel) {
        return getLabel(item, index);
      }

      if (isString(item) || isNumber(item)) {
        return item;
      }

      if (isObject(item)) {
        return `${item?.label || ''}` || index;
      }

      return index;
    };

    /**
     * tab value props 반환
     */
    const getTabValue = (item: TabDataType, index: number): string | number => {
      if (getValue) {
        return getValue(item, index);
      }

      if (isString(item) || isNumber(item)) {
        return item;
      }

      if (isObject(item)) {
        return isNumber(item?.value) || isString(item?.value) ? item.value : index;
      }

      return index;
    };

    /**
     * suffix element 넓이 반환
     */
    const getSuffixWidth = () => {
      return suffixInnerRef.current?.offsetWidth || 0;
    };

    /**
     * 특정 타겟이 있는 스크롤 위치 반환
     */
    const getScrollPositionToMove = (targetTab: HTMLElement): number | null => {
      if (!tabListRef.current) {
        return null;
      }

      const { offsetWidth: tablistW, scrollWidth: scrollW } = tabListRef.current;
      const { offsetWidth: tabW, offsetLeft: tabL } = targetTab;
      const suffixW = getSuffixWidth();

      const positionX = tabL + toNumber((tabW / 2).toFixed(1)) - toNumber(((tablistW - suffixW) / 2).toFixed(1));
      const scrollSize = scrollW - tablistW;

      return Math.max(0, Math.min(positionX, scrollSize));
    };

    /**
     * tabList element paddingRight 업데이트
     */
    const updateTabListPaddingRight = () => {
      if (!tabListRef.current) {
        return;
      }

      const suffixWidth = getSuffixWidth();
      tabListRef.current.style.paddingRight = `${suffixWidth / 10}rem`;
    };

    /**
     * suffix element show/hide
     */
    const updateSuffixVisibility = (isVisible: boolean, duration = 250) => {
      const suffixEl = suffixInnerRef.current;

      if (!suffixEl) return;

      suffixEl.style.transform = `translate3d(${isVisible ? 0 : 100}%, 0, 0)`;
      suffixEl.style.transition = `transform ${duration}ms`;
    };

    /**
     * debounce처리된 updateSuffixVisibility 함수
     */
    const debouncedUpdateSuffixVisibility = useCallback(
      debounce(() => updateSuffixVisibility(true), 300),
      [],
    );

    /**
     * selected 여부
     */
    const isSelectedTab = (item: TabDataType, index: number): boolean => {
      return selectValue === getTabValue(item, index);
    };

    /**
     * 스크롤 애니메이션을 사용해 특정 위치로 스크롤 이동
     */
    const animateScrollTo = ({
      currentTime,
      startPosition,
      finishPosition,
      duration,
      startTime: _startTime,
    }: {
      currentTime: number;
      startPosition: number;
      finishPosition: number;
      duration: number;
      startTime?: number;
    }) => {
      /** 최초 시작 시간 */
      const startTime = _startTime ?? currentTime;
      /** 경과 시간 */
      const elapsedTime = currentTime - startTime;

      if (Math.floor(elapsedTime) < duration && tabListRef.current) {
        tabListRef.current.scrollLeft = easeOutCubic(startTime, currentTime, startPosition, finishPosition, duration);
        scrollRequestAnimationId.current = window.requestAnimationFrame((timestamp) =>
          animateScrollTo({ startTime, currentTime: timestamp, startPosition, finishPosition, duration }),
        );
      } else {
        scrollRequestAnimationId.current = undefined;
        isSuffixVisibilityLocked.current = false;
      }
    };

    /**
     * 현재 진행 중인 스크롤 애니메이션을 취소
     */
    const cancelScrollAnimation = () => {
      if (scrollRequestAnimationId.current) {
        window.cancelAnimationFrame(scrollRequestAnimationId.current);
        scrollRequestAnimationId.current = undefined;
      }

      isSuffixVisibilityLocked.current = false;
    };

    /**
     * 현재 선택(활성화)된 tab의 위치로 스크롤 이동
     */
    const scrollToSelectedTab = () => {
      const target = tabListRef.current?.querySelector<HTMLElement>('[aria-selected=true]');

      if (!tabListRef.current || !target) {
        return;
      }

      cancelScrollAnimation();

      const startPosition = tabListRef.current?.scrollLeft || 0;
      const finishPosition = getScrollPositionToMove(target);

      if (isNumber(startPosition) && isNumber(finishPosition)) {
        isSuffixVisibilityLocked.current = true;
        scrollRequestAnimationId.current = window.requestAnimationFrame((currentTime) =>
          animateScrollTo({ currentTime, startPosition, finishPosition, duration: 600 }),
        );
      }
    };

    /**
     * Event Header - tab click
     */
    const handleClickTab = (item: TabDataType, index: number) => {
      return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tabValue: string | number) => {
        setSelectValue(tabValue);
        onChange?.(e, item, index);
      };
    };

    /**
     * Event Header - tabList scroll
     */
    const handleScrollTabList = () => {
      if (!tabListRef.current) {
        return;
      }

      const scrollPosX = tabListRef.current.scrollLeft;

      /** suffix element show/hide 가능여부 */
      const isChangeableSuffixVisibility =
        // suffix element show/hide 잠금여부
        !isSuffixVisibilityLocked.current &&
        // 오버스크롤 후 원위치되는 경우를 위한 방어로직
        scrollPosX > 0 &&
        // 오른쪽 방향으로 이동시에만 suffix element show/hide
        scrollPosX > (tabListScrollPosX.current || 0);

      if (isChangeableSuffixVisibility) {
        updateSuffixVisibility(false);
        debouncedUpdateSuffixVisibility();
      }

      // Remember scroll position
      tabListScrollPosX.current = scrollPosX;
    };

    /**
     * Event Header - tabList touchMove
     */
    const handleTouchMoveTabList = () => {
      cancelScrollAnimation();
    };

    // value props => selectValue 동기화
    useUpdateEffect(() => {
      selectValue !== value && setSelectValue(value ?? null);
    }, [value]);

    // selectValue 업데이트에 따른 스크롤 이동
    useUpdateEffect(() => {
      scrollToSelectedTab();
    }, [selectValue]);

    // suffix element의 변화에 따른 tablist의 paddingRight 업데이트처리
    useEffect(() => {
      let observer: MutationObserver;
      const suffixEl = suffixInnerRef.current;

      if (suffixEl) {
        observer = new MutationObserver(() => {
          updateTabListPaddingRight();
          scrollToSelectedTab();
        });

        observer.observe(suffixEl, { childList: true, subtree: true });
      }

      return () => {
        observer?.disconnect();
      };
    }, []);

    // tablist element 최초 렌더링시 UI 세팅
    useLayoutEffect(() => {
      if (!tabListRef.current) {
        return;
      }

      updateTabListPaddingRight(); // 스크롤 위치 계산전 우측 여백 설정

      const target = tabListRef.current?.querySelector<HTMLElement>('[aria-selected=true]');
      const position = (target && getScrollPositionToMove(target)) || 0;

      tabListRef.current.scrollTo({ left: position });
      isSuffixVisibilityLocked.current = false;
    }, []);

    // suffix element 최초 렌더링시 slide 모션 적용
    useLayoutEffect(() => {
      let observer: IntersectionObserver;
      const suffixEl = suffixInnerRef.current;
      const tabListEl = tabListRef.current;

      if (suffixEl && tabListEl) {
        const noScroll = tabListEl.scrollWidth <= window.innerWidth;

        if (noScroll) {
          updateSuffixVisibility(true, 0);
        } else {
          updateSuffixVisibility(false, 0);

          observer = new IntersectionObserver(([entry], _observer) => {
            if (entry.isIntersecting) {
              _observer.disconnect();
              updateSuffixVisibility(true, 600);
            }
          });

          observer.observe(tabListEl);
        }
      }

      return () => observer?.disconnect();
    }, [!!suffix]);

    // setting refs
    useImperativeHandle(ref, () => ({
      tabs: containerRef.current as HTMLDivElement,
      scrollToSelectedTab,
    }));

    return (
      <div ref={containerRef} className={classNames} {...props}>
        <div ref={tabListInnerRef} className={classnames('tablist-inner')}>
          <div
            ref={tabListRef}
            role="tablist"
            className="tablist"
            onTouchMove={handleTouchMoveTabList}
            onScroll={handleScrollTabList}
          >
            {data?.map((item, index) => (
              <Tab
                type={type}
                key={getTabKey(item, index)}
                value={getTabValue(item, index)}
                label={getTabLabel(item, index)}
                selected={isSelectedTab(item, index)}
                onClick={handleClickTab(item, index)}
              />
            ))}
          </div>
        </div>

        <div ref={suffixInnerRef} className={classnames('suffix-inner')}>
          {suffix && <div className="suffix">{suffix}</div>}
        </div>
      </div>
    );
  },
);

/**
 * figma tabs
 */
export const Tabs = styled(TabsComponent)`
  --tabs-default-background: ${({ theme }) => theme.color.background.surface};

  overflow: hidden;
  position: relative;

  .tablist-inner {
    display: flex;
    overflow: hidden;
    align-items: center;
    width: 100%;
    height: 4.8rem;
    background: var(${TABLIST_BACKGROUND_CSS_VARIABLE_NAME}, var(--tabs-default-background));
  }

  .tablist {
    display: flex;
    box-sizing: border-box;
    overflow: hidden;
    overflow-x: auto;
    position: relative;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    padding: 0 2.4rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .suffix-inner {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0 })};
    display: flex;
    overflow: hidden;
    align-items: center;
    background: inherit;
    background: linear-gradient(
      90deg,
      transparent 0,
      var(${TABLIST_BACKGROUND_CSS_VARIABLE_NAME}, var(--tabs-default-background)) 12px
    );

    .suffix {
      display: flex;
      align-items: center;
      padding-right: ${({ theme }) => theme.spacing.s24};
      padding-left: ${({ theme }) => theme.spacing.s24};
      transform: translate3d(0, 0, 0);
    }
  }
` as (<T extends TabDataType = TabDataType>(
  props: TabsProps<T> & { ref?: React.ForwardedRef<TabsRefType> },
) => ReturnType<React.ForwardRefExoticComponent<TabsProps<T> & React.RefAttributes<TabsRefType>>>) &
  string;
