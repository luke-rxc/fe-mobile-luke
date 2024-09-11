import { forwardRef, useRef, useImperativeHandle, useState, useEffect, useCallback, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { ErrorModel } from '@utils/api/createAxios';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { useIntersection } from '@hooks/useIntersection';
import { AppearType, CouponDownType, MediaType } from '../../../constants';
import { PresetContext } from '../../../context';
import type { CouponFollowComponentRefModel, CouponFollowProps } from '../../../models';
import { usePresetCouponService, useLogService } from '../../../services';
import { AppearBox } from '../AppearBox';
import { CouponCard } from '../CouponCard';

const CouponFollowComponent = forwardRef<CouponFollowComponentRefModel, CouponFollowProps>(
  (
    {
      className,
      textEffect,
      mainTitle,
      subTitle,
      description,
      backgroundMedia,
      cards,
      displayDateTime,
      couponList,
      contentInfo,
      deepLink = '',
      visible,
    },
    ref,
  ) => {
    const { showFollowSnackBar } = useContext(PresetContext);
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const { logPresetCouponDownInit, logPresetCouponDownComplete } = useLogService();

    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el

    const handleCompleteDownload = useCallback(() => {
      logPresetCouponDownComplete(contentInfo, { couponType: CouponDownType.SHOWROOM });
    }, [contentInfo, logPresetCouponDownComplete]);

    const handleErrorDownload = useCallback(
      (error: ErrorModel) => {
        if (error.data?.code === 'E500119') {
          showFollowSnackBar();
        }
      },
      [showFollowSnackBar],
    );

    const { displayCouponList, buttonLabel, buttonDisabled, handleClickCouponDown } = usePresetCouponService({
      couponType: CouponDownType.SHOWROOM,
      cards,
      couponList,
      displayDateTime,
      deepLink,
      onCompleteDownload: handleCompleteDownload,
      onErrorDownload: handleErrorDownload,
    });

    const isFirstVisibleSection = useRef<boolean>(false);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

    useEffect(() => {
      if (sectionRef.current) {
        subscribe(sectionRef.current, { threshold: 0 });
      }
    }, [sectionRef, subscribe]);

    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetCouponDownInit(contentInfo, { couponType: CouponDownType.SHOWROOM });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div ref={sectionRef} className="content-wrapper">
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
              {(subTitle.text || mainTitle.text || description.text) && (
                <div className="text-wrapper">
                  <div className="text-inner">
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
                </div>
              )}
              <div className="coupon-wrapper">
                <div className="coupon-inner">
                  {displayCouponList.map((coupon) => {
                    return (
                      <div className="coupon-box" key={`coupon-${coupon.couponId}`}>
                        <AppearBox appear={AppearType.FROM_BOTTOM}>
                          <CouponCard {...coupon} />
                        </AppearBox>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="button-wrapper">
                <AppearBox appear={AppearType.FROM_BOTTOM}>
                  <Button variant="primary" size="large" disabled={buttonDisabled} onClick={handleClickCouponDown}>
                    {buttonLabel}
                  </Button>
                </AppearBox>
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
export const CouponFollow = styled(CouponFollowComponent)`
  & .content-wrapper {
    position: relative;
    padding: 4.8rem 0;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
  }
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
  & .contents {
    position: relative;
  }

  & .text-wrapper {
    padding: 0 2.4rem 1.6rem 2.4rem;
    margin-bottom: 1.6rem;
    text-align: ${({ align }) => align};
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

  & .coupon-wrapper {
    padding-bottom: 1.6rem;
    & .coupon-inner {
      position: relative;
      width: 25.6rem;
      margin: 0 auto;
    }
  }

  & .button-wrapper {
    padding: 0 2.4rem;
  }

  & .button-wrapper {
    padding: 0 2.4rem;
    margin-top: 1.6rem;

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
  }

  & .coupon-box {
    margin-top: 1.6rem;
    &:first-child {
      margin-top: 0rem;
    }
  }
`;
