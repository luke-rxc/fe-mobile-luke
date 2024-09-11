import range from 'lodash/range';
import { PrizmPayModel, toPrizmPayModel } from '@features/prizmPay/models';
import { PrizmPaySchema, PRIZM_PAY_CARD_TYPE } from '@features/prizmPay/schemas';
import { InterestFreeCardModel } from './InterestFreeCardModel';
import { InterestFreeCardSchema } from '../schemas';
import { DEFAULT_MINIMUM_INSTALLMENT_AMOUNT } from '../constants';

export interface CheckoutPrizmPayModel extends PrizmPayModel {
  installmentFreeMonthList: {
    label: string;
    value: number;
  }[];
  minimumPaymentAmount: number;
  disabled: boolean;
  badgeLabel: string;
  cardTypeLabel: string;
}

export function toCheckoutPrizmPayModel(
  schema: PrizmPaySchema,
  interestFreeCard?: InterestFreeCardSchema,
): CheckoutPrizmPayModel {
  return {
    ...toPrizmPayModel(schema),
    installmentFreeMonthList: getOptions(
      interestFreeCard?.installmentFreeMonthList ?? [],
      schema.maxInstallmentMonth ?? 1,
    ),
    minimumPaymentAmount: interestFreeCard?.minimumPaymentAmount ?? DEFAULT_MINIMUM_INSTALLMENT_AMOUNT,
    disabled: schema.isDeprecated || schema.isExpired,
    badgeLabel: getBadgeLabel(schema),
    cardTypeLabel: getCardLabel(schema),
  };
}

function getBadgeLabel(card: PrizmPaySchema) {
  if (card.isDeprecated) {
    return '사용불가';
  }

  if (card.isExpired) {
    return '기간만료';
  }

  if (card.isDefault) {
    return '주카드';
  }

  return '';
}

function getCardLabel(card: PrizmPaySchema) {
  if (card.cardType === PRIZM_PAY_CARD_TYPE.CHECK_CARD) {
    return 'CHECK';
  }
  if (card.cardType === PRIZM_PAY_CARD_TYPE.GIFT_CARD) {
    return 'GIFT';
  }

  return '';
}

function getInstallmentMonthStart(list: number[]) {
  const first = list.slice(-1)[0];

  if (first) {
    return first + 1;
  }

  return 2;
}

function getOptions(installmentFreeMonthList: InterestFreeCardModel['installmentFreeMonthList'], maxMonth: number) {
  const underMaxMonthInstallmentFreeList = installmentFreeMonthList.filter((m) => m <= maxMonth);
  const start = getInstallmentMonthStart(underMaxMonthInstallmentFreeList);
  const right = range(start, maxMonth + 1).map((month) => ({ label: `${month}개월`, value: month }));
  const list = [{ label: '일시불', value: 1 }]
    .concat(underMaxMonthInstallmentFreeList.map((month) => ({ label: `${month}개월 무이자`, value: month })))
    .concat(right);

  return list;
}
