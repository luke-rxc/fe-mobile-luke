import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import { ContentType } from '@constants/content';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Image, ImageProps } from '@pui/image';
import { GoodsCardMini, GoodsCardMiniProps } from '@pui/goodsCardMini';

export interface FeedBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 타이틀 */
  title: string;
  /** 서브 타이틀 */
  subTitle: string;
  /** 배너 랜딩 타입 */
  bannerType: 'GOODS' | 'SHOWROOM' | 'CONTENTS_STORY' | 'CONTENTS_TEASER';
  /** 배너 랜딩 코드 (상품 / 쇼룸 / 콘텐츠) */
  landingCode: string;
  /** 배경 이미지 */
  image: Pick<ImageProps, 'src' | 'blurHash'>;
  /** 전시 상품 리스트 */
  goods?: GoodsCardMiniProps[];
}

export const FeedBanner = styled(
  forwardRef<HTMLDivElement, FeedBannerProps>((props, ref) => {
    const { title, subTitle, bannerType, landingCode, image, goods, className, ...rest } = props;
    const { getLink } = useLink();
    const containerRef = useRef<HTMLDivElement>(null);

    /** Intersection observer 관찰 target  */
    const targetRef = useRef<HTMLDivElement>(null);
    /** 배경 이미지 */
    const imageRef = useRef<HTMLDivElement>(null);
    /** 배너 링크 Press 상태 */
    const [isPressed, setIsPressed] = useState<boolean>(false);

    /** 배너 랜딩 링크 */
    const bannerLink = useMemo(() => {
      if (bannerType === 'GOODS') {
        return getLink(UniversalLinkTypes.GOODS, { goodsCode: landingCode });
      }
      if (bannerType === 'SHOWROOM') {
        return getLink(UniversalLinkTypes.SHOWROOM, { showroomCode: landingCode });
      }
      if (bannerType === 'CONTENTS_STORY') {
        return getLink(UniversalLinkTypes.CONTENT, {
          contentType: ContentType.STORY.toLowerCase(),
          contentCode: landingCode,
        });
      }
      if (bannerType === 'CONTENTS_TEASER') {
        return getLink(UniversalLinkTypes.CONTENT, {
          contentType: ContentType.TEASER.toLowerCase(),
          contentCode: landingCode,
        });
      }
      return '';
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Intersection observer 핸들링 */
    const handleIntersect = ([entry]: IntersectionObserverEntry[]) => {
      imageRef.current && (imageRef.current.style.opacity = `${entry.intersectionRatio}`);
    };

    /** 배너 링크 Press 핸들링 */
    const handleTouchBannerLink = () => {
      setIsPressed(!isPressed);
    };

    useEffect(() => {
      let observer: IntersectionObserver;

      if (targetRef.current) {
        observer = new IntersectionObserver(handleIntersect, {
          threshold: range(0, 1, 0.01),
        });
        observer.observe(targetRef.current);
      }

      return () => {
        observer && observer.disconnect();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 부모 자식 컴포넌트 간 상호작용을 위해
     * 부모 컴포넌트에서 사용하는 ref를 targetRef.current로 반환
     */
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    return (
      <div ref={containerRef} className={`${className} ${isPressed ? 'is-pressed' : ''}`} {...rest}>
        {/* 배너 랜딩 링크 */}
        <Action
          is="a"
          link={bannerLink}
          className="banner-link"
          onTouchStart={handleTouchBannerLink}
          onTouchEnd={handleTouchBannerLink}
        >
          {/* 타이틀, 서브 타이틀 영역 */}
          <div className="banner-title">
            <strong>{title}</strong>
            {subTitle}
          </div>

          {/* 배경 이미지 */}
          <div className="banner-image image-default">
            <div ref={imageRef} className="banner-image-inner">
              <Image src={image.src} blurHash={image.blurHash} />
            </div>
          </div>
          <Image src={image.src} className="banner-image image-blurred" blurHash={image.blurHash} />
        </Action>

        {/* 상품 영역 */}
        {!isEmpty(goods) && (
          <div className="banner-goods">
            <div ref={targetRef} className="banner-observer-target" />
            {goods?.map((item) => (
              <GoodsCardMini key={item.goodsId} {...item} />
            ))}
          </div>
        )}
      </div>
    );
  }),
)`
  position: relative;
  overflow: hidden;
  height: 24rem;
  transform: scale(1);

  &.is-pressed {
    transition: transform 0.2s;
    transform: scale(0.96);
    &::before {
      z-index: 4;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.1);
      content: '';
    }
  }

  .banner-link {
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .banner-title {
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding: 2rem 2.4rem 0;
    color: #fff;
    font: ${({ theme }) => theme.fontType.t14};

    strong {
      display: block;
      font: ${({ theme }) => theme.fontType.t24B};
    }
  }

  .banner-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.8rem;

    img {
      border-radius: 0.8rem;
      object-position: left;
      vertical-align: top;
    }

    &.image-default {
      z-index: 1;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
    }

    &.image-blurred {
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        content: '';
      }
    }

    &-inner {
      height: 100%;
    }
  }

  .banner-goods {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 8.8rem;
    right: 0;
    bottom: 0;
    left: 0;
    padding-right: 2.4rem;
    border-radius: 0.8rem;
    overflow-x: auto;
    white-space: nowrap;

    a {
      &:not(:first-of-type) {
        margin-left: 0.8rem;
      }
    }

    ${GoodsCardMini} {
      z-index: 3;
    }

    .goods-thumb {
      border-radius: 0.8rem;
    }

    .goods-info {
      color: #fff;
    }
  }

  .banner-observer-target {
    display: inline-block;
    flex-shrink: 0;
    flex-grow: 1;
    width: 17.2rem;
    height: 100%;
    vertical-align: top;
  }
`;
