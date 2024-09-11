import { useParams } from 'react-router-dom';
import { GoodsCsContainer } from '../containers';

const GoodCsPage = () => {
  const { goodsId } = useParams<{ goodsId: string }>();

  return <GoodsCsContainer goodsId={goodsId} />;
};

export default GoodCsPage;
