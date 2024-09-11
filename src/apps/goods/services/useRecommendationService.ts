import { useQuery } from '@hooks/useQuery';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link';
import { useGoodsPageInfo } from '../hooks';
import { getRecommendationList } from '../apis';
import { toRecommendationModel } from '../models';
import { FeedItemLimit, QueryKeys, RecommendationMinLimit, RecommendationType } from '../constants';

interface Props {
  enabled: boolean;
}

export const useRecommendationService = ({ enabled }: Props) => {
  const { getLink } = useLink();
  const { goodsId } = useGoodsPageInfo();

  const type = RecommendationType.RELATION;

  const sectionLink = getLink(UniversalLinkTypes.SECTION_GOODS_RECOMMENDATION, { goodsId, type });

  const { data: recommendation } = useQuery(
    [QueryKeys.RECOMMENDATION, goodsId],
    () => getRecommendationList({ goodsId, type }),
    {
      enabled,
      select: (data) => toRecommendationModel(data),
    },
  );

  return {
    isRecommendationShow: (recommendation?.source.length ?? 0) >= RecommendationMinLimit,
    recommendation,
    isAbleRecommendationPage: (recommendation?.source ?? []).length >= FeedItemLimit,
    recommendationLink: sectionLink,
  };
};
