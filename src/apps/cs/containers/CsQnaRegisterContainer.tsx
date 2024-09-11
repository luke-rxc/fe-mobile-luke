import { FormProvider } from 'react-hook-form';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useQueryString } from '@hooks/useQueryString';
import { QnaRegisterForm } from '../components';
import { useQnaRegisterService } from '../services';
import type { RegisterParams } from '../types';

export const CsQnaRegisterContainer = () => {
  const { type = 'general', goodsId, orderId, optionId, requestId } = useQueryString<RegisterParams>();
  const {
    fields,
    errorFields,
    isErrorFields,
    isLoadingFields,
    methods,
    handleSubmit,
    attachments,
    isUploading,
    isRegistering,
    handleUploadFiles,
    handleDeleteFiles,
  } = useQnaRegisterService({
    type,
    goodsId: Number(goodsId),
    orderId: Number(orderId),
    optionId: Number(optionId),
    requestId: Number(requestId),
  });

  useHeaderDispatch({
    type: 'mweb',
    title: '1:1 문의',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  const loading = useLoadingSpinner(isLoadingFields);

  if (loading) {
    return null;
  }

  // Error
  if (isErrorFields) {
    return <PageError error={errorFields} />;
  }

  return (
    <FormProvider {...methods}>
      <ContainerStyled>
        <QnaRegisterForm
          type={type}
          inquiryFields={fields}
          attachments={attachments}
          onUpload={handleUploadFiles}
          onSubmit={handleSubmit}
          onClickCancelFile={handleDeleteFiles}
          isUploading={isUploading}
          isRegistering={isRegistering}
        />
      </ContainerStyled>
    </FormProvider>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
`;
