import { forwardRef, Fragment, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { CTAButtonTopSpacingType, LayoutDirectionType, MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  CtaButtonModel,
  CtaDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getViewHeightForRatio } from '../../../utils';
import { AppearTransition } from '../AppearTransition';
import { Title, TitleProps } from '../Title';
import { CTAButton } from './CTAButton';

const CTAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as CtaDisplayModel;
  const {
    direction,
    buttonTopSpacing = CTAButtonTopSpacingType.NORMAL,
    buttonStyle,
    buttonTextAlign,
    textEffect = true,
    title,
    subTitle,
    description,
    backgroundMedia,
    align,
    buttons,
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
  const { logPresetCTAInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const [viewMinHeight, setViewMinHeight] = useState(0);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const hasTitle = title?.text || subTitle?.text || description?.text;
  const titleSectionValue: TitleProps = {
    mainTitle: title,
    subTitle,
    description,
    align,
    textEffect,
  };

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    if (backgroundMedia.type !== MediaType.IMAGE) return;

    const targetViewHeight = getViewHeightForRatio(backgroundMedia.width ?? 390, backgroundMedia.height ?? 520);
    setViewMinHeight(targetViewHeight);
  };

  useEffect(() => {
    if (inView) {
      logPresetCTAInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    handleSetViewHeight();
    window.addEventListener('resize', handleSetViewHeight);
    return () => {
      window.removeEventListener('resize', handleSetViewHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <CTAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div
            className="inner"
            style={{
              minHeight: viewMinHeight > 0 ? viewMinHeight : 'initial',
            }}
          >
            <div className="bg">
              {!errorMedia && (
                <>
                  {backgroundMedia.type === MediaType.IMAGE && (
                    <Image
                      src={getImageLink(backgroundMedia.path)}
                      blurHash={backgroundMedia.blurHash}
                      lazy
                      onError={() => setErrorMedia(true)}
                    />
                  )}
                </>
              )}
              {errorMedia && <div className="overlay-error" />}
            </div>
            <div>{hasTitle && <Title className="title-wrapper" {...titleSectionValue} />}</div>
            <div className="btn-list">
              {buttons.length > 0 && (
                <div
                  className={classNames('btn-wrapper', {
                    'is-horizontal': direction === LayoutDirectionType.HORIZONTAL,
                    'is-full': buttons.length === 1,
                    'is-sm-spacing': buttonTopSpacing !== CTAButtonTopSpacingType.NORMAL,
                  })}
                >
                  {buttons.map((button: CtaButtonModel, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Fragment key={index}>
                        <div className="btn-box">
                          <AppearTransition transition>
                            <CTAButton
                              button={button}
                              variant={buttonStyle}
                              align={buttonTextAlign}
                              presetId={presetId}
                              presetType={presetType}
                            />
                          </AppearTransition>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CTAContent>
      )}
    </div>
  );
});
const CTA = styled(CTAComponent)``;
export default CTA;
const CTAContent = styled('div').attrs((props: CtaDisplayModel) => props)`
  ${Image} {
    background: none;
  }

  > .inner {
    display: flex;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 2.4rem 4.8rem;
    background-color: ${({ backgroundInfo }) => `${backgroundInfo?.color}`};

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      img {
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

    & .title-wrapper {
      margin-top: 4.8rem;
    }

    & .btn-box {
      width: 100%;
      margin-top: 1.6rem;

      &:first-child {
        margin-top: 0;
      }
    }

    & .btn-wrapper {
      display: flex;
      flex-wrap: wrap;

      &.is-horizontal {
        .btn-box {
          width: 50%;
          margin-top: 1.6rem;

          &:nth-child(odd) {
            padding-right: 0.4rem;
          }

          &:nth-child(even) {
            padding-left: 0.4rem;
          }

          &:nth-child(1),
          :nth-child(2) {
            margin-top: 0rem;
          }
        }

        &.is-full {
          .btn-box {
            width: 100%;
            padding-right: 0;
            padding-left: 0;
          }
        }
      }
    }

    & .btn-list {
      & .btn-wrapper {
        margin-top: 4.8rem;

        &.is-sm-spacing {
          margin-top: 1.6rem;
        }
      }
    }
  }
`;
