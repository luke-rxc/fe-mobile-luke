import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { FilterBar } from '@features/filter';
import { Spinner } from '@pui/spinner';
import { List } from '@pui/list';
import { EmptyDescription } from '../constants';
import { useDiscoverService } from '../services';
import { SectionHeader, SectionList } from '../components';

export const DiscoverContainer = styled(({ className }: { className?: string }) => {
  const {
    type,
    title,
    headers,
    data,
    error,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    getHandlers,
    fetchNextPage,

    filterList,
    sortingOptions,
    selectedFilterId,
    defaultSortingValue,
    handleChangeTabFilter,
    handleChangeTabSorting,
  } = useDiscoverService();
  const isFilterEmpty = isEmpty(data?.pages) && filterList?.length === 1;

  /**
   * header setting
   */
  useHeaderDispatch({
    type: 'mweb',
    title,
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * server error
   */
  if (isError) {
    return <PageError error={error} />;
  }

  /** Filter Empty */
  if (isFilterEmpty) {
    return <PageError defaultMessage={EmptyDescription.GOODS} />;
  }

  return (
    <div className={className}>
      {isLoading ? (
        <Spinner className="page-spinner" />
      ) : (
        <>
          {headers && <List source={headers} component={SectionHeader} />}
          {(filterList || sortingOptions) && (
            <FilterBar
              category={{
                value: selectedFilterId,
                options: filterList,
                getKey: ({ id }) => `${id}`,
                getLabel: ({ name }) => name,
                getValue: ({ id }) => id,
                onChange: (e, o, i) => handleChangeTabFilter(o, i),
              }}
              sort={{
                defaultValue: defaultSortingValue,
                options: sortingOptions,
                onChange: (e, o) => handleChangeTabSorting(o.value),
              }}
            />
          )}
          {data && (
            <SectionList
              type={type}
              title={title}
              data={data.pages || []}
              loading={isFetching}
              hasMore={hasNextPage}
              getHandlers={getHandlers}
              onLoadMore={fetchNextPage}
            />
          )}
        </>
      )}
    </div>
  );
})`
  .page-spinner {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
    ${({ theme }) => theme.mixin.centerItem()};
    width: 100vw;
    height: 100vh;
  }
`;
