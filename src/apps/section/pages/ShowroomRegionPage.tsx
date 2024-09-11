import { useParams } from 'react-router-dom';
import { ShowroomRegionContainer } from '../containers';

const ShowroomRegionPage = () => {
  const { sectionId: showroomId } = useParams<{ sectionId: string }>();

  return <ShowroomRegionContainer showroomId={Number(showroomId)} />;
};

export default ShowroomRegionPage;
