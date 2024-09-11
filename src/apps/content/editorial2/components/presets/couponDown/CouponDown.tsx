import { forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { CouponDownType, MediaType } from '../../../constants';
import { useAnimationFrame, useIntersection } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  ContentLogInfoModel,
  CouponDownDisplayModel,
  CouponDownStyledModel,
  CouponSectionStyledModel,
  PresetComponentModel,
  PresetRefModel,
  TitleSectionStyledModel,
} from '../../../models';
import { useLogService, usePresetCouponService, usePresetViewSizeService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getEasingValue } from '../../../utils';
import { AppearTransition } from '../AppearTransition';
import { CouponCard } from '../CouponCard';
import { FakeView } from '../FakeView';

const AnimationKey = {
  INTRO_TRANSLATE_Y: 'introTranslateY',
} as const;
/**
 * 패럴럭스 애니메이션 데이터
 */
const animationData: AnimationSet[] = [
  {
    id: AnimationKey.INTRO_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.05,
        endRange: 0.25,
        startValue: 200,
        endValue: 0,
      },
    ],
  },
];

const CouponDownComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, couponList } = preset;
  const displayValues = JSON.parse(contents) as CouponDownDisplayModel;
  const {
    textEffect,
    mainTitle,
    subTitle,
    description,
    backgroundMedia,
    cards,
    isSticky: isCardSticky,
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

  const { sectionRef, sectionElRef, inView } = useIntersection({ once: false });
  const { viewRef, handleGetViewSize } = usePresetViewSizeService();
  const { logPresetCouponDownInit, logPresetCouponDownComplete } = useLogService();
  const { isIOS, isApp } = useDeviceDetect();
  const cardHeight = 144;
  const cardMargin = 24;
  const visibleCardHeight = 104;
  const tileStepValue = 12;
  const cardBlankHeight = isIOS && isApp ? `${Math.floor((window.innerHeight * 3) / 10)}px` : `30vh`;

  const couponSectionElRef = useRef<HTMLDivElement | null>(null); // 쿠폰 리스트 영역 el
  const textSectionElRef = useRef<HTMLDivElement | null>(null); // 타이틀 텍스트 영역 el
  const couponBlankRef = useRef<HTMLDivElement | null>(null); // 쿠폰 sticky를 위한 상단 공백 영역

  const handleCompleteDownload = () => {
    logPresetCouponDownComplete(contentLogInfo, { couponType: CouponDownType.DOWNLOAD });
  };

  const { displayCouponList, buttonLabel, buttonDisabled, handleClickCouponDown } = usePresetCouponService({
    couponType: CouponDownType.DOWNLOAD,
    cards,
    couponList,
    displayDateTime: contentInfo.dateTime,
    deepLink: contentInfo.deepLink,
    onCompleteDownload: handleCompleteDownload,
  });

  const isSticky = useMemo(
    () => isCardSticky && displayCouponList.length > 1,
    [displayCouponList.length, isCardSticky],
  );
  const isFirstVisibleSection = useRef<boolean>(false);

  // 스크롤 트랜지션
  const delayIntroYOffset = useRef<number>(0); // 스크롤 트랜지션 - 인트로 박스
  const [styledOptions, setStyledOptions] = useState<CouponDownStyledModel>({
    isSticky,
    textEffect,
    introTranslateY: 200,
    visibleCardHeight,
  });

  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const [isEndIntro, setIsEndIntro] = useState(false); // 인트로 박스 노출 상태

  const [titleSectionValue, setTitleSectionValue] = useState<TitleSectionStyledModel>({
    ...styledOptions,
    contentHeight: '0rem',
    textAreaHeight: '0rem',
    blankHeight: cardBlankHeight,
    marginHeight: '3.2rem', // 타이틀영역과 카드 sticky 시 여백
  });

  /**
   * 각 타일 내 포함된 쿠폰 개수
   */
  const tilesChildNum = useMemo(() => {
    const tile1Child = Math.max(displayCouponList.length - 2, 0);
    const tile2Child = displayCouponList.length > 1 ? 1 : 0;
    const tile3Child = displayCouponList.length > 0 ? 1 : 0;
    return [tile1Child, tile2Child, tile3Child];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delay = 100;
  const couponSectionRef = useCallback((el) => {
    if (!el) {
      return;
    }

    couponSectionElRef.current = el;
    setTimeout(() => {
      setTitleSectionValue((prev) => {
        return {
          ...prev,
          contentHeight: `${el.offsetHeight / 10}rem`,
        };
      });
    }, delay);
  }, []);

  const textSectionRef = useCallback((el) => {
    if (!el) {
      return;
    }

    textSectionElRef.current = el;
    setTimeout(() => {
      if (textSectionElRef.current) {
        setTitleSectionValue((prev) => {
          return {
            ...prev,
            textAreaHeight: `${el.offsetHeight / 10}rem`,
          };
        });
      }
    }, delay);
  }, []);

  const loop = (animResultValue: AnimationSetForScroll[]) => {
    if (isSticky) {
      // intro 박스 모션
      delayIntroYOffset.current = getEasingValue(
        animResultValue,
        AnimationKey.INTRO_TRANSLATE_Y,
        delayIntroYOffset.current,
      );

      // intro 박스 / 카드 리스트 영역 visible 교체
      const sectionY = sectionElRef.current?.offsetTop ?? 0;
      const couponSectionY = couponSectionElRef.current?.offsetTop ?? 0;
      const couponBlankHeight = couponBlankRef.current?.offsetHeight ?? 0;
      const [tile1Num, tile2Num, tile3Num] = tilesChildNum;
      const viewSize = handleGetViewSize();

      const cardVisibleHeight =
        (tile3Num > 0 ? visibleCardHeight : 0) +
        (tile2Num > 0 ? tileStepValue : 0) +
        (tile1Num > 0 ? tileStepValue : 0);
      const targetChangeTop = sectionY + couponSectionY - viewSize + couponBlankHeight + cardVisibleHeight;
      setIsEndIntro(window.scrollY > targetChangeTop);
    }

    setStyledOptions((prev: CouponDownStyledModel) => {
      let option = {
        ...prev,
      };

      if (isSticky) {
        option = {
          ...option,
          introTranslateY: delayIntroYOffset.current,
        };
      }

      return option;
    });
  };

  // 애니메이션 실행
  useAnimationFrame({
    sectionRef: sectionElRef,
    onRequestFrame: loop,
    animationData,
    viewRatio: 1,
    viewEndRatio: 0,
    scrollable: couponList.length > 1,
  });

  useEffect(() => {
    if (!inView) {
      // 컴포넌트 out시 모션 초기값으로 설정
      setStyledOptions((prev: CouponDownStyledModel) => {
        let option = {
          ...prev,
        };

        if (isSticky) {
          // 초기값
          delayIntroYOffset.current = 200;
          option = {
            ...option,
            introTranslateY: delayIntroYOffset.current,
          };
        }

        return option;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (!visible) return;
    if (inView && isFirstVisibleSection.current === false) {
      isFirstVisibleSection.current = true;
      logPresetCouponDownInit(contentLogInfo, { couponType: CouponDownType.DOWNLOAD });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <CouponDownContent {...displayValues}>
          <div
            ref={sectionRef}
            className={classNames('content-wrapper', {
              'is-single': !isSticky,
              'is-multiple': isSticky,
            })}
          >
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
            <div
              className={classNames('content-box', {
                'is-end-intro': isEndIntro,
              })}
            >
              <div className="text-section">
                <TitleSectionStyled className="text-box" {...{ ...titleSectionValue, ...styledOptions }}>
                  <div className="text-inner" ref={textSectionRef}>
                    {subTitle.text && (
                      <AppearTransition transition={textEffect}>
                        <p className="sub-text">{nl2br(subTitle.text)}</p>
                      </AppearTransition>
                    )}
                    {mainTitle.text && (
                      <AppearTransition transition={textEffect}>
                        <p className="main-text">{nl2br(mainTitle.text)}</p>
                      </AppearTransition>
                    )}
                    {description.text && (
                      <AppearTransition transition={textEffect}>
                        <p className="desc-text">{nl2br(description.text)}</p>
                      </AppearTransition>
                    )}
                  </div>
                </TitleSectionStyled>
              </div>
              <div>
                <FakeView ref={viewRef} />
                {isSticky && (
                  <IntroSectionStyled className="intro-section" {...styledOptions}>
                    {displayCouponList.length > 2 && (
                      <div className="tile tile1">
                        <div className="tile-inner">
                          {displayCouponList.map((item, idx, items) => {
                            if (idx < items.length - 2) {
                              return (
                                <CouponCard
                                  key={`intro-${item.couponId}`}
                                  {...item}
                                  isSticky={isSticky}
                                  tileDepth={2}
                                  visibleView={visibleCardHeight}
                                  tileStepValue={tileStepValue}
                                  intro
                                />
                              );
                            }
                            return <Fragment key={item.couponId} />;
                          })}
                        </div>
                      </div>
                    )}
                    {displayCouponList.length > 1 && (
                      <div className="tile tile2">
                        <div className="tile-inner">
                          <CouponCard
                            {...displayCouponList[displayCouponList.length - 2]}
                            tileDepth={1}
                            isSticky={isSticky}
                            visibleView={visibleCardHeight}
                            tileStepValue={tileStepValue}
                            intro
                          />
                        </div>
                      </div>
                    )}
                    <div className="tile tile3">
                      <div className="tile-inner">
                        <CouponCard
                          {...displayCouponList[displayCouponList.length - 1]}
                          isSticky={isSticky}
                          tileDepth={0}
                          visibleView={visibleCardHeight}
                          tileStepValue={tileStepValue}
                          intro
                        />
                      </div>
                    </div>
                  </IntroSectionStyled>
                )}

                <div ref={couponSectionRef}>
                  <CouponSectionStyled
                    className="coupon-section"
                    {...{ tilesChildNum, isSticky, cardHeight, cardMargin, visibleCardHeight, tileStepValue }}
                  >
                    {isSticky && (
                      <div className="coupon-intro" ref={couponBlankRef} style={{ height: cardBlankHeight }} />
                    )}
                    {displayCouponList.length > 2 && (
                      <div className="tile tile1">
                        <div className="tile-inner">
                          {displayCouponList.map((item, idx, items) => {
                            if (idx < items.length - 2) {
                              return (
                                <CouponCard
                                  key={item.couponId}
                                  {...item}
                                  isSticky={isSticky}
                                  tileDepth={isSticky ? 2 : 0}
                                  visibleView={visibleCardHeight}
                                  tileStepValue={tileStepValue}
                                />
                              );
                            }
                            return <Fragment key={item.couponId} />;
                          })}
                        </div>
                      </div>
                    )}
                    {displayCouponList.length > 1 && (
                      <div className="tile tile2">
                        <div className="tile-inner">
                          <CouponCard
                            {...displayCouponList[displayCouponList.length - 2]}
                            tileDepth={isSticky ? 1 : 0}
                            isSticky={isSticky}
                            visibleView={visibleCardHeight}
                            tileStepValue={tileStepValue}
                          />
                        </div>
                      </div>
                    )}
                    <div className="tile tile3">
                      <div className="tile-inner">
                        <AppearTransition transition={!isSticky}>
                          <CouponCard
                            {...displayCouponList[displayCouponList.length - 1]}
                            tileDepth={0}
                            isSticky={isSticky}
                            visibleView={visibleCardHeight}
                            tileStepValue={tileStepValue}
                          />
                        </AppearTransition>
                      </div>
                    </div>
                  </CouponSectionStyled>
                  <div className="button-section">
                    <AppearTransition transition>
                      <Button variant="primary" size="large" disabled={buttonDisabled} onClick={handleClickCouponDown}>
                        {buttonLabel}
                      </Button>
                    </AppearTransition>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CouponDownContent>
      )}
    </div>
  );
});
const CouponDown = styled(CouponDownComponent)``;
export default CouponDown;

const CouponDownContent = styled('div').attrs((props: CouponDownDisplayModel) => props)`
  & .content-wrapper {
    position: relative;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
  }

  .bg {
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }

    & .overlay-error {
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

  & .content-box {
    position: relative;
  }

  & .text-section {
    text-align: ${({ align }) => align};

    & .text-box {
      & .text-inner {
        padding: 4.8rem 2.4rem 0 2.4rem;
      }
    }

    & .main-text {
      color: ${({ mainTitle, theme }) => mainTitle.color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
      word-wrap: break-word;
      word-break: keep-all;
    }

    & .sub-text {
      margin-bottom: 1.2rem;
      color: ${({ subTitle, theme }) => subTitle.color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
      word-wrap: break-word;
      word-break: keep-all;
    }

    & .desc-text {
      margin-top: 2.4rem;
      color: ${({ description, theme }) => description.color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.small};
      word-wrap: break-word;
      word-break: keep-all;
    }
  }

  & .coupon-section {
    & .tile {
      display: flex;
      justify-content: center;

      & .tile-inner {
        width: 25.6rem;
      }
    }
  }

  ${Button} {
    width: 100%;
    background: ${({ button, theme }) => button.background || theme.color.brand.tint};
    color: ${({ button, theme }) => button.color || theme.color.white};
    font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};

    &:disabled {
      background: ${({ theme }) => theme.color.states.disabledBg};
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
  }

  & .is-single {
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    & .coupon-section {
      margin-top: 3.2rem;
    }

    & .button-section {
      padding: 3.2rem 2.4rem 4.8rem 2.4rem;
    }
  }

  & .is-multiple {
    .bg {
      position: sticky;
      top: 0;
      height: 100vh;
    }

    & .content-box {
      margin-top: -100vh;
    }

    & .text-section {
      position: sticky;
      top: 0;

      & .text-box {
        & .text-inner {
          padding: 10.8rem 2.4rem 0 2.4rem;
        }
      }
    }

    & .intro-section {
      display: flex;
      position: fixed;
      right: 0;
      left: 0;
      z-index: 1;
      justify-content: center;

      & .tile {
        display: flex;
        position: absolute;
        justify-content: center;
        width: 100%;

        &.tile1 {
          top: -2.4rem;
        }

        &.tile2 {
          top: -1.2rem;
        }

        &.tile3 {
          top: 0;
        }

        & .tile-inner {
          width: 25.6rem;
        }
        & ${CouponCard} {
          margin-bottom: 2.4rem;
        }
      }
    }

    & .coupon-section {
      opacity: 0;

      & .coupon-intro {
        position: relative;
      }

      & .tile {
        position: sticky;
        ${CouponCard} {
          margin-bottom: 2.4rem;
        }
      }
    }

    & .button-section {
      padding: 0.8rem 2.4rem 4.8rem 2.4rem;
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    .coupon-section {
      opacity: 0;
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    .intro-section {
      display: block;
    }

    .is-end-intro {
      .coupon-section {
        opacity: 1;
      }

      .intro-section {
        display: none;
      }
    }
  }
`;

/** 카드 등장 모션 */
const IntroSectionStyled = styled.div<CouponDownStyledModel>`
  ${({ isSticky, introTranslateY, visibleCardHeight }) => {
    if (isSticky) {
      const targetY = (introTranslateY / 10).toFixed(2);
      const targetVisibleCardHeight = visibleCardHeight / 10;
      return css`
        bottom: ${targetVisibleCardHeight}rem;
        bottom: calc(env(safe-area-inset-bottom) + ${targetVisibleCardHeight}rem);
        transform: translate3d(0rem, ${targetY}rem, 0rem);
      `;
    }
    return null;
  }}
`;

/** 타이틀 섹션 */
const TitleSectionStyled = styled.div<TitleSectionStyledModel>`
  ${({ isSticky, contentHeight, textAreaHeight, blankHeight, marginHeight }) => {
    return css`
      height: ${isSticky ? `calc(${contentHeight} - ${blankHeight} + ${textAreaHeight} + ${marginHeight})` : 'initial'};
    `;
  }}
`;

/** 카드 리스트 섹션  */
const CouponSectionStyled = styled.div<CouponSectionStyledModel>`
  ${({ tilesChildNum, isSticky, cardHeight, cardMargin, visibleCardHeight, tileStepValue }) => {
    if (isSticky) {
      const cardView = cardHeight + cardMargin;
      const cardDefaultY = cardView - visibleCardHeight;
      const tile1Height = `${
        (-1 * (cardDefaultY - tileStepValue * 2 + cardView * Math.max(tilesChildNum[0] - 1, 0))) / 10
      }rem`;
      const tile2Height = `${(-1 * (cardDefaultY - tileStepValue)) / 10}rem`;
      const tile3Height = `${(-1 * cardDefaultY) / 10}rem`;
      return css`
        & .tile1 {
          bottom: ${tile1Height};
          bottom: calc(env(safe-area-inset-bottom) + ${tile1Height});
        }

        & .tile2 {
          bottom: ${tile2Height};
          bottom: calc(env(safe-area-inset-bottom) + ${tile2Height});
        }

        & .tile3 {
          bottom: ${tile3Height};
          bottom: calc(env(safe-area-inset-bottom) + ${tile3Height});
        }
      `;
    }
    return null;
  }}
`;
