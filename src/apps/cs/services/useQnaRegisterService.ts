import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { MutateOptions } from 'react-query';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { WebLinkTypes } from '@constants/link';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { getWebLink } from '@utils/link';
import { ErrorModel } from '@utils/api/createAxios';
import { userAgent } from '@utils/ua';
import {
  getQnaFields,
  CreateQnaRegisterGeneralParams,
  CreateQnaRegisterGoodsParams,
  CreateQnaRegisterOrderParams,
  createQnaRegisterGeneral,
  createQnaRegisterGoods,
  createQnaRegisterOrder,
  createQnaRegisterAdditional,
  createQnaUpload,
} from '../apis';
import {
  RequestTypes,
  QueryKeys,
  MappedOrderTemplateTypes,
  UPLOAD_FILE_MAX_COUNT,
  UPLOAD_FILE_MAX_COUNT_MESSAGE,
  UPLOAD_FILE_MAX_SIZE,
  UPLOAD_FILE_MAX_SIZE_MESSAGE,
} from '../constants';
import type { QnaRegisterFormProps } from '../components';
import { QnaDetailSchema } from '../schemas';
import { toQnaFieldsModel } from '../models';
import {
  RegisterParams,
  RegisterGeneralFormFields,
  RegisterGoodsFormFields,
  RegisterOrderFormFields,
  RegisterAdditionalFormFields,
} from '../types';

type Attachments = Exclude<QnaRegisterFormProps['attachments'], undefined>;

