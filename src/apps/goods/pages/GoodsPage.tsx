import { useGoodsPageInfo } from '../hooks';
import { GoodsContainer } from '../containers';
import { GoodsError } from '../components';

const GoodsPage = () => {
  const { goodsId } = useGoodsPageInfo();

  if (!goodsId) {
    return <GoodsError defaultMessage="상품을 찾을 수 없습니다" />;
  }

  return <GoodsContainer />;
};

export default GoodsPage;
