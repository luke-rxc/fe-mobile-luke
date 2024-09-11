/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Swiper as SwiperClass } from 'swiper/types';
import { SwiperContainer, SwiperSlide, SwiperContainerProps } from '@pui/swiper';
import { BannerItem, BannerItemProps } from './BannerItem';
import { BannerProfile, BannerProfileProps } from './BannerProfile';

export interface BannerListProps extends React.HTMLAttributes<HTMLDivElement> {
  banners: BannerItemProps[];
  onViewBanner?: (banner: BannerItemProps) => void;
  onClickBannerLink?: (banner: BannerItemProps) => void;
  onClickProfileLink?: (banner: BannerItemProps) => void;
}

/**
 * Main Banner list
 */
export const BannerList = styled<React.VFC<BannerListProps>>((props) => {
  const { banners, className, onViewBanner, onClickBannerLink, onClickProfileLink, ...rest } = props;
  const container = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass>();

  const onlyOne = banners.length < 2;
  const classNames = classnames(className, { 'is-swipe': !onlyOne });

  /**
   * 현재 화면에 보여지고있는 banner index
   */
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  /**
   * 프로필 정보
   */
  const profileInfo = useMemo<BannerProfileProps | undefined>(() => {
    return banners[currentIndex]?.profileInfo || undefined;
  }, [currentIndex]);

  /**
   * swiper의 page노출여부
   */
  const [visible, setVisibleState] = useState<boolean>(true);

  const handleInitSwiper = (s: SwiperClass) => {
    swiperRef.current = s;
  };

  /**
   * 화면에 노출되고 있는 슬라이드가 변경될때 현재 banner Index 정보를 업데이트
   */
  const handleChangeSlide: SwiperContainerProps['onSlideChangeTransitionEnd'] = useCallback(
    (swiper) => {
      setCurrentIndex(swiper.realIndex);
      visible && onViewBanner?.(banners[swiper.realIndex]);
    },
    [banners, visible],
  );

  /**
   * 배너 클릭 이벤트 핸들러
   */
  const handleClickBannerLink = () => {
    onClickBannerLink?.(banners[currentIndex]);
  };

  /**
   * 프로필 링크 클릭 이벤트 핸들러
   */
  const handleClickProfileLink = () => {
    onClickProfileLink?.(banners[currentIndex]);
  };

  /**
   * visible상태값 업데이트
   */
  const handleVisibilityChange = useCallback(([entry]: IntersectionObserverEntry[]) => {
    swiperRef.current?.autoplay?.[entry.isIntersecting ? 'start' : 'stop']();
    setVisibleState(entry.isIntersecting);
  }, []);

  /**
   * Intersection Observer 구독/해제
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (container.current) {
      observer = new IntersectionObserver(handleVisibilityChange, { threshold: 0.1 });
      observer.observe(container.current);
    }

    return () => observer && observer.disconnect();
  }, []);

  return (
    <div ref={container} className={classNames} {...rest}>
      <SwiperContainer
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={!onlyOne}
        pagination={!onlyOne && { dynamicBullets: true, dynamicMainBullets: 8 }}
        onInit={handleInitSwiper}
        onSlideChangeTransitionEnd={handleChangeSlide}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {({ isActive }) => (
              <BannerItem {...banner} inView={visible && isActive} onClickLink={handleClickBannerLink} />
            )}
          </SwiperSlide>
        ))}
      </SwiperContainer>

      {profileInfo && <BannerProfile {...profileInfo} onClickProfileLink={handleClickProfileLink} />}
    </div>
  );
})`
  position: relative;
  margin-bottom: 1.2rem;

  .swiper {
    display: flex;
    flex-direction: column-reverse;
  }

  .swiper-pagination {
    position: static;
    left: 0 !important;
    margin: 0 auto !important;
    padding: 1.2rem 0 !important;
    transform: translate3d(0, 0, 0) !important;
  }

  ${BannerProfile} {
    ${({ theme }) => theme.mixin.absolute({ b: 52, l: 0, r: 0 })};
    z-index: 1;
  }
`;
