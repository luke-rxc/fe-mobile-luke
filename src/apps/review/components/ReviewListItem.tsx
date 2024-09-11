import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import SwiperCore, { Swiper } from 'swiper';
import { UniversalLinkTypes } from '@constants/link';
import { WebHeaderHeight } from '@constants/ui';
import type { ReviewListItemModel } from '@features/review/models';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Image } from '@pui/image';
import { VideoFilled } from '@pui/icon';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { getImageLink } from '@utils/link';
import { useIntersectionService, useLogService } from '../services';

interface ReviewListItemProps {
  /** 리뷰 정보 */
  review: ReviewListItemModel;
  /** 슬라이드 적용 리뷰의 reviewIds */
  slideReviewIds: number[];
  /** 활성화 비디오 리뷰 id */
  activeReviewVideoId: number;
  /** 뷰포트 인입 콜백 */
  onInView: (reviewId: number, inView: boolean) => void;
}

export const ReviewListItem = ({ review, slideReviewIds, activeReviewVideoId, onInView }: ReviewListItemProps) => {
  const { id: reviewId, mediaList: reviewMediaList, userNickname, userProfileImage, goods } = review;
  const { id: goodsId, name: goodsName } = goods;
  const { isApp } = useDeviceDetect();
  const { initializeValues } = useWebInterface();
  const { getLink } = useLink();
  const { sectionRef, inView: sectionInView } = useIntersectionService({ once: true });
  const { logImpressionReviewThumbnail, logTabReviewThumbnail } = useLogService();
  const topBarHeight = useRef(WebHeaderHeight); // 탑 영역 사이즈
  const videoList = reviewMediaList.filter((media) => media.fileType === 'VIDEO');
  const isVideo = !!videoList.length;
  const videoValue = isVideo && videoList[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLLIElement>(null);
  const swiper = useRef<(HTMLDivElement & { swiper: Swiper }) | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isReadied, setIsReadied] = useState<boolean>(false);
  /** 리뷰 이미지 슬라이더 Delay (2000 ~ 16000ms 랜덤값 지정) */
  const swiperDelay = 2000 + Math.floor(Math.random() * 8) * 2000;

  const link = useMemo(() => {
    return getLink(UniversalLinkTypes.REVIEW_DETAIL, {
      reviewId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * 비디오가 재생 준비 완료되면 isReadied값 업데이트
   */
  const handleCanPlayVideo = () => {
    setIsReadied(true);
  };

  /**
   * Intersection observer 핸들러
   */
  const handleVisibility = ([entry]: IntersectionObserverEntry[]) => {
    // 비디오 처리
    if (isVideo) {
      onInView(reviewId, entry.isIntersecting);
      return;
    }

    // 이미지 슬라이딩 처리
    if (entry.isIntersecting) {
      /** 슬라이드 적용 리뷰의 autoplay 재시동 */
      if (
        Number(swiper.current?.swiper.el.getAttribute('data-index')) === reviewId &&
        !swiper.current?.swiper.autoplay.running
      ) {
        swiper.current?.swiper.autoplay.start();
      }
    } else {
      swiper.current?.swiper.autoplay.stop();
    }
  };

  /** 리뷰 썸네일 Press 핸들링 */
  const handleTouchReview = () => {
    setIsPressed(!isPressed);
  };

  const handleClickReview = () => {
    logTabReviewThumbnail({ reviewId, goodsId, goodsName });
  };

  /**
   * video 세팅
   */
  useEffect(() => {
    if (!videoValue || !videoRef.current) return;

    if (activeReviewVideoId === reviewId) {
      videoRef.current.src = getImageLink(videoValue.path);
    } else {
      videoRef.current.src = '';
      setIsReadied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReviewVideoId, videoRef.current]);

  /**
   * 리뷰 이미지 Swiper 슬라이드 제어를 위한 ref 지정
   */
  useEffect(() => {
    if (!isVideo && !swiper.current) {
      const slide = container.current?.querySelector('.swiper');

      if (slide) {
        swiper.current = slide as HTMLDivElement & SwiperCore;
        swiper.current?.swiper.autoplay.stop();

        if (slideReviewIds.includes(reviewId)) {
          /** 슬라이드 적용 리뷰에 data-index 지정 */
          swiper.current?.setAttribute('data-index', `${reviewId}`);
          swiper.current?.swiper.autoplay.start();
        }
      }
    }

    return () => {
      swiper.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 페이지 내, 리뷰 이미지 슬라이더 노출 여부 체크
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (container.current) {
      const viewH = container.current.offsetHeight;
      const topMargin = (viewH / 2) * -1 - topBarHeight.current;
      const bottomMargin = (viewH / 2) * -1;
      observer = new IntersectionObserver(handleVisibility, {
        rootMargin: isVideo ? `${topMargin}px 0px ${bottomMargin}px 0px` : '0px',
        threshold: isVideo ? 0 : 0.3,
      });
      observer.observe(container.current);
    }

    return () => observer && observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sectionInView) {
      logImpressionReviewThumbnail({ reviewId, goodsId, goodsName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionInView]);

  /**
   * 웹뷰 Top 시스템 영역 사이즈
   */
  useLayoutEffect(() => {
    if (!isApp) return;
    if (initializeValues && initializeValues.topInset) {
      topBarHeight.current = initializeValues.topInset;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeValues]);

  return (
    <Item
      ref={container}
      onTouchStart={handleTouchReview}
      onTouchEnd={handleTouchReview}
      className={`${isPressed ? 'is-pressed' : ''}`}
    >
      <div ref={sectionRef}>
        <Action is="a" link={link} onClick={handleClickReview} className="lnk-box">
          {/* 리뷰 작성자 정보 */}
          <div className="review-user">
            <Image src={userProfileImage.path} blurHash={userProfileImage.blurHash} lazy alt="user profile image" />
            <div className="review-user-name">{userNickname}</div>
            {isVideo && (
              <span className="ic-video">
                <VideoFilled />
              </span>
            )}
          </div>
          {isVideo && videoValue && (
            <div className="video-content">
              <div
                className={classNames('review-video', {
                  'is-ready': isReadied,
                })}
              >
                <div className="poster-wrapper">
                  <Image
                    lazy
                    src={getImageLink(videoValue.thumbnailImage?.path || '')}
                    blurHash={videoValue.thumbnailImage?.blurHash}
                  />
                </div>
                <div className="video-wrapper">
                  <video ref={videoRef} muted loop playsInline autoPlay onCanPlay={handleCanPlayVideo} />
                </div>
              </div>
            </div>
          )}
          {/* 리뷰 이미지 슬라이더 */}
          {!isVideo && (
            <SwiperContainer
              speed={900}
              autoplay={{ delay: swiperDelay, disableOnInteraction: false }}
              loop={reviewMediaList.length > 1}
              allowTouchMove={false}
            >
              {reviewMediaList.map((reviewImage) => {
                const { id, path, blurHash } = reviewImage;
                return (
                  <SwiperSlide key={id}>
                    <div className="review-image-inner">
                      <Image src={getImageLink(path, 512)} blurHash={blurHash} alt="review image" />
                    </div>
                  </SwiperSlide>
                );
              })}
            </SwiperContainer>
          )}
        </Action>
      </div>
    </Item>
  );
};

const Item = styled.li`
  overflow: hidden;
  position: relative;
  border-radius: 0.8rem;

  ${Action} {
    display: block;
    overflow: hidden;
  }

  .review-user {
    display: flex;
    z-index: 2;
    ${({ theme }) => theme.mixin.absolute({ r: 0, b: 0, l: 0 })};
    padding: 0.8rem 1.2rem 0.8rem 0.8rem;
    border-bottom-right-radius: 0.8rem;
    border-bottom-left-radius: 0.8rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);

    &-name {
      flex: 1;
      color: #fff;
      font: ${({ theme }) => theme.fontType.mini};
      line-height: 2.4rem;
      ${({ theme }) => theme.mixin.ellipsis()};
      text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
    }

    ${Image} {
      overflow: hidden;
      width: 2.4rem;
      height: 2.4rem;
      margin-right: 0.8rem;
      border-radius: 50%;
      object-fit: cover;
    }

    & .ic-video {
      & svg *[fill],
      svg *[stroke] {
        color: ${({ theme }) => theme.light.color.whiteLight};
      }
    }
  }

  .swiper {
    display: flex;
    overflow: hidden;
    flex-direction: column-reverse;
    border-radius: 0.8rem;
  }

  .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.34, 0.14, 0.13, 0.89);
  }

  .review-image-inner {
    position: relative;
    padding-top: 100%;

    ${Image} {
      ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
      background-color: transparent;
    }
  }

  .video-content {
    padding-top: 100%;
  }

  .review-video {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0, b: 0 })};
    overflow: hidden;
    width: 100%;
    height: 100%;

    video {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;

      &::-webkit-media-controls-start-playback-button,
      &::-webkit-media-controls-play-button {
        display: none !important;
        opacity: 0;
        appearance: none;
      }
    }

    & .video-wrapper,
    .poster-wrapper {
      overflow: hidden;
      position: absolute;
      z-index: 0;
      height: 100%;
      inset: 0px;
    }

    &.is-ready {
      .poster-wrapper {
        display: none;
      }
    }
  }

  .lnk-box {
    -webkit-tap-highlight-color: transparent;

    &:before {
      z-index: 2;
      ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
      border-radius: 0.8rem;
      background: ${({ theme }) => theme.color.black};
      opacity: 0;
      transition: opacity 0.2s;
      content: '';
      pointer-events: none;
    }
  }

  &.is-pressed {
    .lnk-box {
      &::before {
        opacity: 0.1;
      }
    }
  }
`;
