/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useRef, useState, useLayoutEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import isNull from 'lodash/isNull';
import { useWindowScroll, useWindowSize } from 'react-use';
import { useLocation } from 'react-router-dom';
import { ReactComponent as LogoPrizm } from '@assets/logo_prizm.svg';
import { getWebLink } from '@utils/link';
import { WebLinkTypes } from '@constants/link';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { SVG } from '@pui/svg';

export interface MwebHeaderRef {
  header: HTMLElement | null;
  headerContainer: HTMLDivElement | null;
  stickyContainer: HTMLDivElement | null;
}

export interface MWebHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'prefix'> {
  /** 페이지 타이틀 */
  title?: string;
  /** 페이지 타이틀 로고 ULR(only svg) */
  titleImagePath?: string;
  /** 페이지 타이틀 하단 디스크립션 */
  description?: React.ReactNode;
  /** 페이지 타이틀 클릭시 이동할 URL */
  link?: string;
  /** 콘텐츠 위에 겹친 레이아웃 */
  overlay?: boolean;
  /** 유틸 영역 */
  utils?: React.ReactNode;
  /** 트랜지션 시작지점을 가리키는 요소 */
  transitionTrigger?: React.RefObject<HTMLElement>;
  /** 트랜지션 시작지점의 조정값 */
  transitionBuffer?: number;
  /**
   * 트랜지션이 시작점의 기준이 되는 교차점 설정
   *
   * transitionOffset[0] => header의 top, bottom
   * transitionOffset[1] => transitionTrigger의 top, bottom
   *
   * @default ['start', 'start'],
   */
  transitionOffset?: ['start' | 'end', 'start' | 'end'];
  /** 프리즘 로고 클릭 이벤트 콜백 */
  onClickPrizm?: React.MouseEventHandler<HTMLAnchorElement>;
  /** 타이틀 클릭 이벤트 콜백 */
  onClickTitle?: React.MouseEventHandler<HTMLAnchorElement>;
}

