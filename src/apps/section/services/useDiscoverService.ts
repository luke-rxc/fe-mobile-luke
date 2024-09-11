import qs from 'qs';
import { createElement, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { createDebug } from '@utils/debug';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useQueryString } from '@hooks/useQueryString';
import { useModal } from '@hooks/useModal';
import { useLink } from '@hooks/useLink';
import { TeaserModalContainer as teaserModal } from '@features/schedule/containers';
import { useUpdateBrandFollow } from '@features/showroom/hooks';
import { useUpdateLiveFollow } from '@features/live/hooks';
import { TabsProps } from '@pui/tabs';
import { DiscoverQueryKeys, SectionTypes } from '../constants';
import { SectionType } from '../types';
import { useSection } from '../hooks';
import {
  SectionLiveListModel,
  SectionGoodsListModel,
  SectionContentListModel,
  SectionShowroomListModel,
  toFilterModel,
} from '../models';
import { FilterSchema } from '../schemas';
import { getDiscoverFilterList } from '../apis';
import { useSectionContentLog, useSectionGoodsLog, useSectionLiveLog, useSectionShowroomLog } from './logs';
import { useSectionContentQuery, useSectionGoodsQuery, useSectionLiveQuery, useSectionShowroomQuery } from './discover';

export type GetHandlers = {
  [SectionTypes.LIVE]?: SectionLiveListModel['getHandlers'];
  [SectionTypes.GOODS]?: SectionGoodsListModel['getHandlers'];
  [SectionTypes.CONTENT]?: SectionContentListModel['getHandlers'];
  [SectionTypes.SHOWROOM]?: SectionShowroomListModel['getHandlers'];
};

const debug = createDebug();

