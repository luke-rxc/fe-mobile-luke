import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useEffect,
  useContext,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { WebHeaderHeight } from '@constants/ui';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { TabItemType, TabsFloating } from '@pui/tabsFloating/TabsFloating';
import { PresetContext } from '../../../context';
import type { NavigationComponentRefModel, NavigationProps } from '../../../models';
import { useLogService } from '../../../services';

const NavigationComponent = forwardRef<NavigationComponentRefModel, NavigationProps>(
  ({ className, tabBackgroundColor, tabTextColor, showroom, navigationList = [], contentInfo, visible }, ref) => {
    const { scrollNavigationView } = useContext(PresetContext);
    const { isIOS, isApp } = useDeviceDetect();
    const { initializeValues } = useWebInterface();
    const { logPresetNavigationInit, logPresetNavigationTab } = useLogService();
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const availableScrollActive = useRef<boolean>(true); // 페이지 스크롤시 탭 활성화 처리
    const currentIndex = useRef<number>(-1);
    const timeId = useRef<NodeJS.Timeout | null>(null);
    const tabList = useMemo((): TabItemType[] => navigationList.map((item) => item), [navigationList]);
    const [showState, setShowState] = useState<boolean>(false);
    const [transition, setTransition] = useState<boolean>(false);
    const [topBarHeight, setTopBarHeight] = useState(isApp ? WebHeaderHeight * 2 : WebHeaderHeight);
    const [activeNum, setActiveNum] = useState(-1);
    const [renderTab, setRenderTab] = useState(false); // 라우팅 변경시 네비게이션 컴포넌트를 새로 그리기 위한 state 설정

    /**
     * 외부 호출을 통한 활성화 변경
     */
    const handleChangeTab = useCallback(
      (targetId: number) => {
        if (!availableScrollActive.current) return;
        const targetIndex = tabList.findIndex((item) => item.id === targetId);
        if (currentIndex.current !== targetIndex) {
          setActiveNum(targetIndex);
          currentIndex.current = targetIndex;
        }
      },
      [tabList],
    );

    /**
     * 네비게이션 메뉴 클릭
     */
    const handleClickTab = useCallback(
      (e, tabItem: TabItemType) => {
        availableScrollActive.current = false;
        const targetIndex = tabList.findIndex((item) => item.id === tabItem.id);
        const targetTab = tabList.find((item) => item.id === tabItem.id);
        currentIndex.current = targetIndex;
        setActiveNum(targetIndex);

        // 페이지 스크롤 이동
        if (targetTab) {
          scrollNavigationView(targetTab.id);
        }

        if (timeId.current) clearTimeout(timeId.current);
        timeId.current = setTimeout(() => {
          availableScrollActive.current = true;
        }, 1000);

        logPresetNavigationTab(contentInfo, targetIndex, targetTab?.label || '');
      },
      [contentInfo, logPresetNavigationTab, scrollNavigationView, tabList],
    );

    /**
     * 네비게이션 노출모션 처리
     */
    const handleShowNavigation = useCallback((isShow: boolean) => {
      setTransition(true);
      setShowState(isShow);
    }, []);

    useEffect(() => {
      if (!visible) return;
      if (showState && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetNavigationInit(contentInfo);
      }
    }, [contentInfo, logPresetNavigationInit, showState, visible]);

    useEffect(() => {
      setRenderTab(false);
      window.requestAnimationFrame(() => setRenderTab(true));
      return () => {
        isFirstVisibleSection.current = false;
      };
    }, [navigationList]);

    /**
     * 웹뷰 Top 시스템 영역 사이즈
     */
    useLayoutEffect(() => {
      if (!isApp) return;
      if (initializeValues && initializeValues.topInset) {
        setTopBarHeight(initializeValues.topInset);
      }
    }, [initializeValues, isApp]);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
      active: handleChangeTab,
      show: handleShowNavigation,
    }));

    return (
      <div>
        <FixedLayout
          ref={containerRef}
          topBar={topBarHeight}
          isIOS={isIOS}
          isApp={isApp}
          tabBgColor={tabBackgroundColor || showroom.tintColor}
          tabTextColor={tabTextColor || showroom.textColor}
          className={classNames(className, {
            'is-in': showState,
            'is-out': !showState,
            'is-visible': visible,
            'is-transition': transition,
          })}
        >
          <div className="inner">
            {renderTab && <TabsFloating tabs={tabList} active={activeNum} onClickTab={handleClickTab} />}
          </div>
        </FixedLayout>
      </div>
    );
  },
);

/**
 * 네비게이션 컴포넌트
 */
export const Navigation = styled(NavigationComponent)``;

const FixedLayout = styled.div.attrs(
  ({
    topBar,
    isIOS,
    isApp,
    tabBgColor,
    tabTextColor,
  }: {
    topBar: number;
    isIOS: boolean;
    isApp: boolean;
    tabBgColor: string;
    tabTextColor: string;
  }) => {
    return {
      topBar,
      isIOS,
      isApp,
      tabBgColor,
      tabTextColor,
    };
  },
)`
  display: none;
  position: fixed;
  ${({ theme, topBar, isApp, isIOS }) => theme.mixin.safeArea('top', isApp && isIOS ? 0 : topBar)};
  ${({ theme }) => theme.mixin.z('header', -2)};
  width: 100%;
  left: 0%;
  transform: ${({ topBar }) => `translate3d(0%, ${topBar * -2}px, 0rem)`};
  &.is-visible {
    display: block;
  }
  &.is-transition {
    transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  }
  &.is-in {
    transform: translate3d(0%, 0rem, 0rem);
  }
  &.is-out {
    transform: ${({ topBar }) => `translate3d(0%, ${topBar * -2}px, 0rem)`};
  }

  & > .inner {
    padding: 1.2rem 1.6rem;
    height: 6.4rem;
  }

  & .tabs {
    & .bg {
      background-color: ${({ tabBgColor }) => tabBgColor || ''}!important;
    }

    & .item.is-active {
      color: ${({ tabTextColor }) => tabTextColor || ''}!important;
    }
  }
`;
