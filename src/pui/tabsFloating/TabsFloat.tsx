import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, SyntheticEvent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';

export type TabFloatItemType = {
  id: number;
  label: string;
};
export type TabsFloatProps = HTMLAttributes<HTMLDivElement> & {
  /** 탭 메뉴 */
  tabs: TabFloatItemType[];
  /** 활성화 인덱스 */
  active?: number;
  /** 탭 클릭 cb */
  onClickTab?: (e: SyntheticEvent<HTMLButtonElement>, tab: TabFloatItemType) => void;
};

/**
 * 탭 플로팅 메뉴 v2 버전
 */
const TabsFloatComponent = forwardRef<HTMLDivElement, TabsFloatProps>(
  ({ className, tabs = [], active = -1, onClickTab, ...props }, ref) => {
    const { isIOS, isAndroid } = useDeviceDetect();
    const tabWrapperRef = useRef<HTMLDivElement>(null);
    const listWrapperRef = useRef<HTMLDivElement | null>(null);
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
    const observer = useRef<ResizeObserver | null>(null);
    const listContainerRef = useCallback((el) => {
      if (!el) return;

      observer.current = new ResizeObserver(handleResizeObserver);
      observer.current.observe(el);
      listWrapperRef.current = el;
      listWrapperRef.current?.addEventListener('scroll', handleContainerListScroll);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 탭 메뉴 클릭
     */
    const handleClickItem = (e: SyntheticEvent<HTMLButtonElement>, targetIndex: number) => {
      handleActiveItem(targetIndex);
      onClickTab?.(e, tabs[targetIndex]);
    };

    /**
     * mask value 업데이트
     */
    const handleSetMask = useCallback(() => {
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

    /**
     * 스크롤시 양옆 마스크 모션 처리
     */
    const handlePlayAnimationMask = useCallback(() => {
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
      handleSetMask();
      requestAnimId.current = requestAnimationFrame(handlePlayAnimationMask);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 탭 메뉴 활성화 표시
     */
    const handleActiveItem = useCallback((targetIndex: number) => {
      if (!listWrapperRef.current || !listRef.current) return;
      const targetEls = listRef.current.querySelectorAll('.item');
      if (!targetEls || !targetEls.length) return;

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
    }, []);

    /**
     * 화면 리사이즈 처리
     */
    const handleResize = useCallback(() => {
      const currentViewWidth = window.innerWidth;
      if (viewWidth.current === currentViewWidth) return;

      if (!listRef.current) return;
      const listEl = listRef.current;
      const targetEls = listEl.querySelectorAll('.item');
      if (!targetEls || !targetEls.length) return;

      targetEls.forEach((item) => {
        const el = item as HTMLElement;
        el.style.width = 'initial';
      });

      setIsShortTab(false);
      // 초기화 후 다시 렌더
      setTimeout(() => {
        handleTabSize();
        handleActiveItem(active);
      }, 100);

      viewWidth.current = currentViewWidth;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    /**
     * 스크롤 정보 업데이트
     * @param scrollX
     * @param scrollWidth
     * @param scrollOffsetWidth
     */
    const handleUpdateTabScrollValue = (scrollX = 0, scrollWidth = 0, scrollOffsetWidth = 0) => {
      tabScrollX.current = scrollX;
      tabScrollWidth.current = scrollWidth;
      tabScrollOffsetWidth.current = scrollOffsetWidth;
    };

    /**
     * 현재 탭 메뉴 구성이 숏타입인지 조회
     * @returns
     */
    const handleGetIsShortType = () => {
      const tabWrapperEl = tabWrapperRef.current;
      const listEl = listRef.current;
      if (!tabWrapperEl || !listEl) return false;
      return tabWrapperEl.offsetWidth > listEl.offsetWidth + 8; // 여백을 포함한 탭 리스트 길이가 컨테이너보다 작으면 숏타입
    };

    /**
     * 탭 길이 체크
     */
    const handleTabSize = () => {
      const tabWrapperEl = tabWrapperRef.current;
      const listEl = listRef.current;
      if (!tabWrapperEl || !listEl) return;

      const isShort = handleGetIsShortType();
      setIsShortTab(isShort);
      if (!isShort) return;

      const targetEls = listRef.current?.querySelectorAll('.item');
      if (!targetEls || !targetEls.length) return;

      // 숏타입인 경우, 메뉴 별로 가로길이 사이즈를 강제
      // - 전체 영역 사이즈를 탭 메뉴 개수만큼 나눈 길이 안에서 각각의 메뉴 크기가 벗어나지 않는 경우 균등하게 1/n 사이즈로 처리
      // - 위 케이스에 해당 되지 않는 경우 각 메뉴가 가지고 있는 길이 대로 처리
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
    };

    const handleContainerListScroll = (e: Event) => {
      const el = e.target as HTMLDivElement;
      const { scrollLeft, offsetWidth, scrollWidth } = el;
      handleUpdateTabScrollValue(scrollLeft, scrollWidth, offsetWidth);
      handlePlayAnimationMask();
    };

    /** 리스트 컨테이너 사이즈 변경 감지 */
    const handleResizeObserver = (entries: ResizeObserverEntry[]) => {
      entries.forEach((entry: ResizeObserverEntry) => {
        const targetEl = entry.target as HTMLDivElement;
        const { scrollLeft, offsetWidth, scrollWidth } = targetEl;
        handleUpdateTabScrollValue(scrollLeft, scrollWidth, offsetWidth);
        handlePlayAnimationMask();
      });
    };

    useEffect(() => {
      // 탭 사이즈 체크
      handleTabSize();

      const obs = observer.current;
      window.addEventListener('resize', handleResize);
      window.removeEventListener('visibilitychange', handleResize);
      return () => {
        obs && obs.disconnect();
        listWrapperRef.current?.removeEventListener('scroll', handleContainerListScroll);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('visibilitychange', handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 메뉴 활성화값 변경시
     */
    useEffect(() => {
      handleActiveItem(active);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, activeIndex]);

    return (
      <div ref={ref} className={classNames(className, 'tabs')} {...props}>
        <div
          className={classNames('tab-inner', {
            'is-ios': isIOS,
            'is-short': isShortTab,
          })}
          ref={tabWrapperRef}
        >
          <div className="list-wrapper" ref={listContainerRef}>
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
export const TabsFloat = styled(TabsFloatComponent)`
  & .tab-inner {
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    height: 4rem;
    border-radius: 2rem;
    background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};

    &.is-ios {
      background: rgba(44, 44, 44, 0.4);
      backdrop-filter: blur(2.5rem);
    }

    & .list-wrapper {
      overflow: hidden;
      overflow-x: auto;
      position: relative;
      height: 100%;

      &::-webkit-scrollbar {
        display: none;
      }

      & .bg {
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        height: 3.2rem;
        border-radius: 2rem;
        background: ${({ theme }) => theme.color.brand.tint};
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
          height: 3.2rem;
          padding: 0 1.6rem;
          color: ${({ theme }) => `${theme.color.gray50Dark}`};
          font: ${({ theme }) => theme.fontType.small};
          font-weight: ${({ theme }) => theme.fontWeight.regular};
          line-height: 1.671rem;
          white-space: nowrap;

          &.is-aos {
            color: ${({ theme }) => (theme.isDarkMode ? `${theme.color.gray50Light}` : `${theme.color.gray50Dark}`)};
          }

          &.is-active {
            color: ${({ theme }) => theme.color.white};
            font-weight: ${({ theme }) => theme.fontWeight.bold};
          }
        }
      }
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
  }
`;
