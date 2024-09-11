import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, SyntheticEvent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';

export type TabItemType = {
  id: number;
  label: string;
};
export type TabsFloatingProps = HTMLAttributes<HTMLDivElement> & {
  /** 탭 메뉴 */
  tabs: TabItemType[];
  /** 활성화 인덱스 */
  active?: number;
  /** 탭 클릭 cb */
  onClickTab?: (e: SyntheticEvent<HTMLButtonElement>, tab: TabItemType) => void;
};

/**
 * 탭 플로팅 메뉴
 */
const TabsFloatingComponent = forwardRef<HTMLDivElement, TabsFloatingProps>(
  ({ className, tabs = [], active = -1, onClickTab, ...props }, ref) => {
    const { isIOS, isAndroid } = useDeviceDetect();
    const tabWrapperRef = useRef<HTMLDivElement>(null);
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const requestAnimId = useRef<number | null>(null);
    const scrollSpeedX = useRef<number>(0);
    const tabScrollX = useRef<number>(0);
    const tabScrollWidth = useRef<number>(0);
    const tabScrollOffsetWidth = useRef<number>(0);
    const viewWidth = useRef<number>(window.innerWidth);
    const maskEndSize = 48;
    const maskStartSize = 0;
    const maskBoundary = 16;

    const [activeIndex, setActiveIndex] = useState<number>(active);
    const [isShortTab, setIsShortTab] = useState(false);

    const handleActiveItem = useCallback((targetIndex: number) => {
      const targetEls = listRef.current?.querySelectorAll('.item');
      if (targetEls && targetEls.length && listWrapperRef.current && listRef.current) {
        setActiveIndex(targetIndex);
        const targetEl = targetEls[targetIndex] as HTMLDivElement;
        if (!targetEl && bgRef.current) {
          bgRef.current.style.opacity = '0';
          return;
        }
        const { offsetWidth, offsetLeft } = targetEl;
        if (bgRef.current) {
          bgRef.current.style.opacity = '1';
          bgRef.current.style.width = `${Math.floor(offsetWidth)}px`;

          let targetX = Math.floor(offsetLeft);
          targetX = Math.min(targetX, listRef.current.offsetWidth - offsetWidth); // 소수점 계산으로 인해 최대 위치 벗어나는 경우 처리
          bgRef.current.style.transform = `translate3d(${Math.floor(targetX)}px, 0, 0)`;
        }

        // 가운데 정렬
        const targetLeft = offsetLeft - (listWrapperRef.current.offsetWidth - offsetWidth) / 2;
        listWrapperRef.current.scrollTo({
          top: 0,
          left: targetLeft,
          behavior: 'smooth',
        });
      }
    }, []);

    /**
     * 탭 메뉴 클릭
     */
    const handleClickItem = useCallback(
      (e, targetIndex: number) => {
        handleActiveItem(targetIndex);
        onClickTab?.(e, tabs[targetIndex]);
      },
      [handleActiveItem, onClickTab, tabs],
    );

    const handleMask = useCallback(() => {
      if (!listWrapperRef.current) return;
      const scrollLeft = tabScrollX.current;
      const targetLeftMask =
        tabScrollOffsetWidth.current - Math.min((scrollLeft * maskEndSize) / maskBoundary, maskEndSize);
      const w = tabScrollWidth.current - tabScrollOffsetWidth.current;
      const targetRightMask = Math.min(
        ((scrollLeft - (w - maskBoundary)) * (maskStartSize - maskEndSize)) / (w - (w - maskBoundary)) + maskEndSize,
        maskEndSize,
      );

      const targetMask = `linear-gradient(270deg,transparent 0px, rgba(0, 0, 0, 1) ${targetRightMask}px, rgba(0, 0, 0, 1) ${targetLeftMask}px, transparent 100%)`;

      listWrapperRef.current.style.maskImage = targetMask;
      listWrapperRef.current.setAttribute('style', `-webkit-mask-image: ${targetMask};`);
    }, []);

    const playAnimation = useCallback(() => {
      // 스크롤이 움직이는 일정 구간만 애니메이션 프레임 처리
      scrollSpeedX.current += (tabScrollX.current - scrollSpeedX.current) * 0.1;
      if (Math.abs(tabScrollX.current - scrollSpeedX.current) < 0.2) {
        scrollSpeedX.current = tabScrollX.current;
        if (requestAnimId.current) {
          cancelAnimationFrame(requestAnimId.current);
          requestAnimId.current = null;
          return;
        }
      }
      handleMask();
      requestAnimId.current = requestAnimationFrame(playAnimation);
    }, [handleMask]);

    const handleTabSize = useCallback(() => {
      if (!tabWrapperRef.current || !listRef.current) return;
      const tabWrapperEl = tabWrapperRef.current;
      const listEl = listRef.current;
      const isShort = tabWrapperEl.offsetWidth > listEl.offsetWidth + 8;

      if (!isShort) return;

      const targetEls = listEl.querySelectorAll('.item');
      if (!targetEls || !targetEls.length) return;

      const minWidth = tabWrapperEl.offsetWidth / tabs.length;
      let isEquality = true; // 탭 동일 사이즈 여부
      targetEls.forEach((item) => {
        const el = item as HTMLElement;
        const { offsetWidth } = el;
        if (offsetWidth > minWidth) {
          isEquality = false;
        }
      });

      if (isEquality) {
        const targetWidth = 100 / tabs.length;
        targetEls.forEach((item) => {
          const el = item as HTMLElement;
          el.style.width = `${targetWidth}%`;
        });
      }
      window.requestAnimationFrame(() => {
        setIsShortTab(isShort);
        handleActiveItem(activeIndex);
        if (listWrapperRef.current) {
          listWrapperRef.current.style.maskImage = '';
          listWrapperRef.current.setAttribute('style', '');
        }
      });
    }, [activeIndex, handleActiveItem, tabs.length]);

    /**
     * Resize Event 처리
     */
    const handleResize = useCallback(() => {
      const currentViewWidth = window.innerWidth;
      if (viewWidth.current === currentViewWidth) return;

      if (!tabWrapperRef.current || !listRef.current) return;
      const listEl = listRef.current;
      const targetEls = listEl.querySelectorAll('.item');
      if (!targetEls || !targetEls.length) return;
      targetEls.forEach((item) => {
        const el = item as HTMLElement;
        el.style.width = 'initial';
      });

      setIsShortTab(false);
      handleTabSize();
      handleActiveItem(active);
      if (listWrapperRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = listWrapperRef.current;
        tabScrollX.current = scrollLeft;
        tabScrollWidth.current = scrollWidth;
        tabScrollOffsetWidth.current = offsetWidth;

        handleMask();
      }

      viewWidth.current = currentViewWidth;
    }, [active, handleActiveItem, handleMask, handleTabSize]);

    useEffect(() => {
      handleActiveItem(active);
    }, [active, activeIndex, handleActiveItem]);

    /**
     * Resize Event
     * - 해당 실행을 보장하기 위해 따로 useEffect 초기로직 구성
     */
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      window.removeEventListener('visibilitychange', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('visibilitychange', handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 마스크 상태
     */
    useEffect(() => {
      if (isShortTab || !listWrapperRef.current) return;

      const {
        scrollLeft: initScrollLeft,
        offsetWidth: initOffsetWidth,
        scrollWidth: initScrollWidth,
      } = listWrapperRef.current;
      tabScrollX.current = initScrollLeft;
      tabScrollWidth.current = initScrollWidth;
      tabScrollOffsetWidth.current = initOffsetWidth;

      listWrapperRef.current.addEventListener('scroll', ({ target }) => {
        const el = target as HTMLDivElement;
        const { scrollLeft, offsetWidth, scrollWidth } = el;
        tabScrollX.current = scrollLeft;
        tabScrollWidth.current = scrollWidth;
        tabScrollOffsetWidth.current = offsetWidth;
        playAnimation();
      });

      playAnimation();
    }, [isShortTab, playAnimation]);

    /**
     * 탭 사이즈
     */
    useEffect(() => {
      handleTabSize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={ref} className={classNames(className, 'tabs')} {...props}>
        <div
          className={classNames('tab-inner', {
            'is-ios': isIOS,
            'is-short': isShortTab,
          })}
          ref={tabWrapperRef}
        >
          <div className="list-wrapper" ref={listWrapperRef}>
            <div className="bg" ref={bgRef} />
            <div className="list" ref={listRef}>
              {tabs.map((item, index) => (
                <Action
                  type="button"
                  key={`${item.id}`}
                  className={classNames('item', {
                    'is-active': activeIndex === index,
                    'is-aos': isAndroid,
                  })}
                  onClick={(e) => handleClickItem(e, index)}
                >
                  {item.label}
                </Action>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

/**
 * Figma 탭 플로팅타입 컴포넌트
 */
export const TabsFloating = styled(TabsFloatingComponent)`
  & .tab-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: 4rem;
    border-radius: 2rem;
    background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};

    &.is-ios {
      background: rgba(44, 44, 44, 0.4);
      backdrop-filter: blur(2.5rem);
    }

    &.is-short {
      justify-content: start;

      & .list-wrapper {
        overflow-x: hidden;
        width: 100%;
      }
      & .list {
        width: calc(100% - 0.8rem);
        & .item {
          flex-grow: 1;
        }
      }
    }

    & .list-wrapper {
      position: relative;
      height: 100%;
      overflow: hidden;
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
      }

      & .bg {
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        height: 3.2rem;
        background: ${({ theme }) => theme.color.brand.tint};
        border-radius: 2rem;
        transition: width 0.2s ease-in-out, transform 0.2s ease-in-out;
      }

      & .list {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0.4rem;
        transform: translateZ(0);
        & .item {
          position: relative;
          white-space: nowrap;
          height: 3.2rem;
          padding: 0 1.6rem;
          font: ${({ theme }) => theme.fontType.small};
          font-weight: ${({ theme }) => theme.fontWeight.regular};
          color: ${({ theme }) => `${theme.color.gray50Dark}`};
          &.is-aos {
            color: ${({ theme }) => (theme.isDarkMode ? `${theme.color.gray50Light}` : `${theme.color.gray50Dark}`)};
          }
          &.is-active {
            font-weight: ${({ theme }) => theme.fontWeight.bold};
            color: ${({ theme }) => theme.color.white};
          }
        }
      }
    }
  }
`;
