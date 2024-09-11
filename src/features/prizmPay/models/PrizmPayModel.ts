import env from '@env';
import { PrizmPaySchema } from '../schemas';

export const CARD_FIELDS = {
  cardNo: '',
  mmYY: '',
  pass2word: '',
  birth: '',
  isDefault: false,
  alias: '',
};

export type CardFormFields = typeof CARD_FIELDS;
export type PrizmPayModel = PrizmPaySchema;

export function toPrizmPayModel(schema: PrizmPaySchema): PrizmPayModel {
  return { ...schema, logoPath: `${env.endPoint.cdnUrl}${schema.logoPath}` };
}

export function toPrizmPayListModel(schemas: PrizmPaySchema[]): PrizmPayModel[] {
  return schemas.map(toPrizmPayModel);
}
