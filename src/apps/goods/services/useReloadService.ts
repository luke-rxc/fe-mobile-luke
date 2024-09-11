import { ReloadInfoType } from '../constants';

interface Props {
  onReloadWish: () => void;
  onReloadCoupon: () => void;
  onReloadNotification: () => void;
}

export const useReloadService = ({
  onReloadWish: handleReloadWish,
  onReloadCoupon: handleReloadCoupon,
  onReloadNotification: handleReloadNotification,
}: Props) => {
  // 웹뷰 내에서 로그인이 되었을때, wish list, coupon 리스트를 다시 로드하여 화면 갱신
  const handleReloadInWebview = (type: ReloadInfoType) => {
    if (type === ReloadInfoType.WISH) {
      handleReloadNotification();
      handleReloadCoupon();

      return;
    }
    if (type === ReloadInfoType.NOTIFICATION) {
      handleReloadWish();
      handleReloadCoupon();

      return;
    }
    /**
     * 쿠폰의 경우 로그인 후 쿠폰 상태도 업데이트를 시킨 후
     * coupon 리스트에서 유저가 이미 다운완료한 쿠폰 id를 제외해주기 위해
     * 쿠폰도 리로드 실행
     */
    if (type === ReloadInfoType.COUPON || type === ReloadInfoType.ALL) {
      handleReloadWish();
      handleReloadCoupon();
      handleReloadNotification();
    }
  };

  return {
    handleReloadInWebview,
  };
};
