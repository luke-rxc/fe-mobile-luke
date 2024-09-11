import { useParams } from 'react-router-dom';
import { useQueryString } from '@hooks/useQueryString';
import { GoodsDetailInfoContainer } from '../containers';

const GoodsDetailInfoPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();
  const { type } = useQueryString<{ type: string }>();

  return <GoodsDetailInfoContainer goodsId={goodsId} type={type} />;
};

export default GoodsDetailInfoPage;
