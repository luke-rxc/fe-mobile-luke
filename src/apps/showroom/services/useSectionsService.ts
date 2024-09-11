import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { SectionItemProps, SectionsListProps } from '../components';
import { SectionItemSchema } from '../schemas';
import { Showroom } from '../types';
import { useSectionGoodsQuery } from './queries';
import { useLogService } from './useLogService';

interface Props {
  showroomCode: string;
  showroomId: number;
  showroomName: string;
  showroomType: Showroom;
  initialData?: LoadMoreResponseSchema<SectionItemSchema>;
}

export const useSectionsService = ({ showroomCode, showroomId, showroomName, showroomType, initialData }: Props) => {
  const logger = useLogService();

  const sectionsListQuery = useSectionGoodsQuery(
    { showroomCode, showroomId },
    {
      enabled: !!showroomId && showroomType === 'CONCEPT',
      initialData,
    },
  );

  /**
   * 섹션 Impression 이벤트 핸들러
   */
  const handleVisibilitySection: SectionsListProps['onVisibility'] = (section) => {
    logger.logImpressionSection(section, showroomId, showroomName);
  };

  /**
   * 섹션 전체 보기 클릭 이벤트 핸들러
   */
  const handleClickSectionMore: SectionsListProps['onClickSectionMore'] = (section) => {
    logger.logTabSectionMore(section, showroomId, showroomName);
  };

  /**
   * 섹션 내 상품 클릭 이벤트 핸들러
   */
  const getGoodsSectionHandlers: SectionsListProps['goodsHandlers'] = (section) => (goods) => ({
    onClick: () => {
      logger.logTabSectionGoods(section, goods, showroomId, showroomName);
    },
  });

  /**
   * 섹션 헤더 클릭 이벤트 핸들러
   */
  const handleClickSectionHeader: SectionItemProps['onClickSectionHeader'] = (section, id, index, title) => {
    logger.logTabSectionHeader(section, id, index, title, showroomId, showroomName);
  };

  return {
    sections: sectionsListQuery.data && {
      sections: sectionsListQuery.data.pages,
      loading: sectionsListQuery.isFetching,
      hasMore: sectionsListQuery.hasNextPage,
      onLoadMore: sectionsListQuery.fetchNextPage,
      onVisibility: handleVisibilitySection,
      onClickSectionMore: handleClickSectionMore,
      onClickSectionHeader: handleClickSectionHeader,
      goodsHandlers: getGoodsSectionHandlers,
    },
  };
};
