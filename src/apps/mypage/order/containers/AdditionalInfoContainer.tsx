import { FormProvider } from 'react-hook-form';
import { PageError } from '@features/exception/components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { AdditionalInfoText, AdditionalInfoUISectionType } from '../constants';
import { AirlineTicketInfoInputForm } from '../components/AirlineTicketInfoInputForm';
import { AdditionalInfoCommonProps } from '../types';
import { useAdditionalInfoService } from '../services/useAdditionalInfoService';

/**
 * 부가정보 컨테이너
 */
export const AdditionalInfoContainer = ({ type }: AdditionalInfoCommonProps) => {
  const { airlineTicket } = useAdditionalInfoService({ type });
  const {
    formMethods,
    nationality,
    inputFormType,
    isDisabledForm,
    isWithInfants,
    inputFormMode,
    recentlyInputForm,
    isUpdateAirlineTicketLoading,
    handleChangeWithInfants,
    handleInputFormData,
    handleSubmitAirlineTicket,
    handleResetInputForm,
    handleChangeInputData,
    isDisabledResetForm,
  } = airlineTicket;

  const loading = useLoadingSpinner(nationality.isLoading || recentlyInputForm.isLoading);

  if (loading) {
    return null;
  }
  switch (type) {
    case AdditionalInfoUISectionType.AIRLINE_TICKET:
      return (
        <FormProvider {...formMethods}>
          <AirlineTicketInfoInputForm
            nationalityList={nationality.data}
            recentlyInputForm={recentlyInputForm.data}
            inputFormType={inputFormType}
            isDisabledForm={isDisabledForm}
            isWithInfants={isWithInfants}
            inputFormMode={inputFormMode}
            isUpdateAirlineTicketLoading={isUpdateAirlineTicketLoading}
            handleChangeWithInfants={handleChangeWithInfants}
            handleInputFormData={handleInputFormData}
            handleSubmitAirlineTicket={handleSubmitAirlineTicket}
            handleResetInputForm={handleResetInputForm}
            handleChangeInputData={handleChangeInputData}
            isDisabledResetForm={isDisabledResetForm}
          />
        </FormProvider>
      );
    default:
      return <PageError defaultMessage={AdditionalInfoText.PAGE_DEFAULT_ERROR_MESSAGE} />;
  }
};
