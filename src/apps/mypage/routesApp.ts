import MypageDeliveryAppRoutes from './manageDelivery/routesApp';
import OrdererAuthAppRoutes from './orderer/routesApp';
import AdditionalInfoAppRoutes from './order/routesApp';

// App (Webview Only) Route
export default [...MypageDeliveryAppRoutes, ...OrdererAuthAppRoutes, ...AdditionalInfoAppRoutes];
