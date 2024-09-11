import { useParams } from 'react-router-dom';
import { OrderBidCheckoutContainer } from '../containers/OrderBidCheckoutContainer';

interface RouteParam {
  id: string;
}

const OrderBidCheckoutPage = () => {
  const { id } = useParams<RouteParam>();
  const auctionId = Number(id);
  return <OrderBidCheckoutContainer auctionId={auctionId} />;
};

export default OrderBidCheckoutPage;
