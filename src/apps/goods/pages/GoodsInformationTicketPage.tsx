import { useParams } from 'react-router-dom';
import { GoodsInformationContainer } from '../containers';

const GoodsInformationTicketPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();

  return <GoodsInformationContainer goodsId={goodsId} />;
};

export default GoodsInformationTicketPage;
