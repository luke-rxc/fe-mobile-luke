import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMutation } from '@hooks/useMutation';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorModel } from '@utils/api/createAxios';
import { postCouponDownload, postMultiCouponDownload } from '../apis';
import { CouponDownType } from '../constants';
import type { CardListModel, CouponCardModel, CouponModel } from '../models';

/**
 * 쿠폰 다운로드 서비스
 */
export const usePresetCouponService = ({
  couponType,
  cards,
  couponList,
  displayDateTime,
  deepLink,
  onCompleteDownload: handleCompleteDownload,
  onErrorDownload: handleErrorDownload,
}: {
  couponType: CouponDownType;
  cards: CardListModel[];
  couponList: CouponModel[];
  displayDateTime: string;
  deepLink: string;
  onCompleteDownload?: () => void;
  onErrorDownload?: (err: ErrorModel) => void;
}) => {
  const { isApp } = useDeviceDetect();
  const { openDialogToApp } = useMwebToAppDialog();
  const { getIsLogin } = useAuth();
  const { signIn, couponUpdated, showToastMessage } = useWebInterface();
  // 다운 받을수 있는 쿠폰
  const [downLoadableCouponIds, setDownLoadableCouponIds] = useState<number[]>([]);
  // 다운 받은 쿠폰
  const [downLoadedCouponIds, setDownLoadedCouponIds] = useState<number[]>(
    couponList.filter((coupon) => coupon.isDownloaded).map((coupon) => coupon.couponId),
  );
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [buttonLabel, setButtonLabel] = useState<string>('');

  /**
   * 단건 쿠폰 다운로드
   * @param couponId
   */
  const { mutateAsync: handleCouponSingleDownload, isLoading: isSingleLoading } = useMutation(
    (id: number) => postCouponDownload(id),
    {
      onSuccess: (res) => {
        const targetId = res.coupon.couponId;
        // app: 동기화 웹앱 인터페이스
        couponUpdated();
        showToastMessage(
          {
            message: '쿠폰을 다운받았습니다',
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );

        setDownLoadedCouponIds((prev) => {
          return [...prev, targetId];
        });
        handleCompleteDownload?.();
      },
      onError: (error: ErrorModel) => {
        showToastMessage(
          {
            message: error.data?.message ?? '일시적인 오류가 발생했습니다',
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
        handleErrorDownload?.(error);
      },
    },
  );

  /**
   * 다건 쿠폰 다운로드
   * @param couponIds
   */
  const { mutateAsync: handleCouponMultiDownload, isLoading: isMultiLoading } = useMutation(
    (ids: number[]) => postMultiCouponDownload(ids),
    {
      onSuccess: (res) => {
        const targetIds = res.downloadedCouponList.map((coupon) => coupon.couponId);
        // app: 동기화 웹앱 인터페이스
        couponUpdated();
        showToastMessage(
          {
            message: res.message || '쿠폰을 다운받았습니다',
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );

        setDownLoadedCouponIds((prev) => {
          return [...prev, ...targetIds];
        });
        handleCompleteDownload?.();
      },
      onError: (error: ErrorModel) => {
        showToastMessage(
          {
            message: error.data?.message ?? '일시적인 오류가 발생했습니다',
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
        handleErrorDownload?.(error);
      },
    },
  );

  const displayCouponList: CouponCardModel[] = useMemo(() => {
    return couponList.map((coupon) => {
      const { couponId, display, salePolicy, downloadPolicy, isRemaining } = coupon;
      const cardValue = cards.find((card) => card.id === couponId);
      const { costType, price, percent } = salePolicy;
      const { startDateTime, endDateTime } = downloadPolicy;
      const label = cardValue?.label ?? '';

      const isDownloaded = downLoadedCouponIds.includes(couponId);
      return {
        couponId,
        background: cardValue?.background ?? '',
        color: cardValue?.color ?? '',
        title: display.name,
        label,
        startDateTime,
        endDateTime,
        displayDateTime,
        benefitPrice: costType === 'WON' ? `${price.toLocaleString()}` : `${percent}`,
        benefitUnit: costType === 'WON' ? '원' : '%',
        downloaded: isDownloaded,
        remain: isRemaining,
      };
    });
  }, [cards, couponList, displayDateTime, downLoadedCouponIds]);

  const handleCouponDownload = useCallback(() => {
    if (downLoadableCouponIds.length > 1) {
      handleCouponMultiDownload(downLoadableCouponIds);
    } else {
      handleCouponSingleDownload(downLoadableCouponIds[0]);
    }
  }, [downLoadableCouponIds, handleCouponMultiDownload, handleCouponSingleDownload]);

  const handleClickCouponDown = useCallback(async () => {
    if (!isApp && couponType === CouponDownType.SHOWROOM) {
      openDialogToApp(deepLink, {
        actionProps: {
          kind: AppPopupActionKind.CONTENT,
        },
      });
      return;
    }

    if (isSingleLoading || isMultiLoading || !downLoadableCouponIds.length) {
      return;
    }

    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        handleCouponDownload();
      }
      return;
    }

    handleCouponDownload();
  }, [
    couponType,
    deepLink,
    downLoadableCouponIds,
    getIsLogin,
    handleCouponDownload,
    isApp,
    isMultiLoading,
    isSingleLoading,
    openDialogToApp,
    signIn,
  ]);

  useEffect(() => {
    const downloadableIds = couponList
      .filter((coupon) => {
        const isInclude = downLoadedCouponIds.includes(coupon.couponId);
        return !isInclude && coupon.isDownloadable && coupon.isRemaining;
      })
      .map((coupon) => coupon.couponId);
    setDownLoadableCouponIds(downloadableIds);
  }, [couponList, downLoadedCouponIds]);

  useEffect(() => {
    if (downLoadableCouponIds.length > 0) {
      setButtonDisabled(false);
      setButtonLabel(downLoadableCouponIds.length > 1 ? '한 번에 쿠폰 받기' : '쿠폰 받기');
    } else if (downLoadedCouponIds.length > 0 && downLoadableCouponIds.length === 0) {
      // 다운 받은 쿠폰이 있고, 다운받을수 있는 쿠폰이 없는 경우
      setButtonDisabled(true);
      setButtonLabel('쿠폰 받기 완료');
    } else {
      // 모두 다운받을수 없는 상태
      setButtonDisabled(true);
      setButtonLabel('쿠폰 준비중');
    }
  }, [downLoadableCouponIds, couponList.length, downLoadedCouponIds, downLoadedCouponIds.length]);

  return {
    displayCouponList,
    buttonLabel,
    buttonDisabled,
    handleClickCouponDown,
  };
};
