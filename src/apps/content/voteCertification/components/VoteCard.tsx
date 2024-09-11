import { forwardRef, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { SVG } from '@pui/svg';
import { getImageLink } from '@utils/link';
import type { VoteCertificationModel, VoteItemModel } from '../models';

export type VoteCardModel = HTMLAttributes<HTMLDivElement> & {
  vote: VoteCertificationModel;
};
const VoteCardComponent = forwardRef<HTMLDivElement, VoteCardModel>(({ className, vote }, ref) => {
  const { title, logoImage, backgroundImage, backgroundVideo, voteList, backgroundType } = vote;
  const { userInfo } = useAuth();
  const [errorBGMedia, setErrorBGMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const [isAvailableVideo, setIsAvailableVideo] = useState(false); // 비디오 play 가능 체크
  const [isShowPoster, setIsShowPoster] = useState(true); // 비디오 포스터 노출
  const nickname = useMemo(() => {
    const name = userInfo?.nickname || '';
    return name.length > 9 ? `${name.substring(0, 9)}...` : name;
  }, [userInfo?.nickname]);
  const { isIOS } = useDeviceDetect();

  const { videoRef } = useVideo({
    videoEvents: {
      canplay: () => {
        if (isAvailableVideo) {
          return;
        }

        setIsAvailableVideo(true);
        // 비디오 재생가능 시점에서 1프레임 렌더링 될때 흰 여백을 보간하기 위한 타이밍 조절
        setTimeout(() => setIsShowPoster(false), 500);
      },
      error: () => setErrorBGMedia(true),
    },
  });

  return (
    <div ref={ref} className={className}>
      <div className="card-inner">
        <div
          className={classNames('card-bg', {
            'video-bg': backgroundType === 'VIDEO',
          })}
        >
          {backgroundType !== 'COLOR' && (
            <>
              {!errorBGMedia && (
                <>
                  {backgroundType === 'IMAGE' && backgroundImage && (
                    <Image
                      src={getImageLink(backgroundImage.path, 1080)}
                      blurHash={backgroundImage.blurHash}
                      lazy
                      onError={() => setErrorBGMedia(true)}
                    />
                  )}

                  {backgroundType === 'VIDEO' && backgroundVideo && (
                    <>
                      <Video
                        className={`video ${isAvailableVideo ? 'done' : ''}`}
                        ref={videoRef}
                        lazy
                        src={getImageLink(backgroundVideo.path)}
                        blurHash={backgroundVideo.blurHash}
                        loop
                        muted
                        playsInline
                        autoPlay
                        poster={isIOS ? '' : getImageLink(backgroundVideo.thumbnailImage.path)}
                      />
                      {isShowPoster && (
                        <div className="video-poster">
                          <Image
                            src={getImageLink(backgroundVideo.thumbnailImage.path)}
                            blurHash={backgroundVideo.thumbnailImage.blurHash}
                            lazy
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {errorBGMedia && <div className="overlay-error" />}
            </>
          )}
        </div>
        <div className="vote-title">
          <p className="title">{title}</p>
          <p className="user">
            {nickname}님의
            <br />
            투표 인증서
          </p>
        </div>
        <div className="vote-list">
          <div
            className={classNames('vote-inner', {
              large: voteList.length === 1,
              medium: voteList.length === 2,
              small: voteList.length > 2,
              'is-single-line': voteList.length < 4,
              'is-multi-line': voteList.length >= 4,
              'is-quad': voteList.length === 4,
            })}
          >
            {voteList.map(({ id, primaryImage, name }: VoteItemModel, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${id}-${index}`} className={classNames('vote-item')}>
                  <div className="item-thumb">
                    <Image src={getImageLink(primaryImage.path, 1080)} blurHash={primaryImage.blurHash} lazy />
                  </div>
                  <p className="item-title">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="footer">
          {logoImage && (
            <>
              <span className="logo-brand">
                <SVG src={getImageLink(logoImage.path)} />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * 투표 카드 컴포넌트
 */
export const VoteCard = styled(VoteCardComponent)`
  & .card-inner {
    position: relative;
    overflow: hidden;
    width: 100%;
    border-radius: ${({ theme }) => theme.radius.r8};
    box-shadow: 0 0.2rem 3.2rem 0 rgba(0, 0, 0, 0.24);

    & .card-bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: ${({ vote }) => vote.backgroundType === 'COLOR' && vote.backgroundColor};
      ${Image} {
        /* Image overriding */
        background: none;
      }
      .video,
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;
        border-radius: ${({ theme }) => theme.radius.r8};
      }
      &.video-bg {
        width: 100%;
      }

      .video {
        clip-path: inset(0px 0px);
        visibility: hidden;
        width: 100% !important;
        &.done {
          visibility: visible;
        }
      }
      .video-poster {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;
      }
      .overlay-error {
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    & .vote-title {
      position: relative;
      padding: 3.2rem 2.4rem 2.4rem 2.4rem;
      text-align: center;
      color: ${({ theme }) => theme.color.whiteLight};

      & .title {
        font: ${({ theme }) => theme.fontType.miniB};
        margin-bottom: 0.4rem;
      }
      & .user {
        font: ${({ theme }) => theme.fontType.title2B};
      }
    }

    & .vote-list {
      position: relative;
      margin: 1.6rem 0;
      min-height: 28.4rem;
      & .vote-item {
        height: 100%;
        & .item-thumb {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          overflow: hidden;
          & img {
            border-radius: 50%;
          }
        }
        & .item-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: center;
          position: relative;
          color: ${({ theme }) => theme.color.whiteLight};
          font: ${({ theme }) => theme.fontType.mini};
          margin-top: 0.8rem;
        }
      }

      & .vote-inner {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        &.large {
          width: 100%;
          padding: 2.4rem 2.4rem 0 2.4rem;
          & .vote-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          & .item-thumb {
            width: 19.6rem;
            height: 19.6rem;
          }
        }
        &.medium {
          padding-top: 5.5rem;
          & .vote-item {
            width: 13.4rem;
            margin-left: 1.2rem;
            &:first-child {
              margin-left: 0;
            }
          }
          & .item-thumb {
            height: 13.4rem;
            width: 100%;
          }
          @media screen and (max-width: 320px) {
            padding-top: 9rem;
            & .vote-item {
              width: 6.4rem;
            }
            & .item-thumb {
              height: 6.4rem;
              width: 100%;
            }
          }
        }
        &.small {
          & .vote-item {
            width: 8.6rem;
            margin-left: 1.2rem;
          }
          & .item-thumb {
            height: 8.6rem;
            width: 100%;
          }
          @media screen and (max-width: 320px) {
            & .vote-item {
              width: 6.4rem;
            }
            & .item-thumb {
              height: 6.4rem;
              width: 100%;
            }
          }

          &.is-single-line {
            padding-top: 7.9rem;
            & .vote-item {
              &:first-child {
                margin-left: 0;
              }
            }
            @media screen and (max-width: 320px) {
              padding-top: 9rem;
              & .vote-item {
                margin-left: 1rem;
              }
            }
          }
          &.is-multi-line {
            margin: 0 auto;
            padding-top: 1.4rem;
            & .vote-item {
              margin-top: 1.2rem;
              &:nth-child(-n + 3) {
                margin-top: 0;
              }
              &:nth-child(3n + 1) {
                margin-left: 0;
              }
            }
            &.is-quad {
              width: 18.4rem;
              & .vote-item {
                margin-top: 1.2rem;
                margin-left: 1.2rem;
                &:nth-child(-n + 2) {
                  margin-top: 0;
                }
                &:nth-child(odd) {
                  margin-left: 0;
                }
              }
            }
            @media screen and (max-width: 320px) {
              padding-top: 3.6rem;
              &.is-quad {
                width: 13.8rem;
                & .vote-item {
                  margin-left: 1rem;
                }
                & .vote-item {
                  margin-left: 1rem;
                }
              }
            }
          }
        }
      }
    }

    & .footer {
      position: relative;
      height: 7.8rem;
      display: flex;
      justify-content: center;
      padding: 0.8rem;
      & .logo-brand {
        position: relative;
        width: ${({ vote }) => `${vote.logoImage.width / 10}rem`};
        height: ${({ vote }) => `${vote.logoImage.height / 10}rem`};
        max-width: 20.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      & svg {
        * {
          fill: ${({ theme }) => `${theme.light.color.whiteLight}!important`};
        }
      }

      &::before {
        display: block;
        content: '';
        width: 100%;
        height: 11rem;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
      }
    }
  }
`;
