import { PGResult, PG_TYPE } from '../types';
import { IMPQueryParams, imp } from './imp';
import { KakaoQueryParams, kakao } from './kakao';
import { prizmPay } from './prizmPay';
import { TossQueryParams, toss } from './toss';

const UnknownPGResult = (): PGResult => ({
  isFail: () => true,
  isUserCancel: () => true,
  approve: async () => false,
});

export type Support = {
  [PG_TYPE.IMP]: IMPQueryParams;
  [PG_TYPE.TOSS]: TossQueryParams;
  [PG_TYPE.KAKAO]: KakaoQueryParams;
  [PG_TYPE.PRIZM]: unknown;
  [PG_TYPE.UNKNOWN]: unknown;
};

type SupportedPGType = {
  [key in keyof Support]: (params: Support[key]) => PGResult;
};

export const SupportedPGResult: SupportedPGType = {
  [PG_TYPE.IMP]: (params) => imp(params),
  [PG_TYPE.TOSS]: (params) => toss(params),
  [PG_TYPE.KAKAO]: (params) => kakao(params),
  [PG_TYPE.PRIZM]: () => prizmPay(),
  [PG_TYPE.UNKNOWN]: UnknownPGResult,
};
