import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { OutgoingCallStatus } from '../constants';
import { QnaDetail } from '../components';
import { useLogService, useQnaDetailService } from '../services';

interface Props {
  requestId: number;
}

export const CsQnaDetailContainer = ({ requestId }: Props) => {
  const {
    request,
    error,
    isError,
    isLoading,
    outgoingCallStatus,
    isLoadingUpdateOutgoingCallStatus,
    handleUpdateOutgoingCallStatus: onUpdateOutgoingCallStatus,
    handleClickAddInquiry,
  } = useQnaDetailService(requestId);

  const { logMyQnaTabCallRequest, logMyQnaTabCallCancel, logMyQnaTabAddComment } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '1:1 문의',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  const loading = useLoadingSpinner(isLoading);

  if (loading) {
    return null;
  }

  // Error
  if (isError) {
    return <PageError error={error} />;
  }

  return (
    <>
      {request && (
        <QnaDetail
          {...request}
          outgoingCallStatus={outgoingCallStatus}
          isLoadingOutgoingCallStatus={isLoadingUpdateOutgoingCallStatus}
          onClickOutgoingCallRequest={() => {
            // tab log
            logMyQnaTabCallRequest({ goodsId: request['data-log-goods-id'] });
            // 상담 신청 (REQUESTABLE -> REQUESTED)
            onUpdateOutgoingCallStatus(OutgoingCallStatus.REQUESTED);
          }}
          onClickOutgoingCallWaiting={() => {
            // tab log
            logMyQnaTabCallCancel({ goodsId: request['data-log-goods-id'] });
            // 상담 신청 철회 (REQUESTED -> REQUESTABLE)
            onUpdateOutgoingCallStatus(OutgoingCallStatus.REQUESTABLE);
          }}
          onClickAddInquiry={() => {
            // tab log
            logMyQnaTabAddComment({ goodsId: request['data-log-goods-id'] });
            // 문의 추가
            handleClickAddInquiry();
          }}
        />
      )}
    </>
  );
};
