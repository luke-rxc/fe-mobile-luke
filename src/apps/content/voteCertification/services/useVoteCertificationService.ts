import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { getBenefitVote, getVoteCertification } from '../apis';
import { toVoteCertificationModel } from '../models';

/**
 * 투표 인증뷰 조회
 */
export const useVoteCertificationService = ({
  voteId,
}: {
  voteId: number;
  contentType: string;
  contentCode: string;
}) => {
  const { data, isError, isFetching, isLoading, error } = useQuery(
    ['ContentVote', voteId],
    () => {
      return getVoteCertification(voteId);
    },
    {
      select: toVoteCertificationModel,
      cacheTime: 0,
    },
  );

  const { mutateAsync: handleGetBenefit } = useMutation(() => getBenefitVote(voteId), {
    onSuccess: () => {},
    onError: () => {},
  });

  return {
    voteData: data,
    error,
    isError: isError || data?.voteList.length === 0,
    isLoading: isFetching || isLoading,
    handleGetBenefit,
  };
};
