import isEmpty from 'lodash/isEmpty';
import { formatInTimeZone } from '@utils/date';
import { AdditionalInfoSectionTitle, AdditionalInfoUISectionType } from '../constants';
import { AdditionalInfoSchema, AirlineTicketInfoSchema, InputFormOptionSchema } from '../schemas';
import { AdditionalInfoCommonModel, AirlineTicketItemModel, InputOptionItemModel } from '../types';
import { handleChangeFormat } from '../utils';

export const toAdditionalInfoModel = (data: AdditionalInfoSchema): AdditionalInfoCommonModel | undefined => {
  if (!isEmpty(data)) {
    const { sectionType, inputFormOptionList, isSubmitInputForm } = data;
    return {
      title: AdditionalInfoSectionTitle[sectionType],
      sectionType: AdditionalInfoUISectionType[sectionType],
      inputFormOptionList: inputFormOptionList?.map((inputFormOption) => toInputFormOptionItemModel(inputFormOption)),
      isSubmitInputForm,
      isCompletedEntry: inputFormOptionList?.every(
        (inputFormOption) => inputFormOption.ea === inputFormOption.airlineTicketList.length,
      ),
    };
  }
  return undefined;
};

export const toInputFormOptionItemModel = (inputFormOption: InputFormOptionSchema): InputOptionItemModel => {
  const { id: optionId, goods, ticket, ea, inputFormType, airlineTicketList } = inputFormOption;
  return {
    optionId,
    goodsId: goods.id,
    goodsName: goods.name,
    title: formatInTimeZone(ticket.bookingDate, 'yyyy. M. d(iii)'),
    options: goods.option.itemList.map(({ value }) => value),
    totalCount: ea,
    currentCount: airlineTicketList.length,
    inputFormType,
    airlineTicketList: airlineTicketList.map((airlineTicket) => toAirlineTicketItemModel(airlineTicket)),
  };
};

export const toAirlineTicketItemModel = (airlineTicket: AirlineTicketInfoSchema): AirlineTicketItemModel => {
  const { exportId, firstName, lastName, dob, sex, nationality, passportNumber, isInfantAccompanied } = airlineTicket;
  return {
    exportId,
    name: `${firstName} ${lastName}`,
    dob: handleChangeFormat(dob, true),
    sex: sex === 'MALE' ? '남성' : '여성',
    nationality: nationality.text,
    passportNumber,
    isInfantAccompanied,
    detailInfo: airlineTicket,
  };
};
