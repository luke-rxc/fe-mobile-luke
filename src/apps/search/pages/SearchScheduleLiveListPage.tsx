import { useQueryString } from '@hooks/useQueryString';
import { SearchScheduleLiveListContainer } from '../containers';

const SearchScheduleLiveListPage = () => {
  const qs = useQueryString<{ query: string }>();

  return <SearchScheduleLiveListContainer {...qs} />;
};

export default SearchScheduleLiveListPage;