export const useDiscoverService = () => {
  const { categoryFilter, sort } = useQueryString<{ categoryFilter: string; sort: string }>();
  const { pathname } = useLocation();
  const history = useHistory();

  const { isApp } = useDeviceDetect();
  const { toLink } = useLink();
  const { openModal } = useModal();

  const [filterId, setFilterId] = useState<number>(categoryFilter ? +categoryFilter : 0);

  const { sectionId, activeSection, isActiveSection } = useSection();
  const { onChangeLiveFollow } = useUpdateLiveFollow();
  const { onChangeBrandFollow } = useUpdateBrandFollow();

  const logger = {
    [SectionTypes.LIVE]: useSectionLiveLog(debug),
    [SectionTypes.GOODS]: useSectionGoodsLog(debug),
    [SectionTypes.CONTENT]: useSectionContentLog(debug),
    [SectionTypes.SHOWROOM]: useSectionShowroomLog(debug),
  };

  const queries = {
    [SectionTypes.LIVE]: useSectionLiveQuery(
      { sectionId: +sectionId },
      {
        enabled: isActiveSection(SectionTypes.LIVE),
        onSuccess: (data, latestData) => {
          logger[SectionTypes.LIVE].logLiveListImpressionThumbnail(latestData);
        },
      },
    ),
    [SectionTypes.GOODS]: useSectionGoodsQuery(
      { sectionId: +sectionId, categoryFilter: filterId, sort },
      {
        enabled: isActiveSection(SectionTypes.GOODS),
        keepPreviousData: filterId === 0 || !!filterId,
        onSuccess: (data, latestData, metaData) => {
          logger[SectionTypes.GOODS].logSectionGoodsImpression({ ...metaData, list: latestData });
        },
      },
    ),
    [SectionTypes.CONTENT]: useSectionContentQuery(
      { sectionId: +sectionId },
      {
        enabled: isActiveSection(SectionTypes.CONTENT),
        onSuccess: (data, latestData) => {
          logger[SectionTypes.CONTENT].logContentListImpression(latestData);
        },
      },
    ),
    [SectionTypes.SHOWROOM]: useSectionShowroomQuery(
      { sectionId: +sectionId },
      {
        enabled: isActiveSection(SectionTypes.SHOWROOM),
        onSuccess: (data, latestData) => {
          logger[SectionTypes.SHOWROOM].logShowroomListImpressionShowroom(latestData);
          logger[SectionTypes.SHOWROOM].logShowroomListImpressionGoods(latestData);
        },
      },
    ),
  };

  /**
   * 섹션별 리스트 아이템에 전달될 이벤트 핸들러를 생성
   */
  const getHandlers: GetHandlers = {
    [SectionTypes.GOODS]: {
      onListClick: (goods) => {
        logger[SectionTypes.GOODS].logSectionGoodsTab({
          ...(queries[SectionTypes.GOODS]?.metaData || {}),
          item: goods,
        });
      },
    },

    [SectionTypes.LIVE]: (source) => ({
      onClickLink: (e, item) => {
        const { onAir, scheduleId, landingType } = item;

        logger[SectionTypes.LIVE].logLiveListTabThumbnail(source);

        if (!isApp && !onAir && scheduleId && landingType === 'SCHEDULE_TEASER') {
          e.preventDefault();
          openModal({
            nonModalWrapper: true,
            render: (props) => createElement(teaserModal, { scheduleId: +scheduleId, ...props }),
          });
        }
      },
      onClickFollow: (follow, { liveId }) => {
        liveId &&
          onChangeLiveFollow({ liveId, state: !follow }, { onSuccess: () => queries[SectionTypes.LIVE].refetch() });
      },
    }),

    [SectionTypes.SHOWROOM]: (source) => ({
      onClickFollow: ({ id, code, name, follow }) => {
        const newFollowState = !follow;
        onChangeBrandFollow(
          { id, code, name, state: newFollowState },
          { onSuccess: () => queries[SectionTypes.SHOWROOM].refetch() },
        );
      },
      onClickLiveLink: () => {
        logger[SectionTypes.SHOWROOM].logShowroomListTabShowroom(source);
      },
      onClickShowroomLink: () => {
        logger[SectionTypes.SHOWROOM].logShowroomListTabShowroom(source);
      },
      onClickGoodsList: (event, goods) => {
        logger[SectionTypes.SHOWROOM].logShowroomListTabGoods(goods);
      },
    }),

    [SectionTypes.CONTENT]: (source) => ({
      onClick: () => {
        logger[SectionTypes.CONTENT].logContentListTabContent(source);
      },
    }),
  };

  /**
   * 상품 섹션 > 상품 Filter 조회 Query
   */
  const sectionFilterQuery = useQuery(
    DiscoverQueryKeys.sectionFilter(+sectionId, SectionTypes.GOODS),
    () => getDiscoverFilterList({ sectionId: +sectionId, sectionType: 'goods' }),
    {
      select: toFilterModel,
      cacheTime: 0,
      staleTime: Infinity,
      enabled: activeSection === SectionTypes.GOODS,
    },
  );

  /**
   * 카테고리 필터 반환
   *
   * 카테고리 필터가 2개 이상인 경우 카테고리 필터 노출(이때 전체 항목 추가)
   */
  const getSectionFilter = () => {
    if (sectionFilterQuery.data?.categoryFilter && sectionFilterQuery.data?.categoryFilter.length > 1) {
      return [{ name: '전체', id: 0 }].concat(sectionFilterQuery.data.categoryFilter);
    }

    return undefined;
  };

  /**
   * 탭 클릭 이벤트 핸들러
   */
  const handleChangeTab = (_: unknown, { value }: { value: SectionType }) => {
    // 현재(변경전) 섹션의 데이터 삭제
    value !== activeSection && queries[activeSection].remove();
    // 변경된 탭에 해당하는 섹션페이지로 이동
    toLink(getWebLink(WebLinkTypes.SECTION_DISCOVER, { sectionId }, { query: { active: value.toLowerCase() } }));
  };

  /**
   * 상품 Filter 클릭 이벤트 핸들러
   */
  const handleChangeTabFilter = (data: ArrayElement<FilterSchema['categoryFilter']>, index: number) => {
    const { id, name } = data;
    setFilterId(id);
    logger[SectionTypes.GOODS].logSectionGoodsFilterTab({
      ...(queries[SectionTypes.GOODS]?.metaData || {}),
      item: { id, name, index: index + 1 },
    });
    history.replace([pathname, qs.stringify({ categoryFilter: id, sort })].join('?'));
  };

  /**
   * 상품 Sorting 변경 이벤트 핸들러
   */
  const handleChangeTabSorting = (value: string) => {
    logger[SectionTypes.GOODS].logSectionGoodsSortingTab({
      ...(queries[SectionTypes.GOODS]?.metaData || {}),
      sortType: value,
    });
    history.replace([pathname, qs.stringify({ categoryFilter, sort: value })].join('?'));
  };

  /**
   * page 진입시 이벤트로깅 호출
   */
  useEffect(() => {
    const metaData = queries[activeSection]?.metaData;

    if (sectionId && metaData) {
      logger[activeSection].logViewPage(metaData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, sectionId, queries[activeSection]?.metaData]);

  return {
    ...queries[activeSection],
    type: activeSection,
    getHandlers: getHandlers[activeSection],
    handleChangeTab,

    /** Filter & Sorting */
    filterList: getSectionFilter(),
    sortingOptions: sectionFilterQuery.data && sectionFilterQuery.data.sort,
    selectedFilterId: filterId,
    defaultSortingValue: queries[SectionTypes.GOODS].sort,
    handleChangeTabFilter,
    handleChangeTabSorting,
  };
};
