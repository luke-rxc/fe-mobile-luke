import { PrizmRegisterContainer } from '@features/prizmPay/containers';
import { useParams } from 'react-router-dom';

interface RouteParam {
  id: string;
}

const MypageUserPrizmPayUpdatePage = () => {
  const { id } = useParams<RouteParam>();

  return <PrizmRegisterContainer prizmPayId={Number(id)} />;
};

export default MypageUserPrizmPayUpdatePage;
