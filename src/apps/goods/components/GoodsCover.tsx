import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Swiper } from 'swiper/types';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMoveTopElementByScroll } from '@hooks/useMoveTopElementByScroll';
import { Image } from '@pui/image';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { PrizmOnlyTag, PrizmOnlyTagRef } from '@pui/prizmOnlyTag';
import { getBenefitTagType } from '@utils/benefitTagType';
import { FileType } from '@constants/file';
import { useGoodsPageInfo } from '../hooks';
import { GoodsCoverModel, GoodsModel } from '../models';
import { DynamicBulletLimit, DynamicBulletSize } from '../constants';
import { GoodsCoverVideo } from './GoodsCoverVideo';

interface Props {
  headers: GoodsCoverModel[];
  tagType: GoodsModel['benefits']['tagType'];
  onIndexChange?: (index: number) => void;
}

const swiperPaginationOpts = {
  clickable: false,
  renderBullet: (index: number, className: string) => {
    return `<span class="no-transition ${className}">&nbsp;</span>`;
  },
};

/**
 * Swiper 의 css scroll snap (cssMode)를 사용할 수 있는 여부 결정
 * @issue scroll-snap-stop 은 ios 14.8 까지는 지원되지 않음
 */
const getSwiperCssModeAble = (isIos: boolean, osMajorVersion: number | null): boolean => {
  if (isIos && osMajorVersion !== null) {
    return osMajorVersion >= 15;
  }

  return false;
};

