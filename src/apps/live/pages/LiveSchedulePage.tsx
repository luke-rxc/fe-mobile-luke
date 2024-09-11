import { useParams } from 'react-router-dom';
import { LiveScheduleContainer } from '../containers';

const LiveSchedulePage = () => {
  const { liveId } = useParams<{ liveId: string }>();
  return <LiveScheduleContainer liveId={Number(liveId)} />;
};

export default LiveSchedulePage;
