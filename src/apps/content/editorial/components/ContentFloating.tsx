import { forwardRef, useRef, useImperativeHandle, useLayoutEffect, useCallback, useState, useEffect } from 'react';
import type { HTMLAttributes } from 'react';
import { useMountedState } from 'react-use';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { getSyncBottomTransitionValue, setStyles } from '@features/floating/utils';
import { FloatingDirectionStatus, FloatingStatus } from '../constants';
import type { ContentModel } from '../models';
import { useFloatingService, DirectionType, useFloatingDismissService, useLogService } from '../services';
import { FloatingLive } from './FloatingLive';
import { FloatingFollow } from './FloatingFollow';

export type ContentFloatingProps = HTMLAttributes<HTMLDivElement> & {
  content: ContentModel;
  deepLink: string;
};

export type ContentFloatingRefType = {
  ref: HTMLDivElement | null;
  showSnackBar: () => void;
  hideSnackBar: () => void;
};
export const ContentFloatingComponent = forwardRef<ContentFloatingRefType, ContentFloatingProps>(
  ({ className, content, deepLink }, ref) => {
    const { contentNo, contentName, live, showroom } = content;
    const floatingElRef = useRef<HTMLDivElement | null>(null);
    const { isIOS, isAndroid, isApp } = useDeviceDetect();
    const { bottomSafeAreaUpdatedValue } = useWebInterface();
    const { direction, handleInitialFloating, validLive, validFollow, handleAvailableScroll } = useFloatingService({
      showroom,
      live,
    });
    // 마운트 상태 체크 (componentDidMount를 체크하기 위한 hook)
    // 로깅 서비스
    const { logShowroomSnackBar, logShowroomSnackBarFollow, logContentLiveBannerInit, logContentLiveBannerTab } =
      useLogService();
    const isMounted = useMountedState();
    const isRenderFloating = validLive || validFollow;
    const isInitStackFloating = validLive && validFollow;
    const stackChangeTransitionTime = 200; // 스태킹시(=라이브+팔로우 노출) 업/다운 트랜지션 발생 타임
    const hideTransitionTime = 400; // 플로팅 미노출 트랜지션 타임
    const showTransitionTime = 450; // 플로팅 노출 트랜지션 타임
    const [snackbarDisplayStatus, setSnackbarDisplayStatus] = useState<FloatingStatus>(FloatingStatus.SHOW);
    const [targetLiveId, setTargetLiveId] = useState<number>(showroom.liveId);
    const [followed, setFollowed] = useState<boolean>(showroom.isFollow);
    const [stackChangingFollow, setStackChangingFollow] = useState<boolean>(false); // 스태킹시 팔로우 완료 모션
    const [stackChangedFollow, setStackChangedFollow] = useState<boolean>(false); // 스태킹시 팔로우 완료 모션 종료시
    const stackChangedFollowValue = useRef<boolean>(false);
    const directRef = useRef<FloatingDirectionStatus>(FloatingDirectionStatus.NONE);
    const isLive = useRef<boolean>(false);
    const liveEl = useRef<HTMLDivElement | null>(null);
    const stackTimeId = useRef<NodeJS.Timeout | null>(null);

    /**
     * Floating bottom 위치를 조정
     */
    const updateFloatingRootPosition = (posY: number, isAnimated: boolean) => {
      const containerEl = floatingElRef.current;
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
     * 플로팅 화면 미노출
     */
    const handleDismissSnackbar = useCallback(() => {
      setSnackbarDisplayStatus(FloatingStatus.HIDE);
      handleAvailableScroll(false);
    }, [handleAvailableScroll]);

    /**
     * 플로팅 노출 상태 처리
     * 노출 되어 있는 경우는 하이라이트 상태,
     * 미노출 되어 있는 경우는 노출 상태
     */
    const handleChangeFloatingDisplay = useCallback(() => {
      setSnackbarDisplayStatus((prev) => {
        return prev === FloatingStatus.SHOW ? FloatingStatus.HIGHLIGHT : FloatingStatus.SHOW;
      });
    }, []);

    const handleShowSnackBar = useCallback(() => {
      if (snackbarDisplayStatus === FloatingStatus.HIDE) {
        handleInitialFloating();
      }
      if (isInitStackFloating && !stackChangedFollowValue.current) {
        handleAvailableScroll(true);
      }
      handleChangeFloatingDisplay();
    }, [
      snackbarDisplayStatus,
      isInitStackFloating,
      handleChangeFloatingDisplay,
      handleInitialFloating,
      handleAvailableScroll,
    ]);

    const handleHideSnackBar = useCallback(() => {
      handleDismissSnackbar();
    }, [handleDismissSnackbar]);

    const { snackbarRef } = useFloatingDismissService({
      dismissDirection: DirectionType.DOWN,
      usableTransition: false,
      onTriggerDismiss: handleDismissSnackbar,
    });

    /**
     * 팔로우 상태 변경
     */
    const handleChangedFollow = useCallback((followStatus: boolean) => {
      setFollowed(followStatus);
    }, []);

    const handleCompleteFollow = useCallback(() => {
      // follow 완료 로깅
      logShowroomSnackBarFollow({
        contentId: contentNo,
        contentName,
        showroomId: showroom.showroomId,
        showroomName: showroom.showroomName,
      });
    }, [contentName, contentNo, logShowroomSnackBarFollow, showroom.showroomId, showroom.showroomName]);

    const handleFollowMotion = useCallback(() => {
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
          handleShowSnackBar();
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
    }, [handleAvailableScroll, handleHideSnackBar, handleShowSnackBar, isInitStackFloating]);

    const handleHideFollow = useCallback(() => {
      handleFollowMotion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 라이브중 상태로 변경
     */
    const handleChangeLiveStatus = useCallback((id: number) => {
      setTargetLiveId(id);
      isLive.current = true;
    }, []);

    const liveElRef = useCallback((el) => {
      if (!el) return;
      liveEl.current = el;
    }, []);

    const handleHighlightAnimationEnd = useCallback(() => {
      setSnackbarDisplayStatus(FloatingStatus.SHOW);
    }, []);

    const handleLiveLink = useCallback(() => {
      if (!live) return;
      // 라이브 바로가기
      logContentLiveBannerTab({
        contentId: contentNo,
        contentName,
        showroomId: showroom.showroomId,
        showroomName: showroom.showroomName,
        liveId: live.id,
      });
    }, [contentName, contentNo, live, logContentLiveBannerTab, showroom.showroomId, showroom.showroomName]);

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
      if (floatingElRef.current) {
        const bannerEl = floatingElRef.current.querySelector('.banner');
        if (bannerEl) {
          bannerEl.addEventListener('animationend', handleHighlightAnimationEnd);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (validFollow) {
        // 팔로우 영역
        logShowroomSnackBar({
          contentId: contentNo,
          contentName,
          showroomId: showroom.showroomId,
          showroomName: showroom.showroomName,
        });
      }

      if (validLive) {
        // 라이브 영역
        logContentLiveBannerInit({
          contentId: contentNo,
          contentName,
          showroomId: showroom.showroomId,
          showroomName: showroom.showroomName,
          liveId: live.id,
        });
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
      if (!isApp || !isAndroid || !bottomSafeAreaUpdatedValue || !floatingElRef.current) {
        return;
      }
      updateFloatingRootPosition(
        bottomSafeAreaUpdatedValue.inset,
        // mount시에만 isAnimated와 상관없이 모션 적용 X
        isMounted() && bottomSafeAreaUpdatedValue.isAnimated,
      );
    }, [bottomSafeAreaUpdatedValue, isAndroid, isApp, isMounted]);

    useImperativeHandle(ref, () => ({
      ref: floatingElRef.current,
      showSnackBar: handleShowSnackBar,
      hideSnackBar: handleHideSnackBar,
    }));

    return (
      <div
        className={classNames(className, {
          'is-ios': isIOS,
          'is-app': isApp,
        })}
        ref={floatingElRef}
      >
        {isRenderFloating && (
          <Banner
            ref={snackbarRef}
            className={classNames('banner', {
              'is-ios': isIOS,
              'is-hide': snackbarDisplayStatus === FloatingStatus.HIDE,
              'is-show': snackbarDisplayStatus === FloatingStatus.SHOW,
              'is-highlight': snackbarDisplayStatus === FloatingStatus.HIGHLIGHT,
            })}
            stackChangeTransitionTime={stackChangeTransitionTime}
            showTransitionTime={showTransitionTime}
            hideTransitionTime={hideTransitionTime}
          >
            <div
              className={classNames('banner-inner', {
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
                    followed={followed}
                    direction={direction}
                    snackbarDisplayStatus={snackbarDisplayStatus}
                    onChangeLiveStatus={handleChangeLiveStatus}
                    onLiveLink={handleLiveLink}
                  />
                )}
                {validFollow && (
                  <FloatingFollow
                    showroom={showroom}
                    liveId={targetLiveId}
                    deepLink={deepLink}
                    onChangedFollow={handleChangedFollow}
                    onCompleteFollow={handleCompleteFollow}
                    onHideFollow={handleHideFollow}
                  />
                )}
              </>
            </div>
          </Banner>
        )}
      </div>
    );
  },
);
export const ContentFloating = styled(ContentFloatingComponent)`
  @keyframes bounce {
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

  &.is-ios {
    &.is-app {
      transition: ${getSyncBottomTransitionValue(['bottom']).show};
    }
  }
`;

const Banner = styled('div').attrs(
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
  &.is-hide {
    transition: ${({ hideTransitionTime }) => `transform ${hideTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
    transform: translate3d(0, 20rem, 0);
  }
  &.is-show {
    transition: ${({ showTransitionTime }) => `transform ${showTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
    transform: translate3d(0, 0rem, 0);
  }
  &.is-highlight {
    animation: bounce 0.8s ease-in-out;
  }
  & .banner-inner {
    position: relative;
    margin: 0 1.6rem 1.6rem 1.6rem;

    &::before {
      position: absolute;
      top: initial;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      height: 12.8rem;
      transform-origin: center bottom;
      transform: scaleY(0.5);
      border-radius: 0.8rem / 1.6rem;
      background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
      content: '';
    }

    &.is-stack {
      &::before {
        transition: ${({ stackChangeTransitionTime }) =>
          `transform ${stackChangeTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1)`};
        transform: scaleY(1);
        border-radius: ${({ theme }) => theme.radius.r8};
      }

      ${FloatingLive} {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 6.4rem;
        transition: ${({ stackChangeTransitionTime }) =>
          `transform ${stackChangeTransitionTime}ms cubic-bezier(0.65, 0, 0.35, 1), opacity 100ms ease-in-out`};
        // 구분선
        & .divider {
          transition: opacity 100ms ease-in-out;
          opacity: 1;
        }
      }

      &.is-changing-followed {
        &::before {
          transform: scaleY(0.5);
          border-radius: 0.8rem / 1.6rem;
        }
        ${FloatingLive} {
          position: initial;
          transform: translate3d(0, 6.4rem, 0);
          & .divider {
            opacity: 0;
          }
        }
        ${FloatingFollow} {
          transition: none;
          opacity: 0;
        }
      }

      &.is-changed-followed {
        &::before {
          transform: scaleY(0.5);
          border-radius: 0.8rem / 1.6rem;
        }
        ${FloatingLive} {
          position: initial;
          transition: none;
          transform: translate3d(0, 0rem, 0);
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
          transform: scaleY(0.5);
          border-radius: 0.8rem / 1.6rem;
        }
      }
    }
  }

  &.is-ios {
    & .banner-inner {
      &::before {
        background: rgba(44, 44, 44, 0.4);
        backdrop-filter: blur(2.5rem);
      }
    }
  }
`;
