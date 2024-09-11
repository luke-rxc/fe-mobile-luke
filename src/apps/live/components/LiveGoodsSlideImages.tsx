import { Image } from '@pui/image';
import styled from 'styled-components';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import Swiper from 'swiper';
import { useEffect, useState } from 'react';
import { ImageModel } from '../models';

interface Props {
  images: Array<ImageModel>;
  className?: string;
  stopSlide?: boolean;
}

/**
 * LiveGoodsSlideImages
 */
export const LiveGoodsSlideImages = ({ images, className, stopSlide = false }: Props) => {
  const [swiper, setSwiper] = useState<Swiper>();

  useEffect(() => {
    if (stopSlide) {
      swiper?.autoplay?.stop();
    }
  }, [stopSlide, swiper]);

  const handleUpdateSwiper = (initSwiper: Swiper) => {
    setSwiper(initSwiper);
  };

  const handleAnimationEnd = () => {
    if (stopSlide) {
      swiper?.slideToLoop(0, 0);
    } else {
      swiper?.autoplay?.start();
    }
  };

  if (images.length === 1) {
    return (
      <WrapperStyled className={className}>
        <ImageStyled width="64px" height="64px" src={images[0].path} blurHash={images[0].blurHash} />
      </WrapperStyled>
    );
  }

  return (
    <WrapperStyled className={className} onAnimationEnd={handleAnimationEnd}>
      <SwiperContainer
        autoplay={{ delay: 500, disableOnInteraction: false }}
        speed={1000}
        direction="vertical"
        loop
        slidesPerView={1}
        width={64}
        height={64}
        allowTouchMove={false}
        onSwiper={handleUpdateSwiper}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={`goods-image-${image.id}-${idx.toString()}`}>
            {() => <ImageStyled width="64px" height="64px" src={image.path} blurHash={image.blurHash} />}
          </SwiperSlide>
        ))}
      </SwiperContainer>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 0.8rem;
  overflow: hidden;
  isolation: isolate;

  .swiper-slide {
    width: 6.5rem;
    height: 6.5rem;
  }
`;

const ImageStyled = styled(Image)`
  background-color: transparent;
`;
