/* eslint-disable react-hooks/exhaustive-deps */
import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import { v4 as uuid } from 'uuid';
import { useUpdateEffect } from 'react-use';
import { Tab, TabProps } from '@pui/tab';
import { Select } from '@pui/select';
import debounce from 'lodash/debounce';
import { GoodsSortingType, SortingOptions } from '@constants/goods';

const ANIMATION_DURATION = 600;

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

export type TabDataType = Record<string, unknown> | number | string;

export interface TabsProps<T extends TabDataType = TabDataType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tab을 생성하기 위한 데이터 */
  data: T[];
  /** Tab 타입 */
  type?: TabProps['type'];
  /** 현재 선택된 Tab value */
  value?: string | number;
  /** 초기 선택된 Tab value */
  defaultValue?: string | number;
  /** Tab 클릭시 실행할 콜백 함수 */
  onChange?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: T, index: number) => void;
  /** map key를 생성(getKey는 옵셔널이지만 항상 사용하길 권장합니다) */
  getKey?: (data: T, index: number) => string;
  /**
   * Tab의 label props를 생성
   * (getLabel props를 전달하지 않은 경우 data props를 참조하여 내부 로직에 따라 label을 생성)
   *
   * * data의 아이템 타입이 객체인경우 => 객체의 프로퍼티중 value를 찾아 반환(value가 없으면 빈문자열 반환)
   * * data의 아이템 타입이 number|string인 경우 => 해당 값을 label로 표시.
   */
  getLabel?: (data: T, index: number) => string;
  /** Tab value를 생성 */
  getValue?: (data: T, index: number) => string | number;
  /** Tab에 전달할 props를 생성 */
  getTabProps?: (data: T, index: number) => Partial<TabProps>;

  /**
   * Bubble 타입 > 현재 선택된 Sorting 값
   */
  defaultSortingValue?: string;
  /**
   * Bubble 타입 > Sorting 옵션
   */
  sortingOptions?: { label: string; value: string }[];
  /**
   * Bubble 타입 > Sorting 변경 시 콜백 함수
   */
  onChangeTabSorting?: (label: GoodsSortingType, index: number, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TabsComponent = forwardRef<HTMLDivElement, TabsProps<TabDataType>>(
  (
    {
      data,
      type = 'underline',
      value,
      defaultValue,
      defaultSortingValue,
      sortingOptions,
      className,
      onChange,
      getKey,
      getLabel,
      getValue,
      getTabProps,
      onChangeTabSorting,
      ...props
    },
    ref,
  ) => {
    const container = useRef<HTMLDivElement>(null);
    const tablistInner = useRef<HTMLDivElement>(null);
    const tablist = useRef<HTMLDivElement>(null);
    const tabs: (HTMLButtonElement | null)[] = [];

    /**
     * for Filter & Sorting
     */
    const sortingRef = useRef<HTMLDivElement>(null);
    const sortingLabelRef = useRef<HTMLSpanElement>(null);
    const sortingSelectRef = useRef<HTMLSelectElement>(null);
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [isFilterSelected, setIsFilterSelected] = useState<boolean>(false);
    const [hasScroll, setHasScroll] = useState<boolean>(false);

    /**
     * requestAnimationFrame id
     */
    const requestId = useRef<number | undefined>();

    /**
     * 현재 Tab value
     */
    const [selectValue, setSelectValue] = useState<string | number | null>(value ?? defaultValue ?? null);

    /**
     * Default Sorting label
     * @TODO
     */
    const defaultSortingLabel = SortingOptions
      ? SortingOptions.filter((item) => item.value === defaultSortingValue)[0]?.label
      : '';

    /**
     * 현재 Sorting label
     * @TODO
     */
    const [sortingLabel, setSortingLabel] = useState<string | number | null>(defaultSortingLabel ?? null);

    /**
     * root element의 클래스명
     */
    const classNames = classnames(className);

    /**
     * Tabs ref배열에 Tab element ref를 추가
     */
    const addTabElements = (tab: HTMLButtonElement | null) => {
      tabs.push(tab);
    };

    /**
     * Tab key 값 반환
     */
    const getTabKey = (item: TabDataType, index: number): string => {
      if (getKey) {
        return getKey(item, index);
      }

      if (isObject(item)) {
        const key = get(item, 'value', false) || get(item, 'label', false);
        return `${key || uuid().slice(8)}`;
      }

      return `${item}`;
    };

    /**
     * Tab label 값 반환
     */
    const getTabLabel = (item: TabDataType, index: number): string => {
      if (getLabel) {
        return getLabel(item, index);
      }

      return isObject(item) ? `${get(item, 'label', '')}` : `${item}`;
    };

    /**
     * Tab value 값 반환
     */
    const getTabValue = (item: TabDataType, index: number): string | number => {
      return getValue ? getValue(item, index) : index;
    };

    /**
     * 타겟 Tab이 선택된 Tab인지 여부를 체크
     */
    const isSelected = (item: TabDataType, index: number): boolean => {
      return selectValue === getTabValue(item, index);
    };

    /**
     * 이동할 scroll 위치 반환
     */
    const getMoveScrollPosition = (index: number): number | false => {
      const tab = tabs[index];

      if (!tab || !tablist.current) {
        return false;
      }

      const { offsetWidth: tablistW, scrollWidth: scrollW } = tablist.current;
      const { offsetWidth: tabW, offsetLeft: tabL } = tab;
      const sortingW = sortingRef.current ? sortingRef.current.offsetWidth - 12 : 0;

      const positionX = tabL + toNumber((tabW / 2).toFixed(1)) - toNumber(((tablistW - sortingW) / 2).toFixed(1));
      const scrollSize = scrollW - tablistW + sortingW;

      return Math.max(0, Math.min(positionX, scrollSize));
    };

    /**
     * scroll 이동
     */
    const moveToScroll = (
      start: number | null,
      current: number,
      startValue: number,
      endValue: number,
      duration: number,
    ) => {
      const startTime = start ?? current;
      const elapsedTime = current - startTime;

      if (Math.floor(elapsedTime) < duration && tablist.current) {
        tablist.current.scrollLeft = easeOutCubic(startTime, current, startValue, endValue, duration);
        requestId.current = window.requestAnimationFrame((timestamp) =>
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          moveToScroll(startTime, timestamp, startValue, endValue, duration),
        );
      } else if (sortingRef.current && tablistInner.current) {
        // scroll 이동이 종료되는 시점에 sorting 노출
        sortingRef.current.classList.add('is-show');
        sortingRef.current.classList.remove('is-show', 'is-hide');
        tablistInner.current.classList.remove('is-hide');
        setIsFilterSelected(false);
      }
    };

    /**
     * scroll 이동 취소
     */
    const cancelMoveToScroll = () => {
      requestId.current && window.cancelAnimationFrame(requestId.current);
    };

    /**
     * Tab 클릭시 실행할 이벤트 핸들러
     */
    const handleChangeTab =
      (item: TabDataType, index: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectValue(getTabValue(item, index)); // 탭활성화
        setTimeout(() => onChange?.(e, item, index), 0); // onChange 콜백 실행
        setIsFilterSelected(true);
      };

    /**
     * Sorting select-box width 지정
     */
    const setSortingWidth = (width: string) => {
      if (sortingLabelRef.current && sortingRef.current && tablist.current) {
        sortingLabelRef.current.innerText = width;
        /**
         * https://rxc.atlassian.net/browse/PRIZM-450
         */
        sortingRef.current.style.width = `${(sortingLabelRef.current.offsetWidth + 64) / 10}rem`;
        tablist.current.style.paddingRight = `${(sortingLabelRef.current.offsetWidth + 64) / 10}rem`;
      }
    };

    /**
     * Sorting 변경 시 실행할 핸들러
     */
    const handleChangeTabSorting = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const option = e.currentTarget.options;
      const label = option[option.selectedIndex].getAttribute('data-label') as GoodsSortingType;

      if (label) {
        onChangeTabSorting?.(label, option.selectedIndex, e);
      }

      setSortingWidth(e.currentTarget.value);
      setTabListMaskImage();
      setSortingLabel(label);
      setIsFilterSelected(true);
    };

    const debounceHandler = useMemo(
      () =>
        debounce(() => {
          window.requestAnimationFrame(() => {
            sortingRef.current?.classList.remove('is-show', 'is-hide');
            if (tablistInner.current) {
              tablistInner.current.classList.remove('is-hide');
            }
          });
        }, ANIMATION_DURATION / 2),
      [],
    );

    /**
     * scroll 이동에 따른 sorting 노출 제어
     */
    const handleScroll = useCallback(() => {
      if (!tablist.current || !sortingRef.current || !tablistInner.current) {
        return;
      }
      setScrollLeft(tablist.current.scrollLeft);

      // Filter가 선택된 상태일 경우, Sorting 인터랙션 미동작
      if (isFilterSelected) return;

      if (scrollLeft > 0 && scrollLeft < tablist.current.scrollLeft) {
        if (!sortingRef.current.classList.contains('is-hide')) {
          sortingRef.current.classList.add('is-hide');
          tablistInner.current.classList.add('is-hide');
          setTabListMaskImage();
          debounceHandler();
        }
      }
    }, [debounceHandler, scrollLeft, isFilterSelected]);

    /**
     * Sorting 영역 그라데이션 mask 처리
     */
    const setTabListMaskImage = () => {
      if (sortingRef.current && tablistInner.current) {
        const sortingW = sortingRef.current.offsetWidth;
        const maskImageSupported = 'maskImage' in document.body.style;
        const maskImageValue = `linear-gradient(90deg, #000 calc(100% - ${sortingW / 10}rem), transparent calc(100% - ${
          (sortingW - 12) / 10
        }rem)`;

        tablistInner.current.style.setProperty('--sorting-width', `${sortingW / 10}rem`);
        if (maskImageSupported) {
          tablistInner.current.style.maskImage = maskImageValue;
        } else {
          tablistInner.current.style.webkitMaskImage = maskImageValue;
        }
      }
    };

    /**
     * Sorting 변경 직후, 터치 스크롤 시도 시 Filter 선택 여부가 true로 유지되어 false로 초기화가 필요함
     */
    const handleTouchMove = () => {
      if (sortingRef.current && isFilterSelected) {
        setIsFilterSelected(false);
      }
    };

    /**
     * Sorting 노출 직후 is-hide is-init class 제거
     */
    const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          sortingRef.current?.classList.remove('is-hide', 'is-init');
          tablistInner.current?.classList.remove('is-hide', 'is-init');

          observer && observer.disconnect();
        }, 200);
      }
    };

    /**
     * props.value에 따른 selectValue update
     */
    useUpdateEffect(() => {
      setSelectValue(value || (value === 0 ? 0 : null));
    }, [value]);

    /**
     * selectValue변경시 탭을 이동
     */
    useUpdateEffect(() => {
      cancelMoveToScroll();

      const index = data.findIndex(isSelected);
      const startPosition = tablist.current?.scrollLeft || 0;
      const endPosition = getMoveScrollPosition(index);

      if (isNumber(startPosition) && isNumber(endPosition)) {
        requestId.current = window.requestAnimationFrame((timestamp) =>
          moveToScroll(timestamp, timestamp, startPosition, endPosition, ANIMATION_DURATION),
        );
      }
    }, [selectValue, sortingLabel]);

    /**
     * 초기화
     */
    useLayoutEffect(() => {
      const index = data.findIndex(isSelected);
      const position = getMoveScrollPosition(index);

      // 초기 탭 위치 설정
      isNumber(position) && tablist.current?.scrollTo({ left: position });

      if (sortingSelectRef.current && tablistInner.current) {
        /**
         * 선택한 Sorting 텍스트 너비만큼 Sorting 영역 너비 값을 지정
         */
        setSortingWidth(sortingSelectRef.current.selectedOptions[0].value);
        setTabListMaskImage();
      }
    }, []);

    /**
     * tablist 영역 스크롤 가능할 경우 observer 설정
     */
    useEffect(() => {
      if (!hasScroll) {
        return;
      }

      let observer: IntersectionObserver;

      if (container.current) {
        observer = new IntersectionObserver(handleVisibility, { threshold: 0.5 });
        observer.observe(container.current);
      }

      // eslint-disable-next-line consistent-return
      return () => {
        observer && observer.disconnect();
      };
    }, [hasScroll]);

    useEffect(() => {
      // 스크롤 유무 설정
      tablist.current && setHasScroll(tablist.current.scrollWidth > tablist.current.clientWidth);
    }, []);

    /**
     * ref setting
     */
    useImperativeHandle(ref, () => container.current as HTMLDivElement);

    return (
      <div ref={container} className={classNames} {...props}>
        <div className={classnames('tablist-inner', { 'is-hide is-init': hasScroll })} ref={tablistInner}>
          <div
            role="tablist"
            ref={tablist}
            className={`tablist ${sortingOptions ? 'has-sorting' : ''}`}
            onTouchStart={cancelMoveToScroll}
            onTouchMove={handleTouchMove}
            onScroll={handleScroll}
          >
            {data.map((item, index) => (
              <Tab
                type={type}
                ref={addTabElements}
                key={getTabKey(item, index)}
                label={getTabLabel(item, index)}
                value={getTabValue(item, index)}
                selected={isSelected(item, index)}
                onClick={handleChangeTab(item, index)}
              />
            ))}
          </div>
        </div>

        {/* Sorting */}
        {sortingOptions && (
          <div className={classnames('sorting-inner', { 'is-hide is-init': hasScroll })} ref={sortingRef}>
            <div className="sorting">
              <Select
                size="medium"
                ref={sortingSelectRef}
                defaultValue={defaultSortingLabel}
                onChange={handleChangeTabSorting}
              >
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.label} data-label={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <span className="sorting-label" ref={sortingLabelRef} />
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * figma tabs
 * @deprecated `@pui/tabs/v2`로 대체
 */
export const Tabs = styled(TabsComponent)`
  overflow: hidden;
  position: relative;

  .tablist-inner {
    display: flex;
    overflow: hidden;
    align-items: center;
    width: 100%;
    height: 4.8rem;
    transition: padding-right 0.4s, mask-size 0.4s, -webkit-mask-size 0.4s;
    mask-position: left;
    mask-size: 100% 100%;

    &.is-hide {
      padding-right: 0;
      mask-size: calc(100% + var(--sorting-width)) 100%;
    }
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

    &.has-sorting {
      display: block;
      padding-right: 0;
      white-space: nowrap;
    }
  }

  .sorting-inner {
    ${({ theme }) => theme.absolute({ t: 0, r: 0, b: 0 })};
    display: flex;
    align-items: center;
    padding-right: 1.2rem;
    padding-left: 1.2rem;
    transition: transform 0.4s;

    .sorting {
      flex: 1;
    }

    ${Select} {
      .select-box {
        height: 3.2rem;
        background: transparent;

        &::after {
          display: none;
        }
      }

      .select-native {
        padding-right: 3rem;
        padding-left: 0.8rem;
      }

      .suffix-box {
        right: 0.8rem;

        path {
          fill: ${({ theme }) => theme.color.gray50} !important;
        }
      }

      select {
        color: ${({ theme }) => theme.color.text.textTertiary};
      }

      &:active {
        .select-box {
          background: ${({ theme }) => theme.color.states.pressedCell};
        }
      }

      &:focus-within {
        .icon {
          transform: none;
        }
      }
    }

    .sorting-label {
      opacity: 0;
      ${({ theme }) => theme.absolute({ t: 0, r: 0 })};
      pointer-events: none;
    }

    &.is-hide {
      transform: translateX(100%);
    }

    &.is-show {
      transform: translateX(0%);
      transition-duration: 0.25s;
    }
  }

  .is-init {
    transition: none;
  }
` as (<T extends TabDataType = TabDataType>(
  props: TabsProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<React.ForwardRefExoticComponent<TabsProps<T> & React.RefAttributes<HTMLDivElement>>>) &
  string;
