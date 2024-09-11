import { useQueryString } from '@hooks/useQueryString';
import { SearchShowroomListContainer } from '../containers';

const SearchShowroomListPage = () => {
  const qs = useQueryString<{ query: string }>();

  return <SearchShowroomListContainer {...qs} />;
};

export default SearchShowroomListPage;
