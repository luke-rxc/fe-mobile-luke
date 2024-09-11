import { useParams } from 'react-router-dom';
import { GoodsDetailContainer } from '../containers';

const GoodsDetailPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();

  return <GoodsDetailContainer goodsId={goodsId} />;
};

export default GoodsDetailPage;
