import { forwardRef, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { AlignType, MediaType, TypoItemSizeType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  BenefitGoodsADisplayModel,
  ContentLogInfoModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';

const BenefitGoodsAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as BenefitGoodsADisplayModel;
  const {
    backgroundMedia,
    headerTitle,
    headerSubText = [],
    align,
    headerDetail,
    useDetailBox,
    detailBoxTitle,
    detailBoxDescription = [],
  } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetBenefitGoodsInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

  useEffect(() => {
    if (inView) {
      logPresetBenefitGoodsInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <BenefitGoodsAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
            <div className="header">
              <p
                className={classNames('title', {
                  'is-title2': headerTitle.sizeType === TypoItemSizeType.TITLE2,
                  'is-title': headerTitle.sizeType === TypoItemSizeType.TITLE,
                })}
              >
                {nl2br(headerTitle.text)}
              </p>
              {headerSubText.length && (
                <ul className="sub-text-box">
                  {headerSubText.map((value, index) => {
                    const { subTitle, description } = value;
                    return (
                      <li
                        className={classNames('sub-text', {
                          'is-left': align === AlignType.LEFT,
                          'is-center': align === AlignType.CENTER,
                        })}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                      >
                        <span className="sub-title">{subTitle.text}</span>
                        <span className="desc">{description.text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {headerDetail.text && <p className="detail">{nl2br(headerDetail.text)}</p>}
            </div>
            {useDetailBox && (
              <div className="detail-box">
                <div className="detail-header">{detailBoxTitle.text}</div>
                {detailBoxDescription.length && (
                  <ul className="detail-desc-box">
                    {detailBoxDescription.map((desc, index) => {
                      if (!desc.text) return <></>;
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <li className="desc" key={index}>
                          {desc.text}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </BenefitGoodsAContent>
      )}
    </div>
  );
});
const BenefitGoodsA = styled(BenefitGoodsAComponent)``;
export default BenefitGoodsA;

const BenefitGoodsAContent = styled('div').attrs((props: BenefitGoodsADisplayModel) => props)`
  position: relative;
  padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 4.8 : 0}rem`};
  padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 4.8 : 0}rem`};
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

    & .detail-box {
      margin-top: 2.4rem;

      & .detail-header {
        position: relative;
        padding: 0.8rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.miniB};
        text-align: center;
        word-wrap: break-word;
        word-break: keep-all;

        &::before {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-top-left-radius: ${({ theme }) => theme.radius.r6};
          border-top-right-radius: ${({ theme }) => theme.radius.r6};
          background-color: ${({ textColor, theme }) => textColor || theme.color.blackLight};
          opacity: 0.1;
          content: '';
        }
      }

      & .detail-desc-box {
        position: relative;
        padding: 1.2rem 1.6rem;

        &::before {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-bottom-right-radius: ${({ theme }) => theme.radius.r6};
          border-bottom-left-radius: ${({ theme }) => theme.radius.r6};
          background-color: ${({ textColor, theme }) => textColor || theme.color.blackLight};
          opacity: 0.03;
          content: '';
        }

        & .desc {
          position: relative;
          padding: 0.4rem 0rem 0.4rem 0.9rem;
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
          word-wrap: break-word;
          word-break: keep-all;

          &::before {
            display: block;
            position: absolute;
            top: 0.3rem;
            left: 0.2rem;
            content: '∙';
          }
        }
      }
    }

    & .header {
      & .title {
        text-align: ${({ align }) => align};

        &.is-title2 {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title2B};
        }

        &.is-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
        }
      }

      & .sub-text-box {
        margin-top: 1.6rem;

        & .sub-text {
          margin-top: 0.8rem;
          word-wrap: break-word;
          word-break: keep-all;

          &:first-child {
            margin-top: 0;
          }

          & .sub-title {
            display: inline-block;
            width: 8rem;
            font: ${({ theme }) => theme.content.contentStyle.fontType.miniB};
          }

          & .desc {
            margin-left: 0.8rem;
            font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
          }

          &.is-left {
            display: flex;

            & .sub-title {
              flex-shrink: 0;
            }

            & .desc {
              overflow: hidden;
              flex-grow: 1;
            }
          }

          &.is-center {
            display: flex;
            justify-content: center;

            & .sub-title {
              width: initial;
              max-width: 8rem;
              vertical-align: top;
            }

            & .desc {
              display: inline-block;
              max-width: 18.4rem;
              vertical-align: top;
            }
          }
        }
      }

      & .detail {
        margin-top: 0.8rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
        text-align: ${({ align }) => align};
      }
    }
  }
`;
