import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Button } from '@pui/button';
import { Checkbox } from '@pui/checkbox';
import { TextField } from '@pui/textfield';
import { Select } from '@pui/select';
import { InfantFilled } from '@pui/icon';
import { useTheme } from '@hooks/useTheme';
import { Chips } from '@pui/chips';
import { useInputBlur } from '@features/authentication/hooks';
import { Divider } from '@pui/divider';
import { ChangeEvent } from 'react';
import {
  AdditionalInfoText,
  AirlineTicketRule,
  InputFormMode,
  InputFormType,
  NoticeMessage,
  userDefaultGenderList,
} from '../constants';
import { AdditionalInfoSelectSchema, AirlineTicketInfoSchema, RecentlyInputFormInfoSchema } from '../schemas';
import { AirlineTicketInfoFormFields } from '../types';
import { useLogService } from '../services/useLogService';

export interface AirlineTicketInfoInputFormProps {
  nationalityList: AdditionalInfoSelectSchema[] | undefined;
  recentlyInputForm: RecentlyInputFormInfoSchema[] | undefined;
  inputFormType: keyof typeof InputFormType;
  isDisabledForm: boolean;
  isWithInfants: boolean;
  isUpdateAirlineTicketLoading: boolean;
  inputFormMode: ValueOf<typeof InputFormMode>;
  handleChangeWithInfants: (event: ChangeEvent<HTMLInputElement>) => void;
  handleInputFormData: (data: AirlineTicketInfoSchema, formType: keyof typeof InputFormType) => void;
  handleSubmitAirlineTicket: () => void;
  handleResetInputForm: () => void;
  handleChangeInputData: (event: ChangeEvent<HTMLInputElement>, fieldName: keyof AirlineTicketInfoFormFields) => void;
  isDisabledResetForm: () => boolean;
}

