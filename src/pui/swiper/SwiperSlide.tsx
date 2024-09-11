import type { FC } from 'react';
import { SwiperSlide as Slide, SwiperSlideProps } from 'swiper/react/swiper-react';

/**
 * swiper slide 공통으로 관리 하기 위한 컴포넌트
 */
export const SwiperSlide: FC<SwiperSlideProps> = ({ children, ...props }: SwiperSlideProps) => {
  return <Slide {...props}>{children}</Slide>;
};
SwiperSlide.displayName = 'SwiperSlide';
