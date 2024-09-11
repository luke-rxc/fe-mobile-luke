/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useUpdateEffect } from 'react-use';
import { Action } from '@pui/action';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { Image } from '@pui/image';
import { BannerLiveMeta } from './BannerLiveMeta';
import { FeedType } from '../constants';
import { BannerTypeSchema } from '../schemas';

export interface BannerProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 랜딩 URL */
  landingLabelLink: string;
  /** 배너 랜딩 정보 표기를 위한 텍스트 */
  landingLabel: string;
  /** 프로필 클릭시 이동할 URL */
  profileLink?: string;
  /** 프로필 이미지 경로 */
  path?: ProfilesProps['image']['src'];
  /** 라이브 여부 */
  onAir?: boolean;
  /** 라이브 아이디 */
  liveId?: ProfilesProps['liveId'];
  /** 라이브 제목 */
  liveTitle?: string;
  /** 쇼룸 코드 */
  showroomCode?: ProfilesProps['showroomCode'];
  /** 랜딩 타입 */
  landingType?: BannerTypeSchema;
  /** 프로필 클릭시 실행할 이벤트 콜백 */
  onClickProfileLink?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, props: BannerProfileProps) => void;
}

/**
 * Main Banner Profile
 */
export const BannerProfile = styled<React.FC<BannerProfileProps>>((props) => {
  const {
    path,
    onAir,
    liveId = 0,
    profileLink,
    showroomCode,
    liveTitle: title,
    landingLabel: label,
    landingType,
    landingLabelLink,
    className,
    onClickProfileLink,
    ...rest
  } = props;

  const profileStatus = onAir ? 'live' : 'none';
  const isLandingTypeLive = landingType === FeedType.LIVE;
  const showLiveMeta = !!title && !!onAir && isLandingTypeLive;

  const [liveTitle, setLiveTitle] = useState<string | undefined>(title);

  /**
   * 이퀄라이즈 + 라이브 타이틀(슬라이드)
   */
  const liveMetaphorEl = useRef<HTMLSpanElement>(null);
  const [showLiveMetaphorEl, setShowLiveMetaphorEl] = useState<boolean>(showLiveMeta);
  const [liveMetaphorElStyles, setLiveMetaphorElStyles] = useState<React.CSSProperties>({});

  /**
   * 프로필(metaphor) 클릭 이벤트 핸들러
   */
  const handleClickProfileLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClickProfileLink?.(e, props);
  };

  /**
   * 디졸브(트랜지션) 후 라이브메타포의 show/hide 설정
   */
  const handleTransitionEndOfLiveMeta = useCallback(
    (e: React.TransitionEvent<HTMLSpanElement>) => {
      if (e.target === liveMetaphorEl.current && e.propertyName === 'opacity') {
        setShowLiveMetaphorEl(showLiveMeta);
      }
    },
    [showLiveMeta],
  );

  /**
   * 라이브 메타포 노출 여부에 따라 UI 디졸브 효과
   */
  useUpdateEffect(() => {
    requestAnimationFrame(() => {
      setShowLiveMetaphorEl(true);
      setLiveMetaphorElStyles({ opacity: +!showLiveMeta });

      requestAnimationFrame(() => {
        setLiveMetaphorElStyles({ opacity: +showLiveMeta });
      });
    });
  }, [showLiveMeta]);

  /**
   * title 값 업데이트
   */
  useLayoutEffect(() => {
    // 랜딩 타입이 라이브인 경우에만 타이틀 노출
    onAir && isLandingTypeLive && setLiveTitle(title);
  }, [title, onAir]);

  /**
   * 메인 진입 시 라이브 메타포 노출
   */
  useEffect(() => {
    setLiveMetaphorElStyles({ opacity: +showLiveMeta });
  }, []);

  return (
    <div className={className} {...rest}>
      {profileLink && (
        <Action
          is="a"
          link={profileLink}
          className={classnames('metaphor', { 'is-live': showLiveMetaphorEl })}
          onClick={handleClickProfileLink}
        >
          {showLiveMetaphorEl && (
            <BannerLiveMeta
              ref={liveMetaphorEl}
              title={liveTitle || ''}
              style={liveMetaphorElStyles}
              onTransitionEnd={handleTransitionEndOfLiveMeta}
            />
          )}

          <Profiles
            disabledLink
            size={56}
            liveId={liveId}
            showroomCode={showroomCode || ''}
            image={{ src: path }}
            status={profileStatus}
          />
        </Action>
      )}
    </div>
  );
})`
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 0;
  padding: 0 1.6rem 0 2.4rem;

  &:before {
    display: block;
    width: 100%;
    flex-shrink: 2;
    content: '';
  }

  .metaphor {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    overflow: hidden;
    max-width: 100%;

    &.is-live {
      width: 100%;
    }

    ${BannerLiveMeta} {
      flex-grow: 1;
      margin-right: 0.4rem;
      transition: opacity 0.5s;
    }

    ${Profiles} {
      flex-shrink: 0;

      .inner {
        &:before {
          z-index: 1;
          border-radius: 50%;
        }

        &:active {
          transform: scale(0.96);
          transition: transform 0.2s;

          &:before {
            ${({ theme }) => theme.mixin.absolute({ l: 0, t: 0 })};
            width: 100%;
            height: 100%;
            background: ${({ theme }) => theme.color.black};
            opacity: 0.1;
            content: '';
          }
        }

        ${Image} {
          background: ${({ theme }) => theme.light.color.background.bg};
        }
      }
    }

    &:active ${Profiles} .inner {
      transform: scale(0.96);
      transition: transform 0.2s;

      &:before {
        ${({ theme }) => theme.mixin.absolute({ l: 0, t: 0 })};
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.black};
        opacity: 0.1;
        content: '';
      }
    }
  }
`;