export const AirlineTicketInfoInputForm = ({
  nationalityList,
  recentlyInputForm,
  inputFormType,
  isDisabledForm,
  isWithInfants,
  inputFormMode,
  isUpdateAirlineTicketLoading,
  handleChangeWithInfants,
  handleInputFormData,
  handleSubmitAirlineTicket,
  handleResetInputForm,
  handleChangeInputData,
  isDisabledResetForm,
}: AirlineTicketInfoInputFormProps) => {
  const {
    register,
    formState: { errors, isValid, touchedFields },
  } = useFormContext();
  const { theme } = useTheme();
  const elRef = useInputBlur<HTMLFormElement>();
  const infantFilledIconProps = { size: '1.8rem', colorCode: theme.color.brand.tint };
  const getChipProps = ({ airlineTicket }: RecentlyInputFormInfoSchema) => {
    const { firstName, lastName } = airlineTicket;
    return {
      key: uuid().slice(0, 8),
      label: `${firstName} ${lastName}`,
    };
  };
  const dividerClassName = `divider ${inputFormMode === InputFormMode.COMPLETE ? `add-spacing` : ``}`;
  const { logMyOrderTabFormShortcut } = useLogService();
  return (
    <>
      {inputFormMode !== InputFormMode.COMPLETE && recentlyInputForm && recentlyInputForm.length > 0 && (
        <WrapperStyled>
          <div className="form-chip-container">
            <div className="chip-wrapper">
              <Chips
                data={recentlyInputForm ?? []}
                getChipProps={getChipProps}
                onClickChip={(data) => {
                  handleInputFormData(data.airlineTicket, inputFormType);
                  logMyOrderTabFormShortcut();
                }}
              />
            </div>
            <div className="button-wrapper">
              <Button block size="small" disabled={isDisabledResetForm()} onClick={handleResetInputForm}>
                {AdditionalInfoText.MODAL.RESET}
              </Button>
            </div>
          </div>
        </WrapperStyled>
      )}
      <FormWrapperStyled onSubmit={handleSubmitAirlineTicket} ref={elRef}>
        <div className="form-field-container">
          <TextField
            className="text-field"
            {...register('firstName', AirlineTicketRule[inputFormType].firstName)}
            type="text"
            placeholder={AirlineTicketRule[inputFormType].firstName.placeHolder}
            disabled={isDisabledForm}
            error={!!errors.firstName && touchedFields.firstName}
            helperText={errors.firstName?.message ?? ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'firstName')}
          />
          <TextField
            className="text-field"
            {...register('lastName', AirlineTicketRule[inputFormType].lastName)}
            type="text"
            placeholder={AirlineTicketRule[inputFormType].lastName.placeHolder}
            disabled={isDisabledForm}
            error={!!errors.lastName && touchedFields.lastName}
            helperText={errors.lastName?.message ?? ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'lastName')}
          />
        </div>
        <div className="form-field-container">
          <TextField
            className="text-field"
            {...register('dob', AirlineTicketRule[inputFormType].dob)}
            type="tel"
            placeholder={AirlineTicketRule[inputFormType].dob.placeHolder}
            disabled={isDisabledForm}
            error={!!errors.dob && touchedFields.dob}
            helperText={errors.dob?.message ?? ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'dob')}
          />
        </div>
        <div className="form-field-container">
          <Select
            className="form-selectbox"
            {...register('sex', AirlineTicketRule[inputFormType].sex)}
            size="large"
            placeholder={AirlineTicketRule[inputFormType].sex.placeHolder}
            disabled={isDisabledForm}
            error={!!errors.sex && touchedFields.sex}
            helperText={errors.sex?.message ?? ''}
          >
            {userDefaultGenderList.map(({ code, text }) => {
              return (
                <option key={code} value={code}>
                  {text}
                </option>
              );
            })}
          </Select>
        </div>
        <div className="form-field-container">
          <Select
            className="form-selectbox"
            {...register('nationality')}
            size="large"
            placeholder={AdditionalInfoText.NATIONALITY.PLACE_HOLDER}
            disabled={isDisabledForm}
          >
            {nationalityList?.map(({ code, text }) => {
              return (
                <option key={code} value={code}>
                  {text}
                </option>
              );
            })}
          </Select>
        </div>
        {inputFormType === InputFormType.AIRLINE_INTERNATIONAL && (
          <>
            <div className="form-field-container">
              <TextField
                className="text-field"
                {...register('email', AirlineTicketRule[inputFormType].email)}
                type="text"
                placeholder={AirlineTicketRule[inputFormType].email.placeHolder}
                error={!!errors.email && touchedFields.email}
                helperText={errors.email?.message ?? ''}
                disabled={isDisabledForm}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'email')}
              />
            </div>
            <div className="form-field-container">
              <TextField
                className="text-field"
                {...register('passportNumber', AirlineTicketRule[inputFormType].passportNumber)}
                type="text"
                placeholder={AirlineTicketRule[inputFormType].passportNumber.placeHolder}
                error={!!errors.passportNumber && touchedFields.passportNumber}
                helperText={errors.passportNumber?.message ?? ''}
                disabled={isDisabledForm}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'passportNumber')}
              />
            </div>
            <div className="form-field-container">
              <TextField
                className="text-field"
                {...register('passportExpiryDate', AirlineTicketRule[inputFormType].passportExpiryDate)}
                type="tel"
                placeholder={AirlineTicketRule[inputFormType].passportExpiryDate.placeHolder}
                error={!!errors.passportExpiryDate && touchedFields.passportExpiryDate}
                helperText={errors.passportExpiryDate?.message ?? ''}
                disabled={isDisabledForm}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'passportExpiryDate')}
              />
            </div>
          </>
        )}
        {!(inputFormMode === InputFormMode.COMPLETE && !isWithInfants) && (
          <div className="form-checkbox-container">
            <Checkbox
              {...register('isInfantAccompanied')}
              className="form-checkbox"
              onChange={handleChangeWithInfants}
              disabled={isDisabledForm}
            >
              {AdditionalInfoText.MODAL.INFANT_ACCOMPANIED}
            </Checkbox>
            <InfantFilled {...infantFilledIconProps} />
          </div>
        )}
        {isWithInfants && (
          <ContainerStyled>
            <div className="form-field-container">
              <TextField
                className="text-field"
                {...register('infantFirstName', AirlineTicketRule[inputFormType].firstName)}
                type="text"
                placeholder={AirlineTicketRule[inputFormType].firstName.placeHolder}
                disabled={isDisabledForm}
                error={!!errors.infantFirstName && touchedFields.infantFirstName}
                helperText={errors.infantFirstName?.message ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'infantFirstName')}
              />
              <TextField
                className="text-field"
                {...register('infantLastName', AirlineTicketRule[inputFormType].lastName)}
                type="text"
                placeholder={AirlineTicketRule[inputFormType].lastName.placeHolder}
                disabled={isDisabledForm}
                error={!!errors.infantLastName && touchedFields.infantLastName}
                helperText={errors.infantLastName?.message ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'infantLastName')}
              />
            </div>
            <div className="form-field-container">
              <TextField
                className="text-field"
                {...register('infantDob', AirlineTicketRule[inputFormType].dob)}
                type="tel"
                placeholder={AirlineTicketRule[inputFormType].dob.placeHolder}
                disabled={isDisabledForm}
                error={!!errors.infantDob && touchedFields.infantDob}
                helperText={errors.infantDob?.message ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeInputData(event, 'infantDob')}
              />
            </div>
            <div className="form-field-container">
              <Select
                className="form-selectbox"
                {...register('infantSex', AirlineTicketRule[inputFormType].sex)}
                size="large"
                placeholder={AirlineTicketRule[inputFormType].sex.placeHolder}
                disabled={isDisabledForm}
                error={!!errors.infantSex && touchedFields.infantSex}
                helperText={errors.sex?.message ?? ''}
              >
                {userDefaultGenderList.map(({ code, text }) => {
                  return (
                    <option key={code} value={code}>
                      {text}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div className="form-field-container">
              <Select
                className="form-selectbox"
                {...register('infantNationality')}
                size="large"
                placeholder={AdditionalInfoText.NATIONALITY.PLACE_HOLDER}
                disabled={isDisabledForm}
              >
                {nationalityList?.map(({ code, text }) => {
                  return (
                    <option key={code} value={code}>
                      {text}
                    </option>
                  );
                })}
              </Select>
            </div>
            {inputFormType === InputFormType.AIRLINE_INTERNATIONAL && (
              <>
                <div className="form-field-container">
                  <TextField
                    className="text-field"
                    {...register('infantPassportNumber', AirlineTicketRule[inputFormType].passportNumber)}
                    type="text"
                    placeholder={AirlineTicketRule[inputFormType].passportNumber.placeHolder}
                    error={!!errors.infantPassportNumber && touchedFields.infantPassportNumber}
                    helperText={errors.infantPassportNumber?.message ?? ''}
                    disabled={isDisabledForm}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeInputData(event, 'infantPassportNumber')
                    }
                  />
                </div>
                <div className="form-field-container">
                  <TextField
                    className="text-field"
                    {...register('infantPassportExpiryDate', AirlineTicketRule[inputFormType].passportExpiryDate)}
                    type="tel"
                    placeholder={AirlineTicketRule[inputFormType].passportExpiryDate.placeHolder}
                    error={!!errors.infantPassportExpiryDate && touchedFields.infantPassportExpiryDate}
                    helperText={errors.infantPassportExpiryDate?.message ?? ''}
                    disabled={isDisabledForm}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeInputData(event, 'infantPassportExpiryDate')
                    }
                  />
                </div>
              </>
            )}
          </ContainerStyled>
        )}
        {inputFormMode !== InputFormMode.COMPLETE && (
          <div className="form-submit-container">
            <Button
              bold
              block
              variant="primary"
              size="large"
              type="submit"
              disabled={!isValid}
              loading={isUpdateAirlineTicketLoading}
            >
              {AdditionalInfoText.MODAL.SUBMIT_TITLE}
            </Button>
          </div>
        )}
        <Divider className={dividerClassName} t={0.05} />
        <NoticeWrapperStyled>{AdditionalInfoText.MODAL.NOTICE}</NoticeWrapperStyled>
        {NoticeMessage[inputFormType].map((message) => {
          return (
            <ArticleWrapperStyled key={uuid().slice(0, 8)}>
              <ArticleRowWrapperStyled>
                <ArticleBulletWrapperStyled>•</ArticleBulletWrapperStyled>
                <ArticleTextWrapperStyled>{message}</ArticleTextWrapperStyled>
              </ArticleRowWrapperStyled>
            </ArticleWrapperStyled>
          );
        })}
      </FormWrapperStyled>
    </>
  );
};

