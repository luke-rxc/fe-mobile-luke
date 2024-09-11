import { useParams } from 'react-router-dom';
import { ShowroomRegionBridgeContainer } from '../containers';

const ShowroomRegionBridgePage = () => {
  const { showroomId } = useParams<{ showroomId: string }>();

  return <ShowroomRegionBridgeContainer showroomId={+showroomId} />;
};

export default ShowroomRegionBridgePage;
