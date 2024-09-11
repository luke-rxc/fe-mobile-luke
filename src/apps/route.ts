/**
 * Default Route
 *  - Mobile Web 전용이거나, Mobile Web + Webview 혼용으로 사용하는 Route
 */
import HomeRoute from './home/routes';
import MypageRoute from './mypage/routes';
import OrderRoute from './order/routes';
import ContentRoute from './content/routes';
import ShowroomRoute from './showroom/routes';
import LiveRoute from './live/routes';
import GoodsRoute from './goods/routes';
import CsRoute from './cs/routes';
import NotificationRoute from './notification/routes';
import PolicyRoute from './policy/routes';
import ConfigRoute from './config/routes';
import MemberRoute from './member/routes';
import MainRoute from './main/routes';
import SectionRoute from './section/routes';
import ReviewRoute from './review/routes';
import SearchRoute from './search/routes';
import BridgeRoute from './bridge/routes';

/**
 * App (Webview Only) 전용 Route
 */
import GoodsAppRoute from './goods/routesApp';
import OrderAppRoute from './order/routesApp';
import MypageAppRoute from './mypage/routesApp';
import LiveAppRoute from './live/routesApp';
import MemberAppRoute from './member/routesApp';

// Default Route
const defaultRoutes = [
  ...HomeRoute,
  ...MypageRoute,
  ...OrderRoute,
  ...ContentRoute,
  ...ShowroomRoute,
  ...LiveRoute,
  ...GoodsRoute,
  ...CsRoute,
  ...NotificationRoute,
  ...PolicyRoute,
  ...ConfigRoute,
  ...MemberRoute,
  ...MainRoute,
  ...SectionRoute,
  ...ReviewRoute,
  ...SearchRoute,
  ...BridgeRoute,
];

// App (Webview Only) Route
const appRoutes = [...GoodsAppRoute, ...OrderAppRoute, ...MypageAppRoute, ...LiveAppRoute, ...MemberAppRoute];

export default [...defaultRoutes, ...appRoutes];
