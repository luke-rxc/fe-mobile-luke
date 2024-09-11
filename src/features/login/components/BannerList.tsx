/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { BannerItem, BannerItemProps } from './BannerItem';

const linearGradient = (color: string) => {
  return `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`;
};

export interface BannerListProps extends React.HTMLAttributes<HTMLDivElement> {
  banners: BannerItemProps[];
}

/**
 * Main Banner list
 */
export const BannerList = styled<React.VFC<BannerListProps>>(({ banners, className, ...props }) => {
  const onlyOne = !banners.length;
  const classNames = classnames(className, { 'is-swipe': banners.length });

  /**
   * webpage의 활성화 여부
   */
  const [documentVisible, setDocumentVisibleState] = useState<boolean>(true);

  /**
   * visibilitychange에 따른 상태값 업데이트
   */
  const handleVisibilityChange = useCallback(() => {
    setDocumentVisibleState(document.visibilityState !== 'hidden');
  }, []);

  /**
   * visibilitychange event bind/unbind
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, []);

  return (
    <div className={classNames} {...props}>
      <SwiperContainer pagination={!onlyOne} loop>
        {banners.map((banner) => (
          <SwiperSlide key={banner.mediaInfo.id}>
            {({ isActive }: { isActive: boolean }) => <BannerItem {...banner} inView={documentVisible && isActive} />}
          </SwiperSlide>
        ))}
      </SwiperContainer>
    </div>
  );
})`
  position: relative;

  .swiper {
    display: flex;
    flex-direction: column-reverse;
  }

  .swiper-pagination {
    padding: 1.2rem 0;
    background: ${({ theme }) => linearGradient(theme.color.surface)};
  }
`;
