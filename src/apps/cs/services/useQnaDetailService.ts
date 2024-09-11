import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import env from '@env';
import { useLink } from '@hooks/useLink';
import { useMutation } from '@hooks/useMutation';
import { getAppLink, getWebLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { useWebInterface } from '@hooks/useWebInterface';
import { getQnaDetail, updateOutgoingCallStatus } from '../apis';
import { OutgoingCallStatus, QueryKeys } from '../constants';
import { toQnaDetailModel } from '../models';

export const useQnaDetailService = (requestId: number) => {
  const { isApp } = userAgent();
  const { toLink } = useLink();
  const { confirm, receiveValues, emitClearReceiveValues, showToastMessage } = useWebInterface();

  // 유선 상담 상태
  const [outgoingCallStatus, setOutgoingCallStatus] = useState<OutgoingCallStatus>('NONE');

  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess, refetch } = useQuery(
    [QueryKeys.MAIN, QueryKeys.QNA_DETAIL, requestId],
    () => getQnaDetail({ requestId }),
    {
      onSuccess: ({ outgoingCallStatus: status }) => {
        status && setOutgoingCallStatus(status);
      },
      select: toQnaDetailModel,
      cacheTime: 0,
    },
  );

  const { mutateAsync: executeUpdateOutgoingCallStatus, isLoading: isLoadingUpdateOutgoingCallStatus } = useMutation(
    updateOutgoingCallStatus,
    {
      onSuccess: (_, { status }) => {
        setOutgoingCallStatus(status);

        //  전화 상담 접수 완료 시 Toast
        status === OutgoingCallStatus.REQUESTED && showToastMessage({ message: '전화 상담을 신청했습니다' });
      },
      onError: (err) => {
        showToastMessage({ message: err.data?.message ?? '잠시 후 다시 시도해주세요' });
      },
    },
  );

  const handleUpdateOutgoingCallStatus = async (status: OutgoingCallStatus) => {
    // 상담 철회 여부
    const isWithdrawal = status === OutgoingCallStatus.REQUESTABLE;
    // 상담 철회 컨펌 파라미터
    const confirmParams = { title: '전화 상담 신청을 철회할까요?', message: '철회 후 다시 요청할 수 있습니다' };

    // 상담 철회 시 Confirm
    if (isWithdrawal && !(await confirm(confirmParams))) {
      return;
    }

    executeUpdateOutgoingCallStatus({ requestId, status });
  };

  const handleClickAddInquiry = () => {
    const { baseUrl } = env.endPoint;

    const webLink = getWebLink(WebLinkTypes.CS_QNA_REGISTER_ADDITIONAL, { requestId });
    const appLink = getAppLink(AppLinkTypes.WEB, { landingType: 'modal', url: baseUrl.concat(webLink) });

    toLink(isApp ? appLink : webLink);
  };

  useEffect(() => {
    if (isEmpty(receiveValues)) return;

    if (receiveValues?.type === 'registeredComment') {
      refetch();
    }

    // App 내에서도 갱신되는 케이스가 존재하는 것으로 예상되어 App 체크 제외
    emitClearReceiveValues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return {
    request: data,
    error,
    isError,
    isLoading,
    isFetching,
    isFetched,
    isSuccess,
    outgoingCallStatus,
    isLoadingUpdateOutgoingCallStatus,
    handleUpdateOutgoingCallStatus,
    handleClickAddInquiry,
  };
};
