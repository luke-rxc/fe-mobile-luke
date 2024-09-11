import { createDebug } from '@utils/debug';
import { create } from 'zustand';

type CouponStatus = 'show' | 'show-again' | 'hide' | 'opacity-hide' | '';

const debug = createDebug();

interface PurchaseVerificationState {
  /* 다운로드 가능 쿠폰 유무 */
  hasDownloadableCoupon: boolean;
  /* 쿠폰 인디케이터 노출 여부 */
  showCouponIndicator: boolean;
  /* 다운로드 가능 쿠폰 상태 */
  downloadableCouponStatus: CouponStatus;
  /* 다운로드 가능 쿠폰 상태 초기화 */
  initializeDownloadableCouponStatus: () => void;
  /* 쿠폰 인디케이터 노출 여부 업데이트 */
  updateShowCouponIndicator: (show: boolean) => void;
  /* 다운로드 가능 쿠폰 상태 업데이트 */
  updateDownloadableCouponStatus: (downloadable: boolean, initialize?: boolean) => void;
}

/**
 * 라이브 쿠폰 인디케이터 store
 */
export const useLiveCouponIndicatorStore = create<PurchaseVerificationState>((set) => ({
  hasDownloadableCoupon: false,
  showCouponIndicator: false,
  downloadableCouponStatus: '',

  initializeDownloadableCouponStatus: () =>
    set((state) => {
      debug.log('updateShowCouponIndicator::', {
        ...state,
        downloadableCouponStatus: state.downloadableCouponStatus ? 'show-again' : '',
      });
      return {
        downloadableCouponStatus: state.downloadableCouponStatus ? 'show-again' : '',
      };
    }),

  updateShowCouponIndicator: (show: boolean) =>
    set((state) => {
      const getStatus = ({ downloadableCouponStatus }: PurchaseVerificationState, isShow: boolean): CouponStatus => {
        if (isShow) {
          return downloadableCouponStatus;
        }

        switch (downloadableCouponStatus) {
          case 'show':
          case 'show-again':
            return 'opacity-hide';

          case 'opacity-hide':
          case 'hide':
            return '';

          default:
            return '';
        }
      };

      debug.log('updateShowCouponIndicator::', {
        ...state,
        showCouponIndicator: show,
        downloadableCouponStatus: getStatus(state, show),
      });
      return {
        showCouponIndicator: show,
        downloadableCouponStatus: getStatus(state, show),
      };
    }),

  updateDownloadableCouponStatus: (downloadable: boolean, initialize = false) =>
    set((state) => {
      const getStatus = (
        { showCouponIndicator, hasDownloadableCoupon }: PurchaseVerificationState,
        isInitialize: boolean,
      ) => {
        if (!hasDownloadableCoupon) {
          return '';
        }

        if (isInitialize) {
          return '';
        }

        // showCouponIndicator true일 경우 숨기는 애니메이션이면 hide, 사라지는 애니메이션이면 opacity-hide
        return showCouponIndicator ? 'opacity-hide' : '';
      };
      debug.log('updateDownloadableCouponStatus::', {
        ...state,
        downloadableCouponStatus: downloadable ? 'show' : getStatus(state, initialize),
        hasDownloadableCoupon: downloadable,
      });
      return {
        downloadableCouponStatus: downloadable ? 'show' : getStatus(state, initialize),
        hasDownloadableCoupon: downloadable,
      };
    }),
}));
