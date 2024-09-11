import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useModal } from '@hooks/useModal';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { AirlineTicketInfoFormFields, AdditionalInfoCommonProps, AdditionalInfoReceiveProps } from '../types';
import {
  ADDINFO_NATION_CODE_QUERY_KEY,
  ADDINFO_RECENT_FORM_QUERY_KEY,
  AdditionalInfoEventType,
  AdditionalInfoText,
  AdditionalInfoUISectionType,
  InputFormMode,
  InputFormType,
} from '../constants';
import { getNationalityCodeInfo, getRecentlyInputFormInfo } from '../apis';
import { AirlineTicketInfoSchema, AirlineTicketInputSchema } from '../schemas';
import { useUpdateAirlineTicketService } from './useMutationAdditionalInfoService';
import { useLogService } from './useLogService';

type InputFormModeType = ValueOf<typeof InputFormMode>;

export const useAdditionalInfoService = ({ type: additionalInfoType }: AdditionalInfoCommonProps) => {
  const { userInfo } = useAuth();
  const [inputFormType, setInputFormType] = useState<keyof typeof InputFormType>(InputFormType.DEFAULT);
  const [inputFormMode, setInpuFormMode] = useState<InputFormModeType>(InputFormMode.REGISTER);
  const [isDisabledForm, setDisabledForm] = useState(false);
  const [isWithInfants, setWithInfants] = useState(false);
  const [orderId, setOrderId] = useState<number>(-1);
  const [optionId, setOptionId] = useState<number>(-1);
  const [exportId, setExportId] = useState<number>(-1);
  const [goodsId, setGoodsId] = useState<number>(-1);
  const [goodsName, setGoodsName] = useState<string>('');
  const { initialValues, alert, close, generateHapticFeedback } = useWebInterface();
  const { closeModal } = useModal();
  const { logMyOrderCompleteFormInput } = useLogService();
  const airlineTicketFormMethods = useForm<AirlineTicketInfoFormFields>({
    defaultValues: {
      inputFormType,
      firstName: '',
      lastName: '',
      dob: '',
      sex: '',
      passportNumber: '',
      passportExpiryDate: '',
      email: userInfo?.email,
      infantFirstName: '',
      infantLastName: '',
      infantDob: '',
      infantSex: '',
      infantPassportNumber: '',
      infantPassportExpiryDate: '',
      isInfantAccompanied: false,
      nationality: 'KOR',
      infantNationality: 'KOR',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { setValue, getValues, reset, handleSubmit, trigger, formState } = airlineTicketFormMethods;
  const { isValid, isDirty } = formState;
  const nationalityInfoQuery = useQuery([ADDINFO_NATION_CODE_QUERY_KEY], getNationalityCodeInfo, {
    refetchOnMount: true,
    enabled: additionalInfoType === AdditionalInfoUISectionType.AIRLINE_TICKET,
  });

  const recentlyInputFormInfoQuery = useQuery(
    [ADDINFO_RECENT_FORM_QUERY_KEY, additionalInfoType, inputFormType],
    () => getRecentlyInputFormInfo({ inputFormType }),
    {
      refetchOnMount: true,
      enabled:
        additionalInfoType === AdditionalInfoUISectionType.AIRLINE_TICKET && inputFormType !== InputFormType.DEFAULT,
    },
  );

  const handleChangeWithInfants = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setValue('isInfantAccompanied', checked);
    setWithInfants(checked);
    trigger();
  };

  // TextField 공백 제거
  const changeInputString = (value: string) => {
    return value.replace(/\s/gi, '');
  };

  // TextField onChange
  const handleChangeInputData = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof AirlineTicketInfoFormFields,
  ) => {
    const result = changeInputString(event.target.value);
    if (fieldName !== 'email') {
      setValue(fieldName, result.toUpperCase());
    } else {
      setValue(fieldName, result);
    }
    trigger();
  };

  const handleInputFormData = (data: AirlineTicketInfoSchema, formType: keyof typeof InputFormType) => {
    const { firstName, lastName, dob, sex, nationality, infantNationality, isInfantAccompanied } = data;
    const parseData = handleParseOptionalField(
      { ...data, nationality: nationality.code, infantNationality: infantNationality?.code },
      'empty',
      formType,
    );
    reset();
    setValue('firstName', firstName);
    setValue('lastName', lastName);
    setValue('dob', dob);
    setValue('sex', sex);
    setValue('nationality', nationality.code);
    setValue('isInfantAccompanied', isInfantAccompanied);
    setWithInfants(isInfantAccompanied);
    if (isInfantAccompanied) {
      const { infantFirstName, infantLastName, infantDob, infantSex, infantNationality: infantNation } = parseData;
      setValue('infantFirstName', infantFirstName);
      setValue('infantLastName', infantLastName);
      setValue('infantDob', infantDob);
      setValue('infantSex', infantSex);
      setValue('infantNationality', infantNation);
    }
    if (formType && formType === InputFormType.AIRLINE_INTERNATIONAL) {
      const { passportNumber, passportExpiryDate, email } = parseData;
      setValue('passportNumber', passportNumber);
      setValue('passportExpiryDate', passportExpiryDate);
      setValue('email', email);
      if (isInfantAccompanied) {
        const { infantPassportNumber, infantPassportExpiryDate } = parseData;
        setValue('infantPassportNumber', infantPassportNumber);
        setValue('infantPassportExpiryDate', infantPassportExpiryDate);
      }
    }
    trigger();
  };

  /**
   * 초기화 호출
   */
  const handleResetInputForm = () => {
    reset();
    setWithInfants(false);
  };

  /**
   * 초기화 Disabled 조건
   */
  const isDisabledResetForm = () => {
    return !isValid && !isDirty && getValues('firstName').length === 0;
  };

  /**
   * 응모 모달 닫기 호출
   */
  const handleCloseInputFormModal = (params: AdditionalInfoReceiveProps) => {
    close(
      { ...params },
      {
        doWeb: () => {
          closeModal('', { ...params });
        },
      },
    );
  };

  /**
   * 항공권 정보 입력/수정 API 호출 (inputFormMode(register/edit) 함께 전달)
   */
  const { mutate: updateAirlineTicketMutation, isLoading: isUpdateAirlineTicketLoading } =
    useUpdateAirlineTicketService(
      {
        onSuccess: () => {
          const receiveParams = {
            type: AdditionalInfoEventType.ON_SUCCESS,
          } as AdditionalInfoReceiveProps;
          reset();
          handleCloseInputFormModal(receiveParams);
        },
        onError: async (error: ErrorModel<ErrorDataModel>) => {
          generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
          if (
            await alert({
              title: AdditionalInfoText.ALERT.DEFAULT_TITLE,
              message: error.data?.message ?? AdditionalInfoText.ALERT.DEFAULT_ERROR_MESSAGE,
            })
          ) {
            const receiveParams = {
              type: AdditionalInfoEventType.ON_ERROR,
            } as AdditionalInfoReceiveProps;
            reset();
            handleCloseInputFormModal(receiveParams);
          }
        },
      },
      inputFormMode,
    );

  const handleParseOptionalField = (
    values: Omit<AirlineTicketInfoFormFields, 'inputFormType'>,
    type: 'null' | 'empty',
    formType: keyof typeof InputFormType,
  ): AirlineTicketInputSchema => {
    const { isInfantAccompanied } = values;
    const parseType = type === 'empty' ? '' : null;
    if (formType === InputFormType.AIRLINE_DOMESTIC) {
      if (!isInfantAccompanied) {
        // 국내선 & 유아동반 아닌 경우 infant 여권 번호, 만료일자, 이메일 null
        const {
          passportNumber,
          passportExpiryDate,
          email,
          infantFirstName,
          infantLastName,
          infantDob,
          infantSex,
          infantPassportNumber,
          infantPassportExpiryDate,
          infantNationality,
          isInfantAccompanied: isInfant,
          ...value
        } = values;
        return {
          ...value,
          passportNumber: parseType,
          passportExpiryDate: parseType,
          email: parseType,
          infantFirstName: parseType,
          infantLastName: parseType,
          infantDob: parseType,
          infantSex: parseType,
          infantPassportNumber: parseType,
          infantPassportExpiryDate: parseType,
          infantNationality: parseType,
          isInfantAccompanied: isInfant,
          inputFormType: formType,
        };
      }
      // 국내선 & 유아동반 & 여권 번호, 만료일자, 이메일
      const {
        passportNumber,
        passportExpiryDate,
        email,
        infantPassportNumber,
        infantPassportExpiryDate,
        isInfantAccompanied: isInfant,
        ...value
      } = values;
      return {
        ...value,
        passportNumber: parseType,
        passportExpiryDate: parseType,
        email: parseType,
        infantPassportNumber: parseType,
        infantPassportExpiryDate: parseType,
        isInfantAccompanied: isInfant,
        inputFormType: formType,
      };
    }
    if (formType === InputFormType.AIRLINE_INTERNATIONAL && !isInfantAccompanied) {
      // 극제선 & 유아동반 아닌 경우 infant 기본정보 관련
      const {
        infantFirstName,
        infantLastName,
        infantDob,
        infantSex,
        infantPassportNumber,
        infantPassportExpiryDate,
        infantNationality,
        isInfantAccompanied: isInfant,
        ...value
      } = values;
      return {
        ...value,
        infantFirstName: parseType,
        infantLastName: parseType,
        infantDob: parseType,
        infantSex: parseType,
        infantPassportNumber: parseType,
        infantPassportExpiryDate: parseType,
        infantNationality: parseType,
        isInfantAccompanied: isInfant,
        inputFormType: formType,
      };
    }
    return { ...values, inputFormType: InputFormType.AIRLINE_INTERNATIONAL };
  };

  /**
   * 항공권 정보 입력/수정 모달 내 완료 버튼 클릭
   */
  const handleSubmitAirlineTicket = handleSubmit(() => {
    const currentValues = getValues();
    const parseValues = handleParseOptionalField(currentValues, 'null', inputFormType);
    const mutationParams = {
      orderId,
      optionId,
      inputInfo: parseValues,
      exportId: inputFormMode === InputFormMode.EDIT ? exportId : undefined,
    };
    updateAirlineTicketMutation(mutationParams);
    logMyOrderCompleteFormInput({
      orderId,
      goodsId,
      goodsName,
      formType: AdditionalInfoUISectionType.AIRLINE_TICKET,
      exportId,
    });
  });

  useEffect(() => {
    // 주문 상세에서 탑승자 정보 Passenger 클릭 시 전달한 initialValues
    if (!isEmpty(initialValues)) {
      if (additionalInfoType === AdditionalInfoUISectionType.AIRLINE_TICKET) {
        const { type, data } = initialValues?.initData as AdditionalInfoReceiveProps;
        if (type === AdditionalInfoEventType.ON_OPEN) {
          if (data?.orderId) {
            setOrderId(data.orderId);
          }
          if (data?.optionId) {
            setOptionId(data.optionId);
          }
          if (data?.exportId) {
            setExportId(data.exportId);
          }
          if (data?.goodsId) {
            setGoodsId(data.goodsId);
          }
          if (data?.goodsName) {
            setGoodsName(data.goodsName);
          }
          if (data?.inputFormType) {
            setInputFormType(data.inputFormType);
            setValue('inputFormType', data.inputFormType);
          }
          if (data?.inputFormMode) {
            setInpuFormMode(data.inputFormMode);
            if (data?.inputFormMode === InputFormMode.COMPLETE) {
              setDisabledForm(true);
            }
          }
          if (data?.inputFormData) {
            handleInputFormData(data.inputFormData, data.inputFormType);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return {
    airlineTicket: {
      formMethods: airlineTicketFormMethods,
      inputFormType,
      inputFormMode,
      isDisabledForm,
      isWithInfants,
      isUpdateAirlineTicketLoading,
      handleChangeWithInfants,
      handleChangeInputData,
      handleInputFormData,
      handleSubmitAirlineTicket,
      handleParseOptionalField,
      handleResetInputForm,
      isDisabledResetForm,
      nationality: {
        data: nationalityInfoQuery.data,
        isLoading: nationalityInfoQuery.isLoading,
        isError: nationalityInfoQuery.isError,
      },
      recentlyInputForm: {
        data: recentlyInputFormInfoQuery.data,
        isLoading: recentlyInputFormInfoQuery.isLoading,
        isError: recentlyInputFormInfoQuery.isError,
      },
    },
  };
};
