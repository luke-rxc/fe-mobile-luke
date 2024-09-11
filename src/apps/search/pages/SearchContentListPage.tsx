import { useQueryString } from '@hooks/useQueryString';
import { SearchContentListContainer } from '../containers';

const SearchContentListPage = () => {
  const qs = useQueryString<{ query: string }>();

  return <SearchContentListContainer {...qs} />;
};

export default SearchContentListPage;