const FormWrapperStyled = styled.form`
  .form-field-container {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    margin-bottom: ${({ theme }) => theme.spacing.s12};
    label {
      display: flex;
    }
    &:first-child {
      display: flex;
      justify-content: space-between;
      gap: ${({ theme }) => theme.spacing.s12};
      padding-top: ${({ theme }) => theme.spacing.s12};
    }
  }

  .form-checkbox-container {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `0 ${theme.spacing.s12} ${theme.spacing.s12} ${theme.spacing.s12}`};
    .form-checkbox {
      & .checkbox-label {
        font: ${({ theme }) => theme.fontType.medium};
        color: ${({ theme }) => theme.color.text.textPrimary};
        margin-right: ${({ theme }) => theme.spacing.s4};
      }
    }
  }

  .form-submit-container {
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
  }

  .divider {
    height: 0.1rem;
    margin: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    background: ${({ theme }) => theme.color.backgroundLayout.line};
    &.add-spacing {
      margin-top: ${({ theme }) => theme.spacing.s24};
    }
    &::after {
      height: 0;
    }
  }
`;

const ContainerStyled = styled.div`
  .form-field-container {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    margin-bottom: ${({ theme }) => theme.spacing.s12};
    label {
      display: flex;
    }
    &:first-child {
      display: flex;
      justify-content: space-between;
      gap: ${({ theme }) => theme.spacing.s12};
      padding-top: 0;
    }
  }
`;

