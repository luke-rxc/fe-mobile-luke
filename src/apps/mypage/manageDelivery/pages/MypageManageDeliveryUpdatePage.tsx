import { DeliveryRegisterContainer } from '@features/delivery/containers';
import { useParams } from 'react-router-dom';

interface RouteParams {
  id: string;
}

const MypageManageDeliveryUpdatePage = () => {
  const { id } = useParams<RouteParams>();
  return <DeliveryRegisterContainer deliveryId={Number(id)} />;
};

export default MypageManageDeliveryUpdatePage;
