import React from 'react';
import { PageError } from '@features/exception/components';
import { ErrorActionButtonLabel } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { ErrorDataModel } from '@utils/api/createAxios';
import { ContentListMessage } from '../constants';

interface Props {
  data?: ErrorDataModel;
  customMessage?: string;
}

export const ContentListError: React.FC<Props> = ({ data, customMessage = ContentListMessage.ERROR_NETWORK }) => {
  const exceptionMessage = data && data.message ? data.message : customMessage;

  const {
    action: { handleErrorHomeCb },
  } = useErrorService();

  return (
    <PageError description={exceptionMessage} actionLabel={ErrorActionButtonLabel.HOME} onAction={handleErrorHomeCb} />
  );
};
