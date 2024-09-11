import { useEffect, useCallback, useRef, useLayoutEffect, useState } from 'react';
import { throttle } from 'lodash';
import { WebHeaderHeight } from '@constants/ui';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { useWebInterface } from '@hooks/useWebInterface';
import { PresetType } from '../constants';
import { useAnimationFrame } from '../hooks';
import type {
  NavigationComponentRefModel,
  PresetContents,
  PresetModel,
  PresetRefModel,
  PresetSectionModel,
} from '../models';

/**
 * 탭 섹션 스크롤 서비스
 */
export const useContentTabScrollService = ({
  presetData,
  presetSection,
}: {
  presetData: PresetModel<PresetContents>[];
  presetSection: PresetSectionModel; // 프리셋 섹션 정보
}) => {
  const { isApp } = useDeviceDetect();
  const { initializeValues } = useWebInterface();
  const { inView, subscribe, unsubscribe } = useIntersection(); // 뷰포트 교차
  const tabSectionElRef = useRef<HTMLDivElement | null>(null);
  const childEl = useRef<NodeListOf<ChildNode> | null>(null);
  const navigationComponent = useRef<NavigationComponentRefModel | null>(null); // 네비게이션 컴포넌트
  const navigationHeight = useRef(0); // 네비게이션 사이즈
  const topBarHeight = useRef(WebHeaderHeight); // 탑 영역 사이즈
  const [isShowTab, setIsShowTab] = useState<boolean>(false);
  const [presetComp, setPresetComp] = useState<PresetRefModel[]>([]);

  const loop = useCallback(() => {
    if (!tabSectionElRef.current) return;
    const scrollTop = window.scrollY;
    const elTop = tabSectionElRef.current.offsetTop;
    const diff = topBarHeight.current + navigationHeight.current;

    const isNavigationIn =
      scrollTop > 0 && scrollTop >= elTop - diff && scrollTop < elTop + tabSectionElRef.current.offsetHeight - diff;
    setIsShowTab(isNavigationIn);
  }, []);

  const { inView: navigationInView } = useAnimationFrame({
    sectionRef: tabSectionElRef,
    viewRatio: 0,
    onRequestFrame: loop,
  });

  const tabSectionRef = useCallback(
    (el) => {
      if (el) {
        unsubscribe();
        tabSectionElRef.current = el as HTMLDivElement;
        childEl.current = el.childNodes;
        subscribe(el, { threshold: 0 });
      }
    },
    [subscribe, unsubscribe],
  );

  /**
   * 네비게이션 메뉴 활성화
   */
  const handleChangeTabActive = useCallback((active: number) => {
    if (!navigationComponent.current) {
      return;
    }
    (navigationComponent.current as NavigationComponentRefModel).active(active);
  }, []);

  /**
   * 네비게이션 노출 여부
   */
  const handleVisibleTab = useCallback((visible: boolean) => {
    if (!navigationComponent.current) {
      return;
    }
    (navigationComponent.current as NavigationComponentRefModel).show(visible);
  }, []);

  /**
   * 페이지 스크롤 이동
   */
  const handleScrollTo = useCallback((targetX: number, targetY: number) => {
    window.scrollTo({
      top: targetY,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  /**
   * 타겟 컴포넌트 위치로 스크롤 이동
   */
  const handleScrollNavigation = useCallback(
    (index: number) => {
      const targetPresetRef = presetComp[index];
      if (!targetPresetRef) return;

      const presetElement = targetPresetRef.ref;
      const targetScrollTop = presetElement.offsetTop - topBarHeight.current - navigationHeight.current; // 상단 탑바 + 네비게이션 아래로  Anchor point 위치
      handleScrollTo(0, targetScrollTop);
    },
    [handleScrollTo, navigationHeight, presetComp, topBarHeight],
  );

  /**
   * 스크롤시 활성화 조회
   */
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    if (!childEl.current) return;
    let targetIndex = -1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    childEl.current.forEach((el: any, idx: number) => {
      const element = el as HTMLDivElement;
      if (!element.classList.contains('is-anchor')) return;
      const elTop = element.offsetTop;
      const tgTop = elTop - topBarHeight.current - navigationHeight.current;
      if (scrollTop >= tgTop) {
        targetIndex = idx;
      }
    });
    handleChangeTabActive(targetIndex < 0 ? targetIndex : targetIndex + presetSection.navigationIndex); // 네비게이션의 id값 기준 active 처리
  }, [handleChangeTabActive, presetSection.navigationIndex]);

  const throttledScroll = throttle(handleScroll, 100);

  const handleUpdatePresetRef = useCallback((v: PresetRefModel[]) => {
    setPresetComp(v);
  }, []);

  /**
   * 웹뷰 Top 시스템 영역 사이즈
   */
  useLayoutEffect(() => {
    if (!isApp) return;
    if (initializeValues && initializeValues.topInset) {
      topBarHeight.current = initializeValues.topInset;
    }
  }, [initializeValues, isApp]);

  /**
   * 스크롤 이벤트 등록
   */
  useEffect(() => {
    if (inView) {
      window.addEventListener('scroll', throttledScroll);
      handleScroll();
    } else {
      window.removeEventListener('scroll', throttledScroll);
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [throttledScroll, inView, handleScroll]);

  useEffect(() => {
    // 탭 아웃시 네비게이션 미노출
    if (!navigationInView) {
      setIsShowTab(false);
    }
  }, [navigationInView]);

  /**
   * 네비게이션 노출 cb
   */
  useEffect(() => {
    handleVisibleTab(isShowTab);
  }, [isShowTab, handleVisibleTab]);

  /**
   * 네비게이션 컴포넌트 조회
   */
  useEffect(() => {
    if (presetData && presetComp) {
      const navigationIndex = presetData.findIndex((component) => component.presetType === PresetType.NAVIGATION);
      const target = presetComp[navigationIndex] as NavigationComponentRefModel;
      navigationComponent.current = target;
      if (navigationComponent.current?.ref) {
        navigationHeight.current = navigationComponent.current.ref.offsetHeight || 0;
      }
    }
  }, [presetComp, presetData]);

  useEffect(() => {
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tabSectionRef,
    handleScrollNavigation,
    handleUpdatePresetRef,
  };
};
