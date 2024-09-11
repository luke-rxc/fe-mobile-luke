import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { useEffect, useMemo, useRef, useState } from 'react';
import { downloadCoupon, getLiveCouponList } from '../apis';
import { CouponDownloadModel, toCouponDownloadListModel } from '../models';
import { LogLiveCompleteCouponDownloadParams, LogLiveImpressionCouponParams } from './useLogService';
import { CouponDownloadResponse } from '../schemas';

export type ReturnTypeUseLiveCouponService = ReturnType<typeof useLiveCouponService>;

interface Props {
  enabled?: boolean;
  liveId: number;
  isOpenedGoodsDrawer: boolean;
  hasDownloadableCoupon: boolean;
  isLogin: boolean;
  viewType?: 'live' | 'liveEnd';
  handleLogin: () => Promise<boolean>;
  handleLogLiveImpressionCoupon: (params: LogLiveImpressionCouponParams) => void;
  handleLogLiveTabCouponDownload: () => void;
  handleLogLiveCompleteCouponDownload: (params: LogLiveCompleteCouponDownloadParams) => void;
}

const debug = createDebug();

export const useLiveCouponService = ({
  enabled = true,
  liveId,
  isOpenedGoodsDrawer,
  hasDownloadableCoupon,
  isLogin,
  viewType = 'live',
  handleLogin,
  handleLogLiveImpressionCoupon,
  handleLogLiveTabCouponDownload,
  handleLogLiveCompleteCouponDownload,
}: Props) => {
  const { showToastMessage } = useWebInterface();
  const [couponList, setCouponList] = useState<Array<CouponDownloadModel>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const prevIsOpenedGoodsDrawer = useRef(isOpenedGoodsDrawer);

  const { mutateAsync: requestCouponList } = useMutation(getLiveCouponList);

  useEffect(() => {
    const updateCouponList = async () => {
      const response = await requestCouponList(liveId);
      setCouponList(toCouponDownloadListModel(response));
    };

    const loadCouponList = async () => {
      setLoading(true);
      await updateCouponList();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    if (!enabled) {
      return;
    }

    if (viewType === 'liveEnd') {
      if (prevIsOpenedGoodsDrawer.current) {
        return;
      }
      loadCouponList();

      prevIsOpenedGoodsDrawer.current = true;
      return;
    }

    // isOpenedGoodsDrawer가 false에서 true로 변경될 때만 실행
    if (prevIsOpenedGoodsDrawer.current === false && isOpenedGoodsDrawer === true && hasDownloadableCoupon) {
      loadCouponList();
    }

    // isOpenedGoodsDrawer가 false일 때 쿠폰 리스트 초기화
    if (!isOpenedGoodsDrawer) {
      setTimeout(() => {
        setCouponList([]);
      }, 300);
    }

    // 이전 상태 업데이트
    prevIsOpenedGoodsDrawer.current = isOpenedGoodsDrawer;
  }, [enabled, viewType, isOpenedGoodsDrawer, hasDownloadableCoupon, liveId, requestCouponList]);

  const { mutateAsync: requestDownloadCoupon } = useMutation(downloadCoupon, {
    onError: (error) => {
      showToastMessage({ message: error.data?.message || '쿠폰을 받지 못했습니다' });
    },
  });

  const couponLabel = useMemo(() => {
    if (!couponList || couponList.length === 0) {
      return null;
    }
    const couponCount = couponList.length;
    const downloadedCouponCount = couponList.filter((coupon) => coupon.isDownloaded).length;

    if (couponCount === downloadedCouponCount) {
      return '쿠폰 받기 완료';
    }

    return couponCount > 1 ? '한 번에 쿠폰 받기' : '쿠폰 받기';
  }, [couponList]);

  /**
   * 쿠폰 리스트 갱신
   *
   * 리스트 조회후 기존에 있던 쿠폰만 갱신 처리
   * @param allCouponIds 기존 쿠폰 id 리스트
   */
  const handleUpdateCouponList = async (allCouponIds: Array<number>) => {
    try {
      const couponListResponse = await requestCouponList(liveId);
      const updateCouponList = toCouponDownloadListModel(couponListResponse);
      const filteredCouponList = allCouponIds.reduce((target, id) => {
        const item = updateCouponList.find((couponItem) => couponItem.couponId === id);
        if (item) {
          target.push(item);
        }
        return target;
      }, [] as Array<CouponDownloadModel>);
      setCouponList(filteredCouponList);

      debug.log('handleClickDownloadCoupon', {
        allCouponIds,
        filteredCouponList,
      });
    } catch (error) {
      debug.error(error);
    }
  };

  /**
   * 쿠폰 다운로드 완료 log 처리
   */
  const handleLogCompleteCoupon = (downloadedCouponList: Array<CouponDownloadResponse>) => {
    if ((downloadedCouponList || []).length === 0) {
      return;
    }

    const parameters: LogLiveCompleteCouponDownloadParams = downloadedCouponList.reduce(
      (target, coupon) => {
        target.couponId.push(coupon.couponId);
        target.couponName.push(coupon.display.name);
        target.couponType.push(coupon.issueType);

        return {
          ...target,
          couponCount: target.couponCount + 1,
        };
      },
      { couponId: [], couponName: [], couponType: [], couponCount: 0 } as LogLiveCompleteCouponDownloadParams,
    );

    handleLogLiveCompleteCouponDownload(parameters);
  };

  /**
   * 쿠폰 다운로드 click
   */
  const handleClickDownloadCoupon = async () => {
    if (!couponList || couponList.length === 0) {
      return;
    }

    handleLogLiveTabCouponDownload();

    const allCouponIds: Array<number> = couponList.map((coupon) => coupon.couponId);

    if (!isLogin) {
      // 미로그인시 로그인 처리 후 쿠폰 리스트 갱신
      await handleLogin();
      await handleUpdateCouponList(allCouponIds);
      return;
    }

    /* couponIds 필터링된 coupon ids (완료된 쿠폰, 소진된 쿠폰) */
    const couponIds = couponList
      .filter((coupon) => !coupon.isDownloaded && coupon.isRemaining)
      .map((coupon) => coupon.couponId);
    const { message, downloadedCouponList } = await requestDownloadCoupon(couponIds);

    handleLogCompleteCoupon(downloadedCouponList);
    handleUpdateCouponList(allCouponIds);

    if (message) {
      showToastMessage({ message });
      return;
    }

    showToastMessage({ message: '모든 쿠폰을 다운받았습니다' });
  };

  const handleImpressionCoupon = () => {
    if (!couponList || couponList.length === 0) {
      return;
    }

    const parameters: LogLiveImpressionCouponParams = couponList.reduce(
      (target, coupon) => {
        target.couponId.push(coupon.couponId);
        target.couponName.push(coupon.display.name);
        target.couponType.push(coupon.issueType);

        return {
          ...target,
          couponCount: target.couponCount + 1,
        };
      },
      { couponId: [], couponName: [], couponType: [], couponCount: 0 } as LogLiveImpressionCouponParams,
    );
    handleLogLiveImpressionCoupon(parameters);
  };

  return {
    couponList: couponList || [],
    isFetching: hasDownloadableCoupon ? loading : false,
    downloadableCouponCount: (couponList || []).filter((coupon) => !coupon.isDownloaded && coupon.isRemaining).length,
    couponLabel,
    isOpen: isOpenedGoodsDrawer,
    handleClickDownloadCoupon,
    handleImpressionCoupon,
  };
};
