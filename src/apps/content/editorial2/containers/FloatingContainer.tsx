import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMountedState } from 'react-use';
import classNames from 'classnames';
import styled from 'styled-components';
import { getSyncBottomTransitionValue, setStyles } from '@features/floating/utils';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { FloatingFollow } from '../components/FloatingFollow';
import { FloatingLive } from '../components/FloatingLive';
import { FloatingDirectionStatus, FloatingStatusType } from '../constants';
import { DirectionType, useFloatingDismiss } from '../hooks';
import type { ContentStoryModel } from '../models';
import { useContentFloatingService, useContentStoreService, useLogService } from '../services';
import { useContentStore } from '../stores';

type FloatingContainerProps = {
  content: ContentStoryModel;
};
export const FloatingContainer = ({ content }: FloatingContainerProps) => {
  const { live, showroom } = content;
  const { validFollow, validLive, direction, handleInitialFloating, handleAvailableScroll } = useContentFloatingService(
    { showroom, live },
  );

  // 편성된 라이브가 라이브중이 아니고 쇼룸을 팔로우한 경우 전체 플로팅 미노출
  if (!validFollow && !validLive) {
    return <></>;
  }

  const { isIOS, isAndroid, isApp } = useDeviceDetect();
  const { bottomSafeAreaUpdatedValue } = useWebInterface();
  const { handleUpdateFollowed, handleUpdateFloating } = useContentStoreService();
  const contentInfo = useContentStore.use.contentInfo();
  const followed = useContentStore.use.followed(); // 쇼룸 팔로우 상태
  const floating = useContentStore.use.floating(); // 플로팅 현재 노출 상태

  // 로깅 서비스
  const { logShowroomSnackBar, logShowroomSnackBarFollow, logContentLiveBannerInit, logContentLiveBannerTab } =
    useLogService();
  // 마운트 상태 체크 (componentDidMount를 체크하기 위한 hook)
  const isMounted = useMountedState();
  const isInitStackFloating = validLive && validFollow;
  const stackChangeTransitionTime = 200; // 스태킹시(=라이브+팔로우 노출) 업/다운 트랜지션 발생 타임
  const hideTransitionTime = 400; // 플로팅 미노출 트랜지션 타임
  const showTransitionTime = 450; // 플로팅 노출 트랜지션 타임
  const [targetLiveId, setTargetLiveId] = useState<number>(showroom.liveId);
  const [stackChangingFollow, setStackChangingFollow] = useState<boolean>(false); // 스태킹시 팔로우 완료 모션
  const [stackChangedFollow, setStackChangedFollow] = useState<boolean>(false); // 스태킹시 팔로우 완료 모션 종료시
  const stackChangedFollowValue = useRef<boolean>(false);
  const directRef = useRef<FloatingDirectionStatus>(FloatingDirectionStatus.NONE);
  const isLive = useRef<boolean>(false);
  const liveEl = useRef<HTMLDivElement | null>(null);
  const stackTimeId = useRef<NodeJS.Timeout | null>(null);
  const floatingContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 플로팅 세로 swipe시 미노출
   */
  const handleHideSnackBar = () => {
    handleUpdateFloating(FloatingStatusType.HIDE);
    handleAvailableScroll(false);
  };

  const { snackbarRef } = useFloatingDismiss({
    dismissDirection: DirectionType.DOWN,
    usableTransition: false,
    onTriggerDismiss: handleHideSnackBar,
  });

  const liveElRef = useCallback((el) => {
    if (!el) return;
    liveEl.current = el;
  }, []);

  /**
   * 팔로우 상태 변경
   */
  const handleChangedFollow = useCallback((followStatus: boolean) => {
    handleUpdateFollowed(followStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * follow 완료 시
   */
  const handleCompleteFollow = () => {
    const { contentName, contentNo } = contentInfo;
    const { id: showroomId, name: showroomName } = showroom;

    logShowroomSnackBarFollow({
      contentId: contentNo,
      contentName,
      showroomId,
      showroomName,
    });
  };

  /**
   * 라이브 바로가기
   * @returns
   */
  const handleLiveLink = () => {
    if (!live) return;

    const { contentName, contentNo } = contentInfo;
    const { id: showroomId, name: showroomName } = showroom;

    logContentLiveBannerTab({
      contentId: contentNo,
      contentName,
      showroomId,
      showroomName,
      liveId: live.id,
    });
  };

  const handleHideFollow = useCallback(() => {
    // 스택이 아닌 경우 hide 처리
    if (!isInitStackFloating) {
      handleHideSnackBar();
      return;
    }

    // 스택인 경우, 라이브영역이 보이지 않는 상태시 -> 플로팅 배너 hide 후, 라이브 영역만 노출하여 show처리
    if (directRef.current === FloatingDirectionStatus.DOWN) {
      handleHideSnackBar();
      setTimeout(() => {
        setStackChangedFollow(true);
        stackChangedFollowValue.current = true;
        if (liveEl.current) {
          liveEl.current.style.display = 'block';
          liveEl.current.style.opacity = '1';
        }
        handleUpdateFloating(FloatingStatusType.SHOW);
      }, hideTransitionTime + stackChangeTransitionTime);

      return;
    }

    // 스택인 경우, 라이브영역이 보이는 상태시 -> 팔로우바 미노출, 플로팅 배너 사이즈 축소
    handleAvailableScroll(false);
    setStackChangingFollow(true);
    setTimeout(() => {
      setStackChangedFollow(true);
      stackChangedFollowValue.current = true;
    }, showTransitionTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 라이브중 상태로 변경
   */
  const handleChangeLiveStatus = useCallback((id: number) => {
    setTargetLiveId(id);
    isLive.current = true;
  }, []);

  /**
   * Floating bottom 위치를 조정
   */
  const updateFloatingRootPosition = (posY: number, isAnimated: boolean) => {
    const containerEl = floatingContainerRef.current;
    const { show, hide } = getSyncBottomTransitionValue(['transform']);

    if (containerEl) {
      setStyles(containerEl, {
        transform: `translate3d(0, -${posY}px, 0)`,
        // eslint-disable-next-line no-nested-ternary
        transition: isAnimated ? (posY ? show : hide) : '',
      });
    }
  };

  /**
   * 강조 모션 완료 후 플로팅 상태 show로 변경
   */
  const handleHighlightAnimationEnd = () => {
    handleUpdateFloating(FloatingStatusType.SHOW);
  };

  useEffect(() => {
    if (floating === FloatingStatusType.HIDE) {
      handleInitialFloating();
      return;
    }

    if (floating === FloatingStatusType.SHOW && isInitStackFloating && !stackChangedFollowValue.current) {
      handleAvailableScroll(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floating]);

  useEffect(() => {
    const { contentName, contentNo } = contentInfo;
    const { id: showroomId, name: showroomName } = showroom;
    if (validFollow) {
      // 팔로우 영역
      logShowroomSnackBar({
        contentId: contentNo,
        contentName,
        showroomId,
        showroomName,
      });
    }

    if (validLive) {
      // 라이브 영역
      logContentLiveBannerInit({
        contentId: contentNo,
        contentName,
        showroomId,
        showroomName,
        liveId: live.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!liveEl.current) return;
    if (stackTimeId.current) clearTimeout(stackTimeId.current);

    if (stackChangedFollowValue.current) return;
    if (direction === FloatingDirectionStatus.DOWN) {
      if (followed) return;
      liveEl.current.style.opacity = '0';
      liveEl.current.style.display = 'block';
      stackTimeId.current = setTimeout(() => {
        if (!liveEl.current) return;

        liveEl.current.style.display = 'none';
      }, stackChangeTransitionTime);
    } else if (direction === FloatingDirectionStatus.UP) {
      liveEl.current.style.display = 'block';
      liveEl.current.style.opacity = '0';
      stackTimeId.current = setTimeout(() => {
        if (liveEl.current) {
          liveEl.current.style.opacity = '1';
        }
      }, 1);
    }
    directRef.current = direction;
  }, [stackChangingFollow, direction, followed]);

  useEffect(() => {
    if (floatingContainerRef.current) {
      const floatingEl = floatingContainerRef.current.querySelector('.floating-content');
      if (floatingEl) {
        floatingEl.addEventListener('animationend', handleHighlightAnimationEnd);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ios와 aos간의 구현 차이가 있어 aos의 경우 별도의 callWeb을 이용하여
   * bottomBar(하단 글로벌 네비게이션바)의 show/hide에 따라 Floating Root의
   * 위치를 조정
   * @reference @features/floating/components/FloatingRoot.tsx
   */
  useLayoutEffect(() => {
    if (!isApp || !isAndroid || !bottomSafeAreaUpdatedValue || !floatingContainerRef.current) {
      return;
    }
    updateFloatingRootPosition(
      bottomSafeAreaUpdatedValue.inset,
      // mount시에만 isAnimated와 상관없이 모션 적용 X
      isMounted() && bottomSafeAreaUpdatedValue.isAnimated,
    );
  }, [bottomSafeAreaUpdatedValue, isAndroid, isApp, isMounted]);

  return (
    <FloatingStyled
      ref={floatingContainerRef}
      stackChangeTransitionTime={stackChangeTransitionTime}
      showTransitionTime={showTransitionTime}
      hideTransitionTime={hideTransitionTime}
      className={classNames({
        'is-ios': isIOS,
        'is-app': isApp,
      })}
    >
      <div
        ref={snackbarRef}
        className={classNames('floating-content', {
          'is-hide': floating === FloatingStatusType.HIDE,
          'is-show': floating === FloatingStatusType.SHOW,
          'is-highlight': floating === FloatingStatusType.HIGHLIGHT,
        })}
      >
        <div
          className={classNames('floating-inner', {
            'is-down': !stackChangedFollow && direction === FloatingDirectionStatus.DOWN,
            'is-up': !stackChangedFollow && direction === FloatingDirectionStatus.UP,
            'is-stack': validLive && validFollow,
            'is-changing-followed': stackChangingFollow && !stackChangedFollow,
            'is-changed-followed': stackChangedFollow,
          })}
        >
          <>
            {validLive && (
              <FloatingLive
                ref={liveElRef}
                live={live}
                initFollowed={showroom.isFollow}
                direction={direction}
                onChangeLiveStatus={handleChangeLiveStatus}
                onLiveLink={handleLiveLink}
              />
            )}
            {validFollow && (
              <FloatingFollow
                showroom={showroom}
                liveId={targetLiveId}
                onChangedFollow={handleChangedFollow}
                onCompleteFollow={handleCompleteFollow}
                onHideFollow={handleHideFollow}
              />
            )}
          </>
        </div>
      </div>
    </FloatingStyled>
  );
};

const FloatingStyled = styled('div').attrs(
  ({
    stackChangeTransitionTime,
    showTransitionTime,
    hideTransitionTime,
  }: {
    stackChangeTransitionTime: number;
    showTransitionTime: number;
    hideTransitionTime: number;
  }) => {
    return {
      stackChangeTransitionTime,
      showTransitionTime,
      hideTransitionTime,
    };
  },
)`
  @keyframes floatingBounce {
    0% {
      transform: translate3d(0, 0rem, 0);
    }

    38.24% {
      transform: translate3d(0, -2rem, 0);
    }

    62.91% {
      transform: translate3d(0, 0rem, 0);
    }

    78.83% {
      transform: translate3d(0, -1rem, 0);
    }

    89.10% {
      transform: translate3d(0, 0rem, 0);
    }

    95.73% {
      transform: translate3d(0, -0.1rem, 0);
    }

    100.00% {
      transform: translate3d(0, 0rem, 0);
    }
  }

  ${({ theme }) => theme.mixin.fixed({ b: 'env(safe-area-inset-bottom)', l: 0, r: 0 })};
  ${({ theme }) => theme.mixin.z('header', -10)};

  & > .floating-content {
    &.is-hide {
      transform: translate3d(0, 20rem, 0);
      transition: ${({ hideTransitionTime }) => `transform ${hideTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
    }

    &.is-show {
      transform: translate3d(0, 0rem, 0);
      transition: ${({ showTransitionTime }) => `transform ${showTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
    }

    &.is-highlight {
      animation: floatingBounce 0.8s ease-in-out;
    }
  }

  & .floating-inner {
    position: relative;
    margin: 0 1.6rem 1.6rem 1.6rem;

    &::before {
      display: block;
      position: absolute;
      top: initial;
      right: 0;
      bottom: 0;
      left: 0;
      height: 12.8rem;
      border-radius: 0.8rem / 1.6rem;
      background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
      transform: scaleY(0.5);
      transform-origin: center bottom;
      content: '';
    }

    &.is-stack {
      &::before {
        border-radius: ${({ theme }) => theme.radius.r8};
        transform: scaleY(1);
        transition: ${({ stackChangeTransitionTime }) =>
          `transform ${stackChangeTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
      }

      ${FloatingLive} {
        position: absolute;
        right: 0;
        bottom: 6.4rem;
        left: 0;
        transition: ${({ stackChangeTransitionTime }) =>
          `transform ${stackChangeTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1), opacity 100ms ease-in-out`};
        /** 구분선 */
        & .divider {
          opacity: 1;
          transition: opacity 100ms ease-in-out;
        }
      }

      &.is-changing-followed {
        &::before {
          border-radius: 0.8rem / 1.6rem;
          transform: scaleY(0.5);
        }
        ${FloatingLive} {
          position: initial;
          transform: translate3d(0, 6.4rem, 0);

          & .divider {
            opacity: 0;
          }
        }
        ${FloatingFollow} {
          opacity: 0;
          transition: none;
        }
      }

      &.is-changed-followed {
        &::before {
          border-radius: 0.8rem / 1.6rem;
          transform: scaleY(0.5);
        }
        ${FloatingLive} {
          position: initial;
          transform: translate3d(0, 0rem, 0);
          transition: none;

          & .divider {
            opacity: 0;
          }
        }
        ${FloatingFollow} {
          display: none;
        }
      }
    }

    &.is-down {
      &.is-stack {
        &::before {
          border-radius: 0.8rem / 1.6rem;
          transform: scaleY(0.5);
        }
      }
    }
  }

  &.is-ios {
    &.is-app {
      transition: ${getSyncBottomTransitionValue(['bottom']).show};
    }

    & .floating-inner {
      &::before {
        background: rgba(44, 44, 44, 0.4);
        backdrop-filter: blur(2.5rem);
      }
    }
  }
`;
