import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { ErrorModel } from '@utils/api/createAxios';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { CouponDownType, FloatingStatusType, MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  CouponFollowDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useContentStoreService, useLogService, usePresetCouponService } from '../../../services';
import { useContentStore } from '../../../stores';
import { AppearTransition } from '../AppearTransition';
import { CouponCard } from '../CouponCard';

const CouponFollowComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, couponList } = preset;
  const displayValues = JSON.parse(contents) as CouponFollowDisplayModel;
  const { textEffect, mainTitle, subTitle, description, backgroundMedia, cards } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const floating = useContentStore.use.floating();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetCouponDownInit, logPresetCouponDownComplete } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const { handleUpdateFloating } = useContentStoreService();
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

  const handleCompleteDownload = () => {
    logPresetCouponDownComplete(contentLogInfo, { couponType: CouponDownType.SHOWROOM });
  };

  const handleErrorDownload = useCallback(
    (error: ErrorModel) => {
      if (error.data?.code === 'E500119') {
        if (floating === FloatingStatusType.HIDE) {
          handleUpdateFloating(FloatingStatusType.SHOW);
        } else if (floating === FloatingStatusType.SHOW) {
          handleUpdateFloating(FloatingStatusType.HIGHLIGHT);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floating],
  );

  const { displayCouponList, buttonLabel, buttonDisabled, handleClickCouponDown } = usePresetCouponService({
    couponType: CouponDownType.SHOWROOM,
    cards,
    couponList,
    displayDateTime: contentInfo.dateTime,
    deepLink: contentInfo.deepLink,
    onCompleteDownload: handleCompleteDownload,
    onErrorDownload: handleErrorDownload,
  });

  useEffect(() => {
    if (inView) {
      logPresetCouponDownInit(contentLogInfo, { couponType: CouponDownType.SHOWROOM });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <CouponFollowContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
              </div>
            )}
            <div className="coupon-wrapper">
              <div className="coupon-inner">
                {displayCouponList.map((coupon) => {
                  return (
                    <div className="coupon-box" key={`coupon-${coupon.couponId}`}>
                      <AppearTransition transition>
                        <CouponCard {...coupon} />
                      </AppearTransition>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="button-wrapper">
              <AppearTransition transition>
                <Button variant="primary" size="large" disabled={buttonDisabled} onClick={handleClickCouponDown}>
                  {buttonLabel}
                </Button>
              </AppearTransition>
            </div>
          </div>
        </CouponFollowContent>
      )}
    </div>
  );
});
const CouponFollow = styled(CouponFollowComponent)``;
export default CouponFollow;

const CouponFollowContent = styled('div').attrs((props: CouponFollowDisplayModel) => props)`
  position: relative;
  padding: 4.8rem 0;
  background-color: ${({ backgroundInfo }) => backgroundInfo.color};

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
  }

  & .text-wrapper {
    margin-bottom: 1.6rem;
    padding: 0 2.4rem 1.6rem 2.4rem;
    text-align: ${({ align }) => align};

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

  & .coupon-wrapper {
    padding-bottom: 1.6rem;

    & .coupon-inner {
      position: relative;
      width: 25.6rem;
      margin: 0 auto;
    }
  }

  & .button-wrapper {
    margin-top: 1.6rem;
    padding: 0 2.4rem;

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
  }

  & .coupon-box {
    margin-top: 0rem;
  }
`;
