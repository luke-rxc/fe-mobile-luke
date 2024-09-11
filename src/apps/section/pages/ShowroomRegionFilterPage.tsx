import { useParams } from 'react-router-dom';
import { ShowroomRegionFilterContainer } from '../containers';

const ShowroomRegionFilterPage = () => {
  const { showroomId } = useParams<{ showroomId: string }>();

  return <ShowroomRegionFilterContainer showroomId={Number(showroomId)} />;
};

export default ShowroomRegionFilterPage;
