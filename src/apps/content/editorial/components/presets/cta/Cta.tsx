import { useEffect, useState, useRef, forwardRef, Fragment, useImperativeHandle, useCallback } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useIntersection } from '@hooks/useIntersection';
import { getImageLink } from '@utils/link';
import {
  AppearType,
  CTAButtonActionType,
  CTAButtonTopSpacingType,
  LayoutDirectionType,
  MediaType,
} from '../../../constants';
import type { CtaButtonModel, CtaComponentRefModel, CtaProps } from '../../../models';
import { useLogService } from '../../../services';
import { getViewHeightForRatio } from '../../../utils';
import { AppearBox } from '../AppearBox';
import { ImageStyled as ImageComponent } from '../Image';
import { Title, TitleProps } from '../Title';
import { CTAButton } from './CTAButton';

const CtaComponent = forwardRef<CtaComponentRefModel, CtaProps>((props, ref) => {
  const {
    className,
    direction,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buttonTopSpacing = CTAButtonTopSpacingType.NORMAL,
    buttonStyle,
    buttonTextAlign,
    textEffect = true,
    title,
    subTitle,
    description,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backgroundInfo,
    backgroundMedia,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOverlay,
    align,
    buttons,
    contentInfo,
    deepLink = '',
    visible,
  } = props;

  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);
  const hasTitle = title?.text || subTitle?.text || description?.text;
  const titleInfo: TitleProps = {
    title,
    subTitle,
    description,
    align,
    transform: textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE,
  };
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

  const { logPresetCTAInit, logPresetCTAButtonTab } = useLogService();
  const { inView, subscribe } = useIntersection(); // 뷰포트 교차
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstVisibleSection = useRef<boolean>(false);

  const handleButtonClick = useCallback(
    ({
      label,
      buttonActionType,
      btnLink,
    }: {
      label: string;
      buttonActionType: CTAButtonActionType;
      btnLink: string;
    }) => {
      logPresetCTAButtonTab({
        contentInfo,
        label,
        buttonActionType,
        btnLink,
      });
    },
    [contentInfo, logPresetCTAButtonTab],
  );

  const [viewMinHeight, setViewMinHeight] = useState(0);
  // 고정 비율시 높이 설정
  const handleSetViewHeight = useCallback(() => {
    if (backgroundMedia.type !== MediaType.IMAGE) return;

    const targetViewHeight = getViewHeightForRatio(backgroundMedia.width ?? 390, backgroundMedia.height ?? 520);
    setViewMinHeight(targetViewHeight);
  }, [backgroundMedia.height, backgroundMedia.type, backgroundMedia.width]);

  useEffect(() => {
    handleSetViewHeight();
    window.addEventListener('resize', handleSetViewHeight);
    return () => {
      window.removeEventListener('resize', handleSetViewHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    ref: containerRef.current as HTMLDivElement,
  }));
  // 뷰포트 교차
  useEffect(() => {
    if (containerRef.current) {
      subscribe(containerRef.current, { threshold: 0 });
    }
  }, [containerRef, subscribe]);
  useEffect(() => {
    if (!visible) return;
    if (inView && isFirstVisibleSection.current === false) {
      isFirstVisibleSection.current = true;
      logPresetCTAInit(contentInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={containerRef} className={className}>
      {visible && (
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
                  <ImageComponent
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

          <div>{hasTitle && <Title {...titleInfo} className="title-wrapper" />}</div>
          <div className="btn-list">
            {buttons.length > 0 && (
              <div
                className={classNames('btn-wrapper', {
                  'is-horizontal': direction === LayoutDirectionType.HORIZONTAL,
                  'is-full': buttons.length === 1,
                })}
              >
                {buttons.map((button: CtaButtonModel, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={index}>
                      <div className="btn-box">
                        <AppearBox appear="FROM_BOTTOM">
                          <CTAButton
                            button={button}
                            variant={buttonStyle}
                            align={buttonTextAlign}
                            deepLink={deepLink}
                            featureFlag={activeFeatureFlag}
                            onButtonClick={handleButtonClick}
                          />
                        </AppearBox>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * 버튼 컴포넌트
 */
export const Cta = styled(CtaComponent)`
  > .inner {
    position: relative;
    padding: 0 2.4rem 4.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    background-color: ${({ backgroundInfo }) => `${backgroundInfo.color}`};

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
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:after {
        ${({ isOverlay }) => {
          if (isOverlay) {
            return css`
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              display: block;
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
    & .btn-list {
      & .btn-wrapper {
        margin-top: ${({ buttonTopSpacing }) =>
          buttonTopSpacing === CTAButtonTopSpacingType.NORMAL ? `4.8rem` : `1.6rem`};
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
  }
`;
