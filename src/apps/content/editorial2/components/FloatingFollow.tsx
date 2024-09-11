import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { Profiles, ProfilesProps } from '@pui/profiles';
import type { ContentShowroomModel } from '../models';
import { useContentBrandService, useContentStoreService } from '../services';
import { useContentStore } from '../stores';

export type FloatingFollowProps = HTMLAttributes<HTMLDivElement> & {
  /** 쇼룸 */
  showroom: ContentShowroomModel;
  /** 프로필 연결 liveID: 편성 라이브 Id > 쇼룸 라이브 Id */
  liveId?: number;
  /** 팔로우 상태변경 cb */
  onChangedFollow?: (followed: boolean) => void;
  /** 팔로우 완료 cb */
  onCompleteFollow?: () => void;
  /** 팔로우 dismiss cb */
  onHideFollow?: () => void;
};

export const FloatingFollowComponent = forwardRef<HTMLDivElement, FloatingFollowProps>(
  ({ className, showroom, liveId: targetLiveId, onChangedFollow, onCompleteFollow, onHideFollow = () => {} }, ref) => {
    const { generateHapticFeedback, subscribeShowroom } = useWebInterface();
    const { isApp, isIOS } = useDeviceDetect();
    const { openDialogToApp } = useMwebToAppDialog();
    const { handleSignIn } = useContentStoreService();
    const { getIsLogin } = useAuth();

    const contentInfo = useContentStore.use.contentInfo();

    const { deepLink } = contentInfo;
    const { code: showroomCode, name: showroomName, id: showroomId, primaryImage: showroomImage, liveId } = showroom;
    const timeId = useRef<NodeJS.Timeout | null>(null);
    const followed = useContentStore.use.followed(); // 쇼룸 팔로우 상태
    const { handleUpdateFollowed } = useContentStoreService();
    const [profile, setProfile] = useState<ProfilesProps>({
      showroomCode,
      liveId: targetLiveId || showroom.liveId,
      image: { src: showroomImage.path },
      size: 44,
      status: liveId ? 'live' : 'none',
      noResize: true,
    });

    // 쇼룸 구독success 콜백
    const updateShowroomFollowComplete = useCallback(
      (followedState: boolean) => {
        if (followedState) {
          onCompleteFollow?.();
        }
      },
      [onCompleteFollow],
    );

    /**
     * 팔로우/언팔로우 성공시
     */
    const handleUpdateBrandFollowComplete = (followedState: boolean) => {
      if (timeId.current) {
        clearTimeout(timeId.current);
      }
      handleUpdateFollowed(followedState);
      updateShowroomFollowComplete(followedState);

      if (followedState === true) {
        timeId.current = setTimeout(onHideFollow, 500);
      }
    };

    /**
     * 팔로우/언팔로우 실패시
     */
    const handleUpdateBrandFollowFail = (prevState: boolean) => {
      if (timeId.current) {
        clearTimeout(timeId.current);
      }
      if (prevState === true) {
        // 빠르게 클릭시 follow -> unfollow 상태로 변경하려 할때, unfollow에 대한 에러가 발생시 follow 상태로 변경. 이때 hide 처리
        timeId.current = setTimeout(onHideFollow, 500);
      }
    };

    /**
     * 팔로우/언팔로우 상태 조회
     */
    const handleGetBrandFollowSuccess = (followedState: boolean) => {
      if (timeId.current) {
        clearTimeout(timeId.current);
      }
      handleUpdateFollowed(followedState);

      if (followedState === true) {
        timeId.current = setTimeout(onHideFollow, 500);
      }
    };

    const { handleClickShowroomFollow: onChangeFollow, handleGetShowroomFollow: onGetFollow } = useContentBrandService({
      deepLink,
      onUpdateBrandFollowSuccess: handleUpdateBrandFollowComplete,
      onUpdateBrandFollowFail: handleUpdateBrandFollowFail,
      onGetBrandFollowSuccess: handleGetBrandFollowSuccess,
    });

    /**
     * 팔로우 상태 변경 액션
     */
    const handleChangeFollow = useCallback(async () => {
      generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

      if (!isApp) {
        openDialogToApp(deepLink, {
          actionProps: {
            kind: !followed ? AppPopupActionKind.SHOWROOM_FOLLOW : AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL,
          },
        });
        return;
      }

      if (!getIsLogin() && !(await handleSignIn())) {
        return;
      }

      if (timeId.current) {
        clearTimeout(timeId.current);
      }

      onChangeFollow?.({
        id: showroomId,
        code: showroomCode,
        follow: followed,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followed, onChangeFollow, showroomCode, showroomId, timeId]);

    const handleChangeVisible = () => {
      if (!(isApp && getIsLogin())) return;
      onGetFollow({ id: showroomId, code: showroomCode });
    };

    useEffect(() => {
      onChangedFollow?.(followed);
    }, [followed, onChangedFollow]);

    /**
     * 로그인 상태에 따라 버튼 UI 업데이트 변경
     */
    // useEffect(() => {
    //   if (!login) return;
    //   onGetFollow({ id: showroomId, code: showroomCode });
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [login]);

    useEffect(() => {
      if (!targetLiveId) return;
      setProfile((prev) => {
        return {
          ...prev,
          liveId: targetLiveId,
          status: targetLiveId ? 'live' : 'none',
        };
      });
    }, [targetLiveId]);

    /**
     * 팔로우 상태 변경
     */
    useEffect(() => {
      if (!subscribeShowroom) {
        return;
      }

      if (subscribeShowroom.showroomId === showroomId && subscribeShowroom.showroomCode === showroomCode) {
        if (timeId.current) {
          clearTimeout(timeId.current);
        }
        handleUpdateFollowed(subscribeShowroom.isSubscribed);

        if (subscribeShowroom.isSubscribed === true) {
          timeId.current = setTimeout(onHideFollow, 500);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onHideFollow, showroomCode, showroomId, subscribeShowroom]);

    useEffect(() => {
      // 페이지 뷰 변경 될때 상태 체크
      window.addEventListener('visibilitychange', handleChangeVisible);
      return () => {
        window.removeEventListener('visibilitychange', handleChangeVisible);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className={classNames(className, {
          'is-ios': isIOS,
        })}
        ref={ref}
      >
        <div className="image-wrapper">{profile && <Profiles {...profile} />}</div>
        <div className="text-wrapper">
          <span className="text">{showroomName}</span>
        </div>
        <Button className={classNames({ 'is-follow': followed })} bold size="bubble" onClick={handleChangeFollow}>
          {followed ? '팔로잉' : '팔로우'}
        </Button>
      </div>
    );
  },
);
export const FloatingFollow = styled(FloatingFollowComponent)`
  display: flex;
  align-items: center;
  height: 6.4rem;
  padding: 1rem 1.6rem 1rem 1rem;

  & .image-wrapper {
    width: 4.4rem;
    height: 4.4rem;
    margin-right: 0.2rem;
  }

  & .text-wrapper {
    flex-grow: 1;
    color: ${({ theme }) => theme.color.white};
    font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
    text-align: left;

    & .text {
      position: relative;
    }
  }

  ${Button} {
    position: relative;
    margin-left: 0.2rem;
    background: ${({ theme, showroom }) => showroom.tintColor || theme.color.gray8Filled};
    color: ${({ theme, showroom }) => showroom.textColor || theme.color.brand.tint};
    line-height: 1.671rem;

    &.is-follow {
      background: ${({ theme }) => theme.color.gray8Filled};
      color: ${({ theme }) => theme.color.brand.tint};
    }

    &:active {
      transform: scale(0.96);
    }

    & .button-content {
      white-space: nowrap;
    }
  }

  &.is-ios {
    & .text-wrapper {
      color: ${({ theme }) => theme.color.whiteLight};
    }
  }
`;