const WrapperStyled = styled.div`
  .form-chip-container {
    display: flex;
    align-items: center;
    .chip-wrapper {
      width: calc(100% - 7.5rem);
      height: 6.4rem;
      padding: ${({ theme }) => `${theme.spacing.s12} 0`};
      mask-image: ${({ theme }) =>
        `linear-gradient(90deg, ${theme.light.color.white} 0%, ${theme.light.color.white} 95.3%, rgba(255, 255, 255, 0.00) 100%)`};
    }
    .button-wrapper {
      display: flex;
      align-items: center;
      width: 6.3rem;
      height: 3.2rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      border-radius: ${({ theme }) => theme.radius.r6};
      ${Button} {
        &:disabled {
          color: ${({ theme }) => theme.color.text.textDisabled};
        }
        &:active {
          color: ${({ theme }) => theme.color.text.textDisabled};
          background: ${({ theme }) => theme.color.states.pressedCell};
        }
      }
    }
  }
`;

const NoticeWrapperStyled = styled.div`
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
  font: ${({ theme }) => theme.fontType.mediumB};
  color: ${({ theme }) => theme.color.text.textPrimary};
`;

const ArticleWrapperStyled = styled.ul`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s24}`};
  &:last-child {
    padding-bottom: ${({ theme }) => theme.spacing.s24};
  }
`;

const ArticleRowWrapperStyled = styled.div`
  display: flex;
`;

const ArticleBulletWrapperStyled = styled.span`
  min-width: 2.4rem;
  align-self: stretch;
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textSecondary};
`;

const ArticleTextWrapperStyled = styled.li`
  font: ${({ theme }) => theme.fontType.small};
  color: ${({ theme }) => theme.color.text.textSecondary};
`;
