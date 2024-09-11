import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LiveDetailContainer } from '../containers';
import { setScreenSize } from '../utils';

const LiveDetailPage = () => {
  useEffect(() => {
    setScreenSize();
    window.addEventListener('resize', setScreenSize);
    return () => {
      window.removeEventListener('resize', setScreenSize);
    };
  }, []);
  const { liveId } = useParams<{ liveId: string }>();
  return <LiveDetailContainer liveId={Number(liveId)} />;
};

export default LiveDetailPage;
