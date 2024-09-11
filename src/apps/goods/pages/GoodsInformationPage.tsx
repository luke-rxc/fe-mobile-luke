import { useParams } from 'react-router-dom';
import { GoodsInformationContainer } from '../containers';

const GoodsInformationPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();

  return <GoodsInformationContainer goodsId={goodsId} />;
};

export default GoodsInformationPage;
