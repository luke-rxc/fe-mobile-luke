import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { TabsFloat } from '@pui/tabsFloating';
import type { TabFloatItemType } from '@pui/tabsFloating';
import type {
  ContentLogInfoModel,
  NavigationDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useContentStoreService, useLogService } from '../../../services';
import { useContentStore } from '../../../stores';

const NavigationComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, navigationList } = preset;
  const displayValues = JSON.parse(contents) as NavigationDisplayModel;
  const { tabBackgroundColor, tabTextColor } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { logPresetNavigationInit, logPresetNavigationTab } = useLogService();
  const { isIOS, isApp } = useDeviceDetect();
  const { tintColor, textColor } = useContentStore.use.showroom();
  const { topBar, navigationHeight } = useContentStore.use.pageView();
  const { show, activeId } = useContentStore.use.navigation();
  const { handleUpdateNavigationActiveMenu } = useContentStoreService();
  const isFirstVisibleSection = useRef<boolean>(false);
  const availableScrollActive = useRef<boolean>(true); // 페이지 스크롤시 탭 활성화 처리
  const currentIndex = useRef<number>(-1);
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const [activeNum, setActiveNum] = useState(-1);
  const [showState, setShowState] = useState<boolean>(false);
  const [transition, setTransition] = useState<boolean>(false);

  const tabList = useMemo(() => {
    return navigationList.map((item): TabFloatItemType => {
      return {
        ...item,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 네비게이션 메뉴 클릭
   */
  const handleClickTab = useCallback(
    (e, tabItem: TabFloatItemType) => {
      const targetPreset = document.getElementById(`preset-${tabItem.id}`); // id='preset-n'
      if (!targetPreset) return;

      availableScrollActive.current = false;
      const targetIndex = tabList.findIndex((item) => item.id === tabItem.id);
      currentIndex.current = targetIndex;
      setActiveNum(targetIndex);
      handleUpdateNavigationActiveMenu(tabItem.id);

      const targetScrollTop = targetPreset.offsetTop - topBar - navigationHeight; // 상단 탑바 + 네비게이션 아래로  Anchor point 위치

      window.scrollTo({
        top: targetScrollTop,
        left: 0,
        behavior: 'smooth',
      });

      if (timeId.current) clearTimeout(timeId.current);
      timeId.current = setTimeout(() => {
        availableScrollActive.current = true;
      }, 1000);

      logPresetNavigationTab(contentLogInfo, targetIndex, tabItem.label);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleChangeMenu = useCallback(
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

  useEffect(() => {
    handleChangeMenu(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    if (show) {
      setTransition(true);
      if (!isFirstVisibleSection.current) {
        isFirstVisibleSection.current = true;
        logPresetNavigationInit(contentLogInfo);
      }
    }
    setShowState(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <FixedLayoutStyled
          topBar={topBar}
          isIOS={isIOS}
          isApp={isApp}
          tabBgColor={tabBackgroundColor || tintColor}
          tabTextColor={tabTextColor || textColor}
          className={classNames({
            'is-in': showState,
            'is-out': !showState,
            'is-visible': visible,
            'is-transition': transition,
          })}
        >
          <div className="inner">
            <TabsFloat tabs={tabList} active={activeNum} onClickTab={handleClickTab} />
          </div>
        </FixedLayoutStyled>
      )}
    </div>
  );
});

const Navigation = styled(NavigationComponent)``;
export default Navigation;

const FixedLayoutStyled = styled.div.attrs(
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
  left: 0%;
  width: 100%;
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
    height: 6.4rem;
    padding: 1.2rem 1.6rem;
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