const MWebHeaderComponent = forwardRef<MwebHeaderRef, MWebHeaderProps>(
  (
    {
      title,
      titleImagePath,
      description,
      overlay,
      link = '#none',
      utils,
      className,
      transitionTrigger,
      transitionBuffer = 0,
      transitionOffset = ['start', 'start'],
      onClickPrizm,
      onClickTitle,
      ...props
    },
    ref,
  ) => {
    // window event hooks
    const size = useWindowSize();
    const scroll = useWindowScroll();

    // element refs
    const header = useRef<HTMLElement | null>(null);
    const headerContainer = useRef<HTMLDivElement | null>(null);
    const stickyContainer = useRef<HTMLDivElement | null>(null);
    const utilsContainer = useRef<HTMLDivElement | null>(null);

    /**
     * react-router location
     */
    const location = useLocation();

    /**
     * header transition 상태
     */
    const [isTransition, setTransitionStage] = useState<boolean>(false);

    /**
     * title width
     * 브랜드로고 대신 텍스트가 노출되는 경우 말줄임 표시등의 디자인 가이드 구현을 위해 필요
     */
    const [titleWidth, setTitleWidth] = useState<React.CSSProperties>({});

    /**
     * header transition이 발생하는 시점 (scroll y축)
     */
    const [transitionPoint, setTransitionPoint] = useState<number | null>(null);

    /**
     * 서브 타이틀 없이 오직 Prizm 로고만 노출되는가?
     */
    const isOnlyPrizm = !title && !titleImagePath;

    /**
     * root element의 클래스명
     */
    const classNames = classnames(className, {
      'is-overlay': overlay,
      'is-only-prizm': isOnlyPrizm,
      'is-transition': isTransition,
      'has-description': !!description,
    });

    /**
     * titleWidth값 업데이트 (seTitleWidth 실행)
     */
    const updateTitleWidth = () => {
      if (!headerContainer.current || !utilsContainer.current) {
        return;
      }

      const width = headerContainer.current.offsetWidth - utilsContainer.current.offsetWidth;
      width && setTitleWidth({ width: `${width}px` });
    };

    /**
     * transitionPoint값 업데이트 (setTransitionPoint 실행)
     */
    const updateTransitionPoint = () => {
      if (!header.current) {
        return;
      }

      const { offsetTop: headerT, offsetHeight: headerH } = header.current;
      const { offsetTop: triggerT, offsetHeight: triggerH } = transitionTrigger?.current || {
        offsetTop: headerT,
        offsetHeight: headerH,
      };

      const buffer =
        transitionBuffer -
        (transitionOffset[0] === 'end' ? headerH : 0) +
        (transitionOffset[1] === 'end' ? triggerH : 0);

      // 최소 헤더 높이값 이상 스크롤되었을때 트랜지션이 발생하도록 설정
      setTransitionPoint(Math.max(triggerT - headerT + buffer, 56));
    };

    /**
     * window resizing 및 transitionPoint에 영향을 주는 props가 변경될시
     * updateTransitionPoint 호출
     */
    useLayoutEffect(() => {
      updateTransitionPoint();
    }, [size.width, transitionTrigger?.current, transitionBuffer, ...transitionOffset]);

    /**
     * window resizing 및 titleWidth에 영향을 주는 props가 변경될시
     * updateTitleWidth 호출
     */
    useLayoutEffect(() => {
      updateTitleWidth();
    }, [size.width, utils]);

    /**
     * Y축 스크롤시 transitionPoint과 현재 스크롤 위치를 비교하여 트랜지션효과를 적용할지 결정
     */
    useLayoutEffect(() => {
      const transition = !isNull(transitionPoint) && scroll.y > transitionPoint;
      transition !== isTransition && setTransitionStage(transition);
    }, [scroll.y, transitionPoint]);

    /**
     * ref setting
     */
    useImperativeHandle(ref, () => ({
      header: header.current,
      headerContainer: headerContainer.current,
      stickyContainer: stickyContainer.current,
    }));

    /**
     * Prizm 로고 클릭 이벤트 핸들러
     * 메인에서 클릭시 스크롤 탑으로 이동
     */
    const handleClickPrizm: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      let isPreventDefault = false;

      onClickPrizm?.({
        ...e,
        preventDefault: () => {
          e.preventDefault();
          isPreventDefault = true;
        },
      });

      if (!isPreventDefault && getWebLink(WebLinkTypes.HOME) === location.pathname) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    /**
     * Title 클릭 이벤트 핸들러
     * 타이틀에 적용된 랜딩이 없거나, 현재페이지인 경우 스크롤 탑으로 이동
     */
    const handleClickTitle: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      let isPreventDefault = false;

      onClickTitle?.({
        ...e,
        preventDefault: () => {
          e.preventDefault();
          isPreventDefault = true;
        },
      });

      if (!isPreventDefault && [location.pathname, '#none', ''].includes(link)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <div ref={headerContainer} className={classNames}>
        <header ref={header} className="header" {...props}>
          <div className="header-title" style={titleWidth}>
            <h1 className="header-title-main">
              <Action is="a" link={getWebLink(WebLinkTypes.HOME)} onClick={handleClickPrizm}>
                <LogoPrizm className="logo-prizm" aria-label="프리즘" />
              </Action>
            </h1>

            {!isOnlyPrizm && (
              <h2 className="header-title-sub">
                <Action is="a" link={link} onClick={handleClickTitle}>
                  <Conditional
                    condition={!!titleImagePath}
                    trueExp={<SVG className="logo-brand" src={titleImagePath || ''} aria-label={title} />}
                    falseExp={<span className="logo-text" children={title} />}
                  />
                  {description && <span className="description" children={description} />}
                </Action>
              </h2>
            )}
          </div>
          <div ref={stickyContainer} className="header-sticky-container" />
        </header>
        {utils && <div ref={utilsContainer} className="header-utils" children={utils} />}
      </div>
    );
  },
);

/**
 * Figma MWebHeader 컴포넌트
 *
 * Notion - https://www.notion.so/rxc/Header-1-2e84bc07b6554549bee1681aba87ba91
 * @todo prizm url 적용
 */
