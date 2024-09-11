import { PageError } from '@features/exception/components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { AuthContainerWrapperStyled, AuthEditComplete, AuthInfoView } from '../components';
import { useLiveAuthAuctionEditService } from '../services';

export const LiveAuthAuctionEditContainer = () => {
  const { isLoading, isError, actions, ...liveAuthAuctionEditProps } = useLiveAuthAuctionEditService();

  const loading = useLoadingSpinner(isLoading);

  if (loading) {
    return null;
  }

  // Error
  if (isError) {
    return <PageError isFull />;
  }

  return (
    <AuthContainerWrapperStyled>
      <AuthInfoView {...liveAuthAuctionEditProps} actions={actions} />
      <AuthEditComplete onClickComplete={actions.onClickComplete} />
    </AuthContainerWrapperStyled>
  );
};
