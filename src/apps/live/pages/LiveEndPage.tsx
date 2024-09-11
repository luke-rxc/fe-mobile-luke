import { useParams } from 'react-router-dom';
import { LiveEndContainer } from '../containers';

const LiveEndPage = () => {
  const { liveId } = useParams<{ liveId: string }>();
  return <LiveEndContainer liveId={Number(liveId)} />;
};

export default LiveEndPage;
