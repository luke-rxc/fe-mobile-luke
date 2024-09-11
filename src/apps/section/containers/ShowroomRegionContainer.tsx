import styled from 'styled-components';
import { PageError, TemporaryError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { FilterBar } from '@features/filter';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useModal } from '@hooks/useModal';
import { GoodsList } from '@pui/goodsList';
import { rn2br } from '@utils/string';
import { SectionTitle, StayDurationDescription } from '../components';
import { ShowroomRegionMessages, CategoryFilterAll } from '../constants';
import { useRegionSearchQuery } from '../hooks';
import { useShowroomRegionService } from '../services';
import { getStayNights } from '../utils';
import { ShowroomRegionBridgeContainer } from './ShowroomRegionBridgeContainer';
import { ShowroomRegionFilterContainer } from './ShowroomRegionFilterContainer';

interface Props {
  className?: string;
  showroomId: number;
}

export const ShowroomRegionContainer = styled(({ className, showroomId }: Props) => {
  const { openModal } = useModal();
  const { updateQuery } = useRegionSearchQuery();

  const {
    query,
    filter,
    filterError,
    isFilterError,
    isFilterLoading,
    goods,
    goodsSortValue,
    goodsError,
    isGoodsError,
    isGoodsFetching,
    isGoodsLoading,
    hasMoreGoods,
    handleLoadGoods,
    logTabFixedInfo,
    logTabFilter,
    logTabSorting,
    logTabGoods,
  } = useShowroomRegionService({ showroomId });

  const { rootPlace, startDate, endDate } = query;

  useLoadingSpinner(isFilterLoading || isGoodsLoading);

  // 순환 참조에 의해 서비스 내 핸들러 포함하지 않음
  const handleOpenBridge = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    logTabFixedInfo();
    openModal(
      {
        nonModalWrapper: true,
        render: (props) => <ShowroomRegionBridgeContainer {...props} showroomId={showroomId} />,
      },
      { rootPlace, startDate, endDate },
    );
  };

  // 순환 참조에 의해 서비스 내 핸들러 포함하지 않음
  const handleOpenFilter = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    openModal(
      {
        render: (props) => <ShowroomRegionFilterContainer {...props} showroomId={showroomId} />,
      },
      { rootPlace, tagFilter: query.tagFilter },
    );
  };

  useHeaderDispatch({
    type: 'mweb',
    title: rootPlace,
    enabled: !isFilterLoading,
    quickMenus: ['cart', 'menu'],
    description: <StayDurationDescription startDate={startDate} endDate={endDate} />,
    onClickTitle: handleOpenBridge,
  });

  // 필수 파라미터 누락 오류
  if (!rootPlace) {
    return <TemporaryError />;
  }

  if (isFilterLoading) {
    return null;
  }

  if (isFilterError || isGoodsError) {
    return <PageError error={filterError || goodsError} />;
  }

  if (!filter) {
    return <TemporaryError />;
  }

  return (
    <div className={className}>
      <SectionTitle
        title={rootPlace}
        subtitle={<StayDurationDescription startDate={startDate} endDate={endDate} />}
        onClick={handleOpenBridge}
      />
      <FilterBar
        category={{
          ...filter.category,
          value: query.placeFilter || filter.category?.defaultValue,
          onChange: (e, option, index) => {
            const { value } = option as { value: string };
            logTabFilter({
              categoryName: value,
              categoryId: value,
              filterIndex: index + 1,
              regionName: rootPlace,
              searchNights: `${getStayNights(query.startDate, query.endDate)}`,
            });
            updateQuery({ placeFilter: CategoryFilterAll.value === value ? '' : value });
          },
        }}
        filter={{ selected: !!query.tagFilter?.length, onClick: handleOpenFilter }}
        sort={{
          ...filter.sort,
          value: query.sort || goodsSortValue || filter.sort?.value,
          onChange: (e, option) => {
            const { value } = option as { value: string };
            logTabSorting({
              sortedType: value,
              regionName: rootPlace,
              searchNights: `${getStayNights(query.startDate, query.endDate)}`,
            });
            updateQuery({ sort: value });
          },
        }}
      />

      {/* Goods Empty */}
      {!isGoodsLoading && !goods?.length && (
        <PageError className="empty-goods" description={rn2br(ShowroomRegionMessages.EMPTY_ROOM_DESCRIPTION)} />
      )}

      {/* Goods List */}
      {!isGoodsLoading && !!goods?.length && (
        <>
          {/* 첫번째 상품이 품절인 경우 Description */}
          {goods[0].runOut && (
            <PageError
              className="empty-runout"
              isFull={false}
              description={rn2br(ShowroomRegionMessages.EMPTY_ROOM_DESCRIPTION)}
            />
          )}

          {/* 상품 목록 */}
          <GoodsList
            className="region-goods-list"
            infiniteOptions={{ rootMargin: '50px' }}
            disabled={!hasMoreGoods}
            onScrolled={handleLoadGoods}
            loading={isGoodsFetching}
            goodsList={goods}
            onListClick={({ goodsId, goodsName }, index) => {
              logTabGoods({
                goodsId: `${goodsId}`,
                goodsName,
                goodsIndex: index + 1,
                regionName: rootPlace,
                searchNights: `${getStayNights(startDate, endDate)}`,
              });
            }}
          />
        </>
      )}
    </div>
  );
})`
  .empty-goods {
    pointer-events: none;
  }

  .empty-runout {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 18rem;
  }

  .region-goods-list {
    margin-top: ${({ theme }) => theme.spacing.s12};
  }
`;
