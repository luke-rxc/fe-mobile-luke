import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { useContentStoreService } from '../services';
import { useContentStore } from '../stores';

/**
 * 네비게이션 영역 구분을 위한 탭 컴포넌트
 * @returns
 */
export const ContentTabSection: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children }) => {
  const { topBar, navigationHeight } = useContentStore.use.pageView();
  const { handleUpdateShowNavigation, handleUpdateNavigationActiveMenu } = useContentStoreService();
  const sectionElRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevShowTabValue = useRef<boolean>(false);
  const prevActiveIdValue = useRef<number>(-1);
  const [inView, setInView] = useState(false);

  const sectionRef = useCallback((el) => {
    if (!el || sectionElRef.current) return;
    observer.current = new IntersectionObserver(handleIntersectionObserver, {
      threshold: 0,
    });
    observer.current.observe(el);
    sectionElRef.current = el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntersectionObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      setInView(entry.isIntersecting);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 네비게이션 활성화 될 프리셋 id 조회
   */
  const handleGetActiveId = useCallback(
    (scrollTop: number) => {
      if (!sectionElRef.current || !sectionElRef.current.childNodes) return;

      const childEl = sectionElRef.current.childNodes;
      let targetId = -1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      childEl.forEach((el: any) => {
        const element = el as HTMLDivElement;
        if (!element.classList.contains('is-anchor')) return;
        const elTop = element.offsetTop;
        const tgTop = elTop - topBar - navigationHeight;
        if (scrollTop >= tgTop) {
          targetId = +el.id.split('-')[1]; // id='preset-n'
        }
      });

      if (prevActiveIdValue.current !== targetId) {
        handleUpdateNavigationActiveMenu(targetId);
        prevActiveIdValue.current = targetId;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigationHeight, topBar],
  );

  /**
   * 네비게이션 노출 여부
   */
  const handleGetShowTab = useCallback(
    (scrollTop: number) => {
      if (!sectionElRef.current || !sectionElRef.current.childNodes) return;

      const elTop = sectionElRef.current.offsetTop;
      const diff = topBar + navigationHeight;

      const isNavigationIn =
        scrollTop > 0 && scrollTop >= elTop - diff && scrollTop < elTop + sectionElRef.current.offsetHeight - diff;
      if (prevShowTabValue.current !== isNavigationIn) {
        handleUpdateShowNavigation(isNavigationIn);
        prevShowTabValue.current = isNavigationIn;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigationHeight, topBar],
  );

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    handleGetActiveId(scrollTop);
    handleGetShowTab(scrollTop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const throttledScroll = useMemo(() => {
    return throttle(handleScroll, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 스크롤 이벤트 등록
   */
  useEffect(() => {
    if (inView) {
      window.addEventListener('scroll', throttledScroll);
      handleScroll();
    } else {
      window.removeEventListener('scroll', throttledScroll);
      // 탭 영역 아웃시 네비게이션 미노출
      handleUpdateShowNavigation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const obs = observer.current;
    window.addEventListener('resize', handleScroll);
    return () => {
      obs && obs.disconnect();
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', throttledScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames(className, 'tab-section')} ref={sectionRef}>
      {children}
    </div>
  );
};
