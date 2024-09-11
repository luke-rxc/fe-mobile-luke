import { useParams } from 'react-router-dom';
import { LiveFaqContainer } from '../containers';

const LiveFaqPage = () => {
  const { liveId } = useParams<{ liveId: string }>();
  return <LiveFaqContainer liveId={Number(liveId)} />;
};

export default LiveFaqPage;