export const GoodsCover = ({ headers, tagType, onIndexChange }: Props) => {
  const initRef = useRef<boolean>(false);
  const coverWrapperRef = useRef<HTMLDivElement>(null);
  const prizmOnlyTagRef = useRef<PrizmOnlyTagRef>(null);
  const [current, setCurrent] = useState(0);
  const [tagPositionY, setTagPositionY] = useState<number>(0);
  const { isInLivePage } = useGoodsPageInfo();
  const { isApp, isIOS, isAndroid, osVersion } = useDeviceDetect();
  const isSwiperCssModeAble = getSwiperCssModeAble(isIOS, osVersion?.major ?? null);
  const benefitTagType = getBenefitTagType(tagType);
  const isSingleCover = headers.length === 1;
  const total = headers.length;
  const isDynamicBullet = total > DynamicBulletLimit;

  /** Hook: Top 영역 Parallax */
  useMoveTopElementByScroll({
    elementRef: coverWrapperRef,
    ratio: 5,
  });

  const handleSwiperTransition = (swiper: Swiper) => {
    const { pagination } = swiper;

    const bullets = Array.from(pagination.bullets) as HTMLSpanElement[];

    bullets.forEach((bullet) => {
      /** @issue setTimeout 없이 진행시 init 시 해당 클래스가 지워져 transition 이 실행됨 */
      setTimeout(() => {
        bullet.classList.remove('no-transition');
      }, 0);
    });
  };

  const handlePrizmOnlyTagPlay = () => {
    if (!initRef.current) {
      initRef.current = true;
    }
    prizmOnlyTagRef.current?.play();
  };

  /** dynamic bullets 위치 오류시 위치 조정 */
  const handleDynamicBullets = (swiper: Swiper) => {
    const pfx = 'swiper-pagination-bullet-active';
    const { pagination } = swiper;

    const bullets = Array.from(pagination.bullets) as HTMLSpanElement[];
    const bulletsLength = bullets.length;

    /**
     * prev bullet 갯수 = 총 bullet 갯수가 9개 이면 1개, 나머지는 2개
     * */
    const prevBulletCount = bulletsLength > 9 ? 2 : 1;
    const minLeft = (bulletsLength - DynamicBulletLimit - prevBulletCount) * -DynamicBulletSize;
    bullets.forEach((bullet, index) => {
      const currentLeft = +bullet.style.left.split('px')[0];

      /**
       * @issue 최소 bullet 노출 갯수가 DynamicBulletLimit + 2(prev or next) 이기 때문에 맨뒤로 넘어갈 경우 최소 left 위치 값을 지정해 줌으로써 bullet 위치가 틀어지는 것을 방지
       * active bullet 기준으로 main bullet 에 prev bullet class 가 적용될 수 있어 해당 class 는 제거 처리
       */
      if (currentLeft < minLeft) {
        if (index === bulletsLength - DynamicBulletLimit - 2) {
          bullet.classList.add(`${pfx}-prev-prev`);
        }
        if (index === bulletsLength - DynamicBulletLimit - 1) {
          bullet.classList.remove(`${pfx}-prev-prev`);
          bullet.classList.add(`${pfx}-prev`);
        }
        if (index >= bulletsLength - DynamicBulletLimit && index <= bulletsLength - 1) {
          bullet.classList.remove(`${pfx}-prev-prev`);
          bullet.classList.remove(`${pfx}-prev`);
          bullet.classList.add(`${pfx}-main`);
        }

        // eslint-disable-next-line no-param-reassign
        bullet.style.cssText = `left: ${minLeft}px`;
      }
    });
  };

  const handleActiveIndexChange = (swiper: Swiper) => {
    const { realIndex } = swiper;
    onIndexChange?.(realIndex);
    setCurrent(realIndex);
    handlePrizmOnlyTagPlay();
    isDynamicBullet && handleDynamicBullets(swiper);
  };

  const handleSlideToLoop = (swiper: Swiper) => {
    if (isSwiperCssModeAble) {
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          swiper.slideToLoop(swiper.realIndex, 0, false);
          /**
           * Reset Props
           */
          // swiper.update();
          // swiper.slideReset(0, false);
          // swiper.updateProgress();
          // swiper.slideToClosest(0, false);
        });
      }, 50);
    }
  };

  /**
   * @issue AOS 기기마다 기기 스테이터스바의 높이가 달라 기기별로 위치가 다른 이슈
   * cover의 높이를 기준으로 25%, 최대값은 104로 정해 더 작은 값에 위치하도록 설정
   * 해당 값은, AOS 일 경우에만 사용
   */
  const handleGetTagPositionY = () => {
    if (!(isApp && isAndroid)) {
      return;
    }

    // 유한수 판별을 통한 배열 필터링
    const y = [(coverWrapperRef.current?.offsetHeight ?? NaN) * 0.25, 104].filter(Number.isFinite);
    setTagPositionY(Math.min(...y));
  };

  useEffect(() => {
    if (!initRef.current) {
      return;
    }

    window.scrollY === 0 && handlePrizmOnlyTagPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.scrollY]);

  useEffect(() => {
    handleGetTagPositionY();
    window.addEventListener('resize', handleGetTagPositionY);

    return () => {
      window.removeEventListener('resize', handleGetTagPositionY);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper ref={coverWrapperRef} tagPositionY={tagPositionY} isDynamicBullet={isDynamicBullet}>
      {benefitTagType !== 'none' && (
        <PrizmOnlyTag
          ref={prizmOnlyTagRef}
          className={classnames({
            'is-ios': isApp && isIOS,
            /**
             * IOS 노치가 없는 기종 중 화면 사이즈가 큰 기종(plus) 스크린 높이 736을 기준으로 분기처리
             * 노치가 있는 기종 중 화면 사이즈가 가장 작은 기종(mini) 스크린 높이 780으로 영향 X
             */
            'small-screen': window.screen.height <= 736,
            'is-aos': isApp && isAndroid,
            'is-live': isInLivePage,
          })}
          size="large"
          trigger={false}
          tagType={benefitTagType}
        />
      )}
      <SwiperContainer
        loop={!isSingleCover}
        // 양 옆에 몇개씩 둘것인지?
        // loopedSlides={headers.length}
        pagination={{
          ...swiperPaginationOpts,
          dynamicBullets: isDynamicBullet,
          dynamicMainBullets: DynamicBulletLimit,
        }}
        direction="horizontal"
        className={`swiper-container ${!isSwiperCssModeAble ? 'css-mode-disabled' : ''}`}
        onInit={handlePrizmOnlyTagPlay}
        onAfterInit={handleSwiperTransition}
        onActiveIndexChange={handleActiveIndexChange}
        onReachBeginning={handleSlideToLoop}
        onReachEnd={handleSlideToLoop}
        touchRatio={0.8}
        centeredSlides={isSwiperCssModeAble && !isDynamicBullet}
        centeredSlidesBounds={isSwiperCssModeAble && !isDynamicBullet}
        roundLengths={isSwiperCssModeAble && !isDynamicBullet}
        // 옵션을 선택하지 않을 경우 양옆에 1개씩, 옵션 선택시 양옆에 2Set 씩
        slidesPerView={isSwiperCssModeAble && !isDynamicBullet ? 'auto' : 1}
        cssMode={isSwiperCssModeAble}
      >
        {headers.map(({ type, file, videoPlayType }: GoodsCoverModel, index: number) => (
          /** @todo 겹치는 key 가 있는 지 추후 확인 */
          // eslint-disable-next-line react/no-array-index-key
          <SwiperSlide key={`${file.id}_${index}`}>
            <ContentWrapper>
              <div className="inner">
                <div className="content-container">
                  {type === FileType.IMAGE && (
                    <Image
                      lazy={index !== 0 && index !== headers.length - 1}
                      src={file.path}
                      blurHash={file.blurHash}
                    />
                  )}
                  {type === FileType.VIDEO && (
                    <GoodsCoverVideo
                      src={file.path}
                      className="video"
                      loop={videoPlayType === 'REPEAT'}
                      poster={file.thumbnailImage ? file.thumbnailImage.path : undefined}
                      isActive={current === index}
                    />
                  )}
                </div>
              </div>
            </ContentWrapper>
          </SwiperSlide>
        ))}
      </SwiperContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ tagPositionY: number; isDynamicBullet: boolean }>`
  position: relative;
  width: 100vw;
  height: 100vw;

  ${PrizmOnlyTag} {
    ${({ theme }) => theme.absolute({ t: 64, l: 24 })};
    z-index: 2;

    &.is-ios {
      top: 10.4rem;
      left: 2rem;

      &.small-screen {
        top: 7.2rem;
      }
    }

    &.is-aos {
      top: ${({ tagPositionY }) => `${tagPositionY / 10}rem`};
      left: 1.6rem;
    }

    &.is-live {
      top: 1.6rem;
      left: 1.6rem;
    }
  }

  & .swiper-container {
    height: 100vw;
    & > .swiper-slide__content {
      position: absolute !important;
      top: 0 !important;
    }

    & .swiper-wrapper {
      overflow-x: auto !important;
      overflow-y: hidden !important;

      /* firefox */
      scrollbar-width: none;
      /* chrome, safari */
      &::-webkit-scrollbar {
        display: none;
      }
    }

    & .swiper-slide {
      scroll-snap-align: start !important;
      scroll-snap-stop: always !important;
      flex-shrink: 0 !important;
      -webkit-overflow-scrolling: touch;
    }
  }

  & .swiper-container.css-mode-disabled {
    & .swiper-wrapper {
      overflow-x: initial !important;
      overflow-y: initial !important;
    }

    & .swiper-slide {
      scroll-snap-align: none !important;
      scroll-snap-stop: none !important;
    }
  }

  & .swiper-pagination-bullets {
    ${({ isDynamicBullet }) => !isDynamicBullet && `display: flex; align-items: center; justify-content: center;`}
    bottom: 1rem;
    pointer-events: none;
  }

  & .swiper-pagination-bullet {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 !important;
    margin-right: 1rem !important;
    /* tint light 모드로만 적용 */
    background: ${({ theme }) => theme.light.color.gray20};
  }

  & .swiper-pagination-bullet:first-child {
    margin-top: 0 !important;
  }

  & .swiper-pagination-bullet:last-child {
    margin: 0 !important;
  }

  & .swiper-pagination-bullet-active {
    width: 0.8rem !important;
    /* tint light 모드로만 적용 */
    background: ${({ theme }) => theme.color.brand.tint};
    border-radius: 3rem;
  }

  .no-transition {
    transition: none !important;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;

  & .inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  & .content-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: ${({ theme }) => theme.color.background.bg};
  }

  & img {
    width: 100%;
  }
`;
