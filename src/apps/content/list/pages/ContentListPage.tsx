import { useParams } from 'react-router-dom';
import { ContentListContainer } from '../containers';

const ContentListPage = () => {
  const { showroomId } = useParams<{ showroomId: string }>();
  return <ContentListContainer showroomId={showroomId} />;
};

export default ContentListPage;
