import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { useErrorService } from '@features/exception/services';
import { getCouponList, postCouponDownload, postCouponDownloadList } from '../apis';
// import { goodsCouponMockApi } from '../apis/__mocks__';
import { QueryKeys } from '../constants';
import { toCouponList, CouponDownloadedModel, toMergeCouponList } from '../models';
import { useGoodsPageInfo } from '../hooks';

interface Props {
  showRoomId: number;
  isAuctionType: boolean;
  onReload: () => void;
  onLogCompleteCouponDownload: (couponRes: CouponDownloadedModel[]) => void;
}

export const useCouponService = ({
  showRoomId,
  isAuctionType,
  onReload: handleReload,
  onLogCompleteCouponDownload: handleLogCompleteCouponDownload,
}: Props) => {
  const queryClient = useQueryClient();
  const { getIsLogin } = useAuth();
  const { signIn, couponUpdated, showToastMessage } = useWebInterface();
  const { handleError } = useErrorService();
  const { goodsId } = useGoodsPageInfo();

  // coupon download 여부
  const [isUserCouponDownloaded, setIsUserCouponDownloaded] = useState<boolean>(false);
  const [couponDownloadedList, setCouponDownloadedList] = useState<CouponDownloadedModel[] | null>(null);
  const [executeDownload, setExecuteDownload] = useState<boolean>(false);

  const prevCouponIds = useRef<number[]>([]);

  /**
   * 쿠폰 리스트 로드
   */
  const {
    data: couponLists,
    isLoading: isCouponLoading,
    isFetching: isCouponFetching,
    isError: isCouponError,
    error: couponError,
  } = useQuery(
    [QueryKeys.COUPON, goodsId, showRoomId],
    () =>
      // mock
      /** goodsCouponMockApi({
        goodsId,
        showRoomId: null,
      }), */

      // api
      getCouponList({
        goodsId,
        showRoomId: showRoomId || null,
      }),
    {
      retry: 3,
      select: (data) => toCouponList(data),
      cacheTime: 0,
    },
  );

  /**
   * 단건 쿠폰 다운로드
   * @param couponId
   */
  const { mutateAsync: couponDownload } = useMutation((couponId: number) => postCouponDownload({ couponId }), {
    onSuccess: (res) => {
      const { coupon } = res;
      setCouponDownloadedList([coupon]);
      // Log
      handleLogCompleteCouponDownload([coupon] as CouponDownloadedModel[]);
      // app: 동기화 웹앱 인터페이스
      couponUpdated();
    },
    onError: (error: ErrorModel) => {
      setCouponDownloadedList([]);
      handleError({
        error,
      });
    },
    onSettled: () => {
      setIsUserCouponDownloaded(true);
    },
  });

  /**
   * 다건 쿠폰 다운로드
   * @param couponIds
   */
  const { mutateAsync: couponDownloadList } = useMutation((couponIds: number[]) => postCouponDownloadList(couponIds), {
    onSuccess: (res) => {
      const { downloadedCouponList, message } = res;
      message && showToastMessage({ message });
      setCouponDownloadedList(downloadedCouponList);
      // Log
      handleLogCompleteCouponDownload(downloadedCouponList as CouponDownloadedModel[]);
      // app: 동기화 웹앱 인터페이스
      couponUpdated();
      setIsUserCouponDownloaded(true);
    },
    onError: (error: ErrorModel) => {
      handleError({
        error,
      });
    },
  });

  /**
   * 쿠폰 다운로드 Handler
   */
  const handleCouponDownload = async () => {
    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        handleReload();
        setExecuteDownload(true);
      }
      return;
    }

    setExecuteDownload(true);
  };

  const executeCouponDownload = (couponIds: number[]) => {
    if (couponIds.length === 0) {
      return false;
    }

    return couponIds.length === 1 ? couponDownload(couponIds[0]) : couponDownloadList(couponIds);
  };

  const handleReloadCoupon = () => {
    queryClient.invalidateQueries([QueryKeys.COUPON, goodsId]);
  };

  /**
   * 비로그인 유저가 쿠폰다운 버튼을 클릭할 경우
   * 로그인 후 새로 fetching된 데이터를 가지고 download 함수를 실행하기위해서
   * 해당 쿼리가 완료된 후 실행
   */
  useEffect(() => {
    if (!isCouponFetching && executeDownload) {
      if (couponLists) {
        executeCouponDownload(couponLists.ids);
        setExecuteDownload(false);
      }

      /**
       * 비로그인시 노출되던 쿠폰이 로그인 후 받아온 쿠폰 리스트에는 없는 경우 메세지 노출
       * 비로그인시 다운로드 가능하지 않던 쿠폰도 유저가 이미 다운받은 쿠폰이라면 노출해주는 경우가 있어
       * 노출되어있던 쿠폰이 사라질 경우에만 메세지 노출하기 위해서 쿠폰 id 비교
       */
      const couponIds = couponLists?.lists.map(({ couponId }) => couponId) ?? [];
      const deletedCouponIds = prevCouponIds.current.filter((prevId) => !couponIds.some((id) => prevId === id));
      if (deletedCouponIds.length > 0) {
        showToastMessage({ message: '더 이상 다운받을 수 없는 쿠폰입니다' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCouponFetching, isCouponError, executeDownload]);

  useEffect(() => {
    if (!getIsLogin() && couponLists) {
      prevCouponIds.current = couponLists.ids;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponLists]);

  const coupon = couponLists ? toMergeCouponList(couponLists, couponDownloadedList) : null;

  return {
    /**
     * Coupon List
     */
    coupon,
    isCouponActive: !!coupon && !isAuctionType,
    isCouponLoading,
    isCouponError,
    couponError,
    handleCouponDownload,

    /**
     * Coupon Download
     */
    isUserCouponDownloaded,

    /**
     * Coupon List Reload
     */
    handleReloadCoupon,
  };
};
