import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import type Swiper from 'swiper';
import { Image } from '@pui/image';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { BenefitListAOverlayColorTypes, MediaType, TypoItemSizeType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  BenefitListADisplayModel,
  ContentLogInfoModel,
  DisplayMediaModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { ImageBox } from './ImageBox';

const BenefitListAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as BenefitListADisplayModel;
  const { backgroundMedia, subTitle, description, detail, useMedia, mediaList, controller } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetBenefitListInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const swp = useRef<Swiper | null>(null);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const swiperOption = useRef<SwiperContainerProps>({
    pagination: {
      type: 'bullets',
      clickable: true,
    },
    loop: mediaList.length > 1,
    controlTheme: {
      ...(controller?.bulletColor && { color: controller.bulletColor }),
      paginationOverlay:
        // eslint-disable-next-line no-nested-ternary
        controller?.background === BenefitListAOverlayColorTypes.BLACK
          ? 'black'
          : controller?.background === BenefitListAOverlayColorTypes.WHITE
          ? 'white'
          : '',
    },
    touchReleaseOnEdges: mediaList.length === 1,
    onSwiper: (swiper: Swiper) => {
      swp.current = swiper;
    },
  });

  useEffect(() => {
    if (inView) {
      logPresetBenefitListInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <BenefitListAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div className="bg">
            {!errorMedia && (
              <>
                {backgroundMedia.type === MediaType.IMAGE && (
                  <Image
                    src={getImageLink(backgroundMedia.path)}
                    blurHash={backgroundMedia.blurHash}
                    onError={() => setErrorMedia(true)}
                    lazy
                  />
                )}
              </>
            )}
            {errorMedia && <div className="overlay-error" />}
          </div>
          <div className="contents">
            {(subTitle.text || description.text) && (
              <div className="title-box">
                {subTitle.text && (
                  <p
                    className={classNames('title', {
                      'is-large': subTitle.sizeType === TypoItemSizeType.LARGE,
                      'is-medium': subTitle.sizeType === TypoItemSizeType.MEDIUM,
                    })}
                  >
                    {nl2br(subTitle.text)}
                  </p>
                )}
                {description.text && (
                  <p
                    className={classNames('sub', {
                      'is-small': description.sizeType === TypoItemSizeType.SMALL,
                      'is-mini': description.sizeType === TypoItemSizeType.MINI,
                    })}
                  >
                    {nl2br(description.text)}
                  </p>
                )}
              </div>
            )}
            {useMedia && (
              <div className="media-list">
                <SwiperContainer {...swiperOption.current}>
                  {mediaList.map((mediaItem: DisplayMediaModel) => {
                    const { id, type, ...mediaRest } = mediaItem;
                    const media = { ...mediaRest } as DisplayMediaModel;
                    return (
                      <SwiperSlide key={id}>
                        <div className="media-wrapper">{type === MediaType.IMAGE && <ImageBox media={media} />}</div>
                      </SwiperSlide>
                    );
                  })}
                </SwiperContainer>
              </div>
            )}
            {detail.text && <p className={classNames('detail')}>{nl2br(detail.text)}</p>}
          </div>
        </BenefitListAContent>
      )}
    </div>
  );
});
const BenefitListA = styled(BenefitListAComponent)``;
export default BenefitListA;

const BenefitListAContent = styled('div').attrs((props: BenefitListADisplayModel) => props)`
  position: relative;
  padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 1.6 : 0}rem`};
  padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 3.2 : 0}rem`};
  background-color: ${({ backgroundInfo }) => backgroundInfo.color};
  color: ${({ textColor, theme }) => textColor || theme.color.text.textPrimary};

  & .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay-error {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
    }

    &:after {
      ${({ isOverlay }) => {
        if (isOverlay) {
          return css`
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: ${({ theme }) => theme.color.gray50};
            content: '';
          `;
        }
        return null;
      }}
    }
  }

  & .contents {
    position: relative;
    padding: 0 2.4rem;

    &::before {
      display: block;
      width: 100%;
      height: 1px;
      margin: 0 auto;
      background-color: ${({ theme, textColor }) => textColor || theme.color.backgroundLayout.line};
      opacity: ${({ textColor }) => (textColor ? 0.08 : 1)};
      content: '';
    }

    & .title-box {
      margin-top: 3.2rem;
      text-align: ${({ align }) => align};

      & .title {
        &.is-large {
          font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
        }

        &.is-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
        }
      }

      & .sub {
        opacity: 0.7;

        &.is-small {
          font: ${({ theme }) => theme.content.contentStyle.fontType.small};
        }

        &.is-mini {
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
        }
      }

      & .title + .sub {
        margin-top: 1.6rem;
      }
    }

    & .media-list {
      overflow: hidden;
      margin-top: 2.4rem;
      border-radius: ${({ theme }) => theme.radius.r8};

      & .media-wrapper {
        height: 24rem;
      }
    }

    & .detail {
      margin-top: 1.2rem;
      opacity: 0.7;
      font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      text-align: ${({ align }) => align};
    }
  }
`;
