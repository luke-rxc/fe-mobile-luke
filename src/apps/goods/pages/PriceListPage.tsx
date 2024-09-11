import { useParams } from 'react-router-dom';
import { PriceListContainer } from '../containers';

const PriceListPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();
  return <PriceListContainer goodsId={+goodsId} />;
};

export default PriceListPage;
