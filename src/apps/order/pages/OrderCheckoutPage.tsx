import { useParams } from 'react-router-dom';
import { OrderCheckoutContainer } from '../containers';

interface RouteParam {
  id: string;
}
const OrderCheckoutPage = () => {
  const { id } = useParams<RouteParam>();
  const checkoutId = Number(id);
  return <OrderCheckoutContainer checkoutId={checkoutId} />;
};

export default OrderCheckoutPage;
