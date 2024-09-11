import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useMemo,
  useLayoutEffect,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { useIntersection } from '@hooks/useIntersection';
import { AppearType, CouponDownType, MediaType } from '../../../constants';
import { useAnimationFrame } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  CouponDownComponentRefModel,
  CouponDownProps,
  CouponDownStyledModel,
  CouponSectionStyledModel,
  TitleSectionStyledModel,
} from '../../../models';
import { usePresetCouponService, useLogService, usePresetViewSizeService } from '../../../services';
import { getEasingValue } from '../../../utils';
import { AppearBox } from '../AppearBox';
import { FakeView } from '../FakeView';
import { CouponCard } from '../CouponCard';

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

const CouponDownComponent = forwardRef<CouponDownComponentRefModel, CouponDownProps>(
  (
    {
      className,
      textEffect,
      mainTitle,
      subTitle,
      description,
      backgroundMedia,
      cards,
      isSticky: isCardSticky,
      displayDateTime,
      couponList,
      contentInfo,
      deepLink = '',
      visible,
    },
    ref,
  ) => {
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const { viewRef, handleGetViewSize } = usePresetViewSizeService();
    const { logPresetCouponDownInit, logPresetCouponDownComplete } = useLogService();
    const { isIOS, isApp } = useDeviceDetect();
    const cardHeight = 144;
    const cardMargin = 24;
    const visibleCardHeight = 104;
    const tileStepValue = 12;
    const cardBlankHeight = isIOS && isApp ? `${Math.floor((window.innerHeight * 3) / 10)}px` : `30vh`;

    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el
    const couponSectionRef = useRef<HTMLDivElement | null>(null); // 쿠폰 리스트 영역 el
    const textSectionRef = useRef<HTMLDivElement | null>(null); // 타이틀 텍스트 영역 el
    const couponBlankRef = useRef<HTMLDivElement | null>(null); // 쿠폰 sticky를 위한 상단 공백 영역

    const handleCompleteDownload = useCallback(() => {
      logPresetCouponDownComplete(contentInfo, { couponType: CouponDownType.DOWNLOAD });
    }, [contentInfo, logPresetCouponDownComplete]);

    const { displayCouponList, buttonLabel, buttonDisabled, handleClickCouponDown } = usePresetCouponService({
      couponType: CouponDownType.DOWNLOAD,
      cards,
      couponList,
      displayDateTime,
      deepLink,
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

    const loop = useCallback(
      (animResultValue: AnimationSetForScroll[]) => {
        if (isSticky) {
          // intro 박스 모션
          delayIntroYOffset.current = getEasingValue(
            animResultValue,
            AnimationKey.INTRO_TRANSLATE_Y,
            delayIntroYOffset.current,
          );

          // intro 박스 / 카드 리스트 영역 visible 교체
          const sectionY = sectionRef.current?.offsetTop ?? 0;
          const couponSectionY = couponSectionRef.current?.offsetTop ?? 0;
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
      },
      [handleGetViewSize, isSticky, tilesChildNum],
    );

    // 애니메이션 실행
    useAnimationFrame({
      sectionRef,
      onRequestFrame: loop,
      animationData,
      viewRatio: 1,
      viewEndRatio: 0,
    });

    useEffect(() => {
      if (sectionRef.current) {
        subscribe(sectionRef.current, { threshold: 0 });
      }
    }, [sectionRef, subscribe]);

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
        logPresetCouponDownInit(contentInfo, { couponType: CouponDownType.DOWNLOAD });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    useLayoutEffect(() => {
      if (couponSectionRef.current && textSectionRef.current) {
        const contentHeight = `${couponSectionRef.current.offsetHeight / 10}rem`;
        const textAreaHeight = `${textSectionRef.current.offsetHeight / 10}rem`;
        // 타이틀 영역의 sticky 처리를 위한 높이 설정
        setTitleSectionValue((prev) => {
          return {
            ...prev,
            contentHeight,
            textAreaHeight,
          };
        });
      }
    }, []);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    return (
      <div ref={containerRef} className={className}>
        {visible && (
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
                      <AppearBox appear={textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE}>
                        <p className="sub-text">{nl2br(subTitle.text)}</p>
                      </AppearBox>
                    )}
                    {mainTitle.text && (
                      <AppearBox appear={textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE}>
                        <p className="main-text">{nl2br(mainTitle.text)}</p>
                      </AppearBox>
                    )}
                    {description.text && (
                      <AppearBox appear={textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE}>
                        <p className="desc-text">{nl2br(description.text)}</p>
                      </AppearBox>
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
                        <AppearBox appear={isSticky ? AppearType.NONE : AppearType.FROM_BOTTOM}>
                          <CouponCard
                            {...displayCouponList[displayCouponList.length - 1]}
                            tileDepth={0}
                            isSticky={isSticky}
                            visibleView={visibleCardHeight}
                            tileStepValue={tileStepValue}
                          />
                        </AppearBox>
                      </div>
                    </div>
                  </CouponSectionStyled>
                  <div className="button-section">
                    <AppearBox appear={AppearType.FROM_BOTTOM}>
                      <Button variant="primary" size="large" disabled={buttonDisabled} onClick={handleClickCouponDown}>
                        {buttonLabel}
                      </Button>
                    </AppearBox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 쿠폰 컴포넌트
 */
export const CouponDown = styled(CouponDownComponent)`
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
      font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
      color: ${({ mainTitle, theme }) => mainTitle.color || theme.color.text.textPrimary};
      word-break: keep-all;
      word-wrap: break-word;
    }
    & .sub-text {
      margin-bottom: 1.2rem;
      font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
      color: ${({ subTitle, theme }) => subTitle.color || theme.color.text.textPrimary};
      word-break: keep-all;
      word-wrap: break-word;
    }

    & .desc-text {
      margin-top: 2.4rem;
      font: ${({ theme }) => theme.content.contentStyle.fontType.small};
      color: ${({ description, theme }) => description.color || theme.color.text.textPrimary};
      word-break: keep-all;
      word-wrap: break-word;
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
    font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};

    color: ${({ button, theme }) => button.color || theme.color.white};
    background: ${({ button, theme }) => button.background || theme.color.brand.tint};

    &:disabled {
      color: ${({ theme }) => theme.color.text.textDisabled};
      background: ${({ theme }) => theme.color.states.disabledBg};
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
      height: 100vh;
      position: sticky;
      top: 0;
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
      position: fixed;
      left: 0;
      right: 0;
      z-index: 1;
      display: flex;
      justify-content: center;
      & .tile {
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: center;
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

    .coupon-section {
      opacity: 0;
    }
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
        transform: translate3d(0rem, ${targetY}rem, 0rem);

        bottom: ${targetVisibleCardHeight}rem;
        bottom: calc(env(safe-area-inset-bottom) + ${targetVisibleCardHeight}rem);
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