export const MWebHeader = styled(MWebHeaderComponent)`
  --header-height: 5.6rem; /** header size */
  --transition-duration: 0.2s; /** transition 속도 */

  height: var(--header-height);

  .header {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0, r: 0 })};
    ${({ theme }) => theme.mixin.z('header')};
    box-sizing: border-box;

    &:before,
    &:after {
      ${({ theme }) => theme.mixin.absolute({ t: -1, l: 0, r: 0, b: 0 })};
      box-sizing: border-box;
      background: ${({ theme }) => theme.color.background.surfaceHigh};
      content: '';
    }

    &:before {
      opacity: 1;
    }

    &:after {
      bottom: -0.1rem;
      border-bottom: 0.5px solid ${({ theme }) => theme.color.gray3};
      opacity: 0;
    }
  }

  .header-title {
    display: flex;
    overflow: hidden;
    position: relative;
    z-index: 1;
    flex-direction: column;
    width: 100%;
    height: var(--header-height);

    &-main,
    &-sub {
      box-sizing: border-box;
      overflow: hidden;
      flex-shrink: 0;
      min-width: 12rem;
      height: 100%;
      padding: 0.4rem 1.6rem;
      padding-right: ${({ utils }) => (utils ? '0' : '1.6rem')};
      transform: translate3d(0, 0, 0);
      transition: transform var(--transition-duration);
      will-change: transform;
    }

    &-sub {
      /**
       * 타이틀의 영역
       * action 영역의 넓이(16rem) + 간격 1.6rem을 제외한 나머지
       */
      max-width: ${({ theme }) => `calc(100% - calc(16rem + ${theme.spacing.s16}))`};
    }

    ${Action} {
      display: inline-flex;
      box-sizing: border-box;
      align-items: center;
      max-width: 100%;
      height: 100%;
      padding: 0 0.8rem;
      opacity: 1;
      transition: opacity 0.2s;

      &:active {
        opacity: 0.5;
      }
    }

    .logo-prizm {
      width: auto;
      height: 1.6rem;
      color: ${({ theme }) => theme.color.black};

      * {
        fill: currentcolor;
      }
    }

    .logo-brand {
      width: auto;
      max-width: 15.2rem;
      height: 3.2rem;
    }

    .logo-text {
      ${({ theme }) => theme.mixin.ellipsis()};
      display: block;
      width: 100%;
      color: ${({ theme }) => theme.color.black};
      font: ${({ theme }) => theme.fontType.title2B};
    }

    .description {
      ${({ theme }) => theme.mixin.ellipsis()};
      display: block;
      width: 100%;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }
  }

  .header-sticky-container {
    position: relative;
    z-index: 1;
  }

  .header-utils {
    color: ${({ theme }) => theme.color.black};
    pointer-events: initial;
  }

  /**************************************************************
   * overlay 타입
   *************************************************************/
  &.is-overlay {
    height: 0;

    .header {
      &:before,
      &:after {
        transition: opacity var(--transition-duration);
      }

      &:before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
        backdrop-filter: blur(0);
      }
    }

    .header-title .logo-prizm,
    .header-utils {
      color: #fff;
    }
  }

  /**************************************************************
   * 서브타이틀 없는 경우
   *************************************************************/
  &.is-only-prizm {
    .header-title-main,
    .header-title-sub {
      transform: translate3d(0, 0, 0) !important;
    }
  }

  /**************************************************************
   * 트랜지션 효과 적용시
   *************************************************************/
  &.is-transition {
    .header:before {
      opacity: 0;
    }

    .header:after {
      opacity: 1;
    }

    .header-title-main,
    .header-title-sub {
      transform: translate3d(0, -100%, 0);
    }

    &.is-overlay.is-only-prizm .header-title .logo-prizm {
      color: ${({ theme }) => theme.color.black};
    }

    &.is-overlay .header-utils {
      color: ${({ theme }) => theme.color.black};
    }
  }

  /**************************************************************
   * 디스크립션이 있는 경우
   *************************************************************/
  &.has-description .header-title-sub {
    ${Action} {
      flex-direction: column;
      align-items: start;
    }

    .logo-brand {
      height: 1.7rem;
    }

    .logo-text {
      font: ${({ theme }) => theme.fontType.smallB};
    }
  }
`;
