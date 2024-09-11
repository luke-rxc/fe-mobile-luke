import { useParams } from 'react-router-dom';
import { LiveGoodsContainer } from '../containers';

const LiveGoodsPage = () => {
  const { liveId } = useParams<{ liveId: string }>();
  return <LiveGoodsContainer liveId={Number(liveId)} />;
};

export default LiveGoodsPage;