export const useQnaRegisterService = ({ type, goodsId, orderId, optionId, requestId }: RegisterParams) => {
  const { isApp } = userAgent();
  const history = useHistory();
  const { close, setDismissConfirm, setTopBar, showToastMessage } = useWebInterface();

  // 첨부 파일 목록
  const [attachments, setAttachments] = useState<Attachments>([]);
  // 첨부 파일 업로드 진행중 여부
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Dismiss Confirm 노출 여부
  const [confirmable, setConfirmable] = useState<boolean>(false);

  /**
   * 문의 유형 조회
   */
  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess } = useQuery(
    [QueryKeys.MAIN, QueryKeys.TICKET_FIELDS, type],
    () =>
      getQnaFields({
        fieldType: type === RequestTypes.ORDER ? 'ORDER_INQUIRY_DROPDOWN' : 'GENERAL_INQUIRY_DROPDOWN',
      }),
    {
      select: toQnaFieldsModel,
      enabled: type !== RequestTypes.GOODS,
    },
  );

  // 문의 등록 Options
  const mutateOptions: MutateOptions<
    QnaDetailSchema,
    ErrorModel,
    CreateQnaRegisterGeneralParams | CreateQnaRegisterGoodsParams | CreateQnaRegisterOrderParams
  > = {
    onSuccess: ({ id }) => {
      if (isApp) {
        // App인 경우 모달 닫기
        // ? id값을 통해 토스트 반복 노출되는 이슈 방지 (https://rxc.atlassian.net/browse/FE-4561)
        close({ type: 'registeredQnA', id });
      } else {
        // Web인 경우 등록된 문의 상세 페이지로 이동
        history.replace(getWebLink(WebLinkTypes.CS_QNA_DETAIL, { requestId: id }));
      }
    },
    onError: (err) => {
      showToastMessage({ message: err.data?.message ?? '잠시 후 다시 시도해주세요' });
    },
  };

  // 일반 문의 등록
  const { mutateAsync: executeQnaRegisterGeneral, isLoading: isLoadingQnaRegisterGeneral } = useMutation(
    createQnaRegisterGeneral,
    mutateOptions,
  );
  // 상품 문의 등록
  const { mutateAsync: executeQnaRegisterGoods, isLoading: isLoadingQnaRegisterGoods } = useMutation(
    createQnaRegisterGoods,
    mutateOptions,
  );
  // 주문 문의 등록
  const { mutateAsync: executeQnaRegisterOrder, isLoading: isLoadingQnaRegisterOrder } = useMutation(
    createQnaRegisterOrder,
    mutateOptions,
  );

  // 문의 추가 등록
  const { mutateAsync: executeQnaRegisterAdditional, isLoading: isLoadingQnRegisterAdditional } = useMutation(
    createQnaRegisterAdditional,
    {
      onSuccess: () => {
        if (isApp) {
          close({ type: 'registeredComment' });
        } else {
          history.replace(getWebLink(WebLinkTypes.CS_QNA_DETAIL, { requestId: requestId as number }));
        }
      },
    },
  );

  // 문의 유형별 폼 기본값
  const defaultValues = {
    ...(type !== RequestTypes.ADDITIONAL && { subject: '' }),
    body: '',
    uploadTokens: [],
    ...(type === RequestTypes.GENERAL && { inquiryValue: '' }),
    ...(type === RequestTypes.GOODS && { goodsId }),
    ...(type === RequestTypes.ORDER && {
      inquiryValue: '',
      orderId,
      orderItemOptionId: optionId,
    }),
  };

  const methods = useForm<
    RegisterGeneralFormFields | RegisterGoodsFormFields | RegisterOrderFormFields | RegisterAdditionalFormFields
  >({
    defaultValues,
    mode: 'onChange',
  });

  const watchInquiryValue = methods.watch('inquiryValue', '');
  const watchUploadTokens = methods.watch('uploadTokens');

  const handleSubmit = methods.handleSubmit(() => {
    const values = methods.getValues();

    switch (type) {
      case RequestTypes.GENERAL:
        executeQnaRegisterGeneral(values as RegisterGeneralFormFields);
        break;
      case RequestTypes.GOODS:
        executeQnaRegisterGoods(values as RegisterGoodsFormFields);
        break;
      case RequestTypes.ORDER:
        executeQnaRegisterOrder(values as RegisterOrderFormFields);
        break;
      case RequestTypes.ADDITIONAL:
        executeQnaRegisterAdditional({ ...values, requestId: requestId as number });
        break;
      default:
        executeQnaRegisterGeneral(values as RegisterGeneralFormFields);
        break;
    }
  });

  // 파일 업로드
  const { mutateAsync: upload } = useMutation(createQnaUpload);

  // 파일 업로드 핸들러
  const handleUploadFiles = async (files: File[]) => {
    // 전체 업로드 파일 수
    const uploadCount = methods.getValues('uploadTokens').length + files.length;

    // 최대 업로드 파일 수 제한
    if (uploadCount > UPLOAD_FILE_MAX_COUNT) {
      showToastMessage({ message: UPLOAD_FILE_MAX_COUNT_MESSAGE });
      return;
    }

    setIsUploading(true);

    // eslint-disable-next-line no-restricted-syntax
    for await (const file of files) {
      try {
        const current = { key: file.name, label: file.name };

        setAttachments((prev) => [{ ...current, token: '', loading: true }, ...prev]);

        // 파일 크기 체크
        if (file.size > UPLOAD_FILE_MAX_SIZE) {
          const sizeError = new Error(UPLOAD_FILE_MAX_SIZE_MESSAGE);
          sizeError.name = 'CustomError';
          throw sizeError;
        }

        const { token } = await upload({ fileName: file.name, file });

        setAttachments((prev) => [{ ...current, token, loading: false }, ...prev.slice(1)]);
      } catch (err) {
        setIsUploading(false);
        const customMessage = isObject(err) && get(err, 'name') === 'CustomError' && get(err, 'message');
        // TODO: 업로드 지연 체크가 가능할 경우 XLT 추가
        showToastMessage({ message: customMessage ?? '파일에 오류가 있습니다' });
        setAttachments((prev) => [...prev.slice(1)]);
      }
    }

    setIsUploading(false);
  };

  const handleDeleteFiles = (deleteToken: string) => {
    setAttachments((prev) => [...prev.filter(({ token }) => token !== deleteToken)]);
  };

  useEffect(() => {
    // 티켓 생성과 추가 문의 Title이 다를 수 있는 경우 대비를 위한 조건 설정
    const isRegisterAdditional = type === RequestTypes.ADDITIONAL;

    isApp && isRegisterAdditional && setTopBar({ title: '1:1 문의' });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tokens = attachments.map(({ token }) => token);

    methods.setValue('uploadTokens', tokens);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachments]);

  useEffect(() => {
    // 주문 문의 템플릿 유형이 아닌 경우 내용 제거
    if (!MappedOrderTemplateTypes.has(watchInquiryValue)) {
      methods.setValue('body', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchInquiryValue]);

  useEffect(() => {
    // 변경 사항이 있거나 첨부 파일이 있는 경우 dismiss confirm 노출
    setConfirmable(methods.formState.isDirty || watchUploadTokens.length > 0);
  }, [methods.formState.isDirty, watchUploadTokens]);

  useEffect(() => {
    isApp &&
      setDismissConfirm({
        isConfirmable: confirmable,
        title: '문의를 등록하지 않고 나갈까요?',
        message: '내용은 저장되지 않습니다',
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmable]);

  return {
    fields: data,
    errorFields: error,
    isErrorFields: isError,
    isLoadingFields: isLoading,
    isFetchingFields: isFetching,
    isFetchedFields: isFetched,
    isSuccessFields: isSuccess,
    methods,
    handleSubmit,
    attachments,
    isUploading,
    isRegistering:
      isLoadingQnaRegisterGeneral ||
      isLoadingQnaRegisterGoods ||
      isLoadingQnaRegisterOrder ||
      isLoadingQnRegisterAdditional,
    handleUploadFiles,
    handleDeleteFiles,
  };
};
