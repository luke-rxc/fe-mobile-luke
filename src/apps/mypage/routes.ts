import MypageWishRoutes from './wishList/routes';
import MypageCouponRoutes from './coupon/routes';
import MypageOrderRoutes from './order/routes';
import MypageDeliveryRoutes from './manageDelivery/routes';
import MypageMangePayRoutes from './managePay/routes';
import MypagePointRoutes from './point/routes';
import MypageMainRoutes from './main/routes';
import MyPageGoodsHistoryRoutes from './goodsHistory/routes';
import MyPageContentsHistoryRoutes from './contentsHistory/routes';
import MypageProfileRoutes from './profile/routes';
import MypageSettingRoutes from './setting/routes';
import MyPageFollowingRoutes from './following/routes';

export default [
  ...MypageWishRoutes,
  ...MypageCouponRoutes,
  ...MypageOrderRoutes,
  ...MypageDeliveryRoutes,
  ...MypageMangePayRoutes,
  ...MypagePointRoutes,
  ...MypageMainRoutes,
  ...MyPageGoodsHistoryRoutes,
  ...MyPageContentsHistoryRoutes,
  ...MypageProfileRoutes,
  ...MypageSettingRoutes,
  ...MyPageFollowingRoutes,
];
