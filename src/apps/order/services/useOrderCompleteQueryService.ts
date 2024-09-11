import { useParams } from 'react-router-dom';
import { useQueryString } from '@hooks/useQueryString';
import { CHECKOUT_TYPE, CheckoutType, PG_TYPE } from '../types';
import { IMPQueryParams, KakaoQueryParams, TossQueryParams } from '../utils';

type PGQueryFields =
  | ({
      pg_type: typeof PG_TYPE['IMP'];
    } & IMPQueryParams)
  | ({
      pg_type: typeof PG_TYPE['TOSS'];
    } & TossQueryParams)
  | ({
      pg_type: typeof PG_TYPE['KAKAO'];
    } & KakaoQueryParams)
  | {
      pg_type: typeof PG_TYPE['PRIZM'];
    };

type QueryStringFields = {
  type?: CheckoutType;
  auction_id?: string;
  goods_code?: string;
  checkout_id?: string;
  expired_date?: number;
} & PGQueryFields;

type RouteParam = {
  id: string;
};

export const useOrderCompleteQueryService = () => {
  const queryString = useQueryString<QueryStringFields>();
  const queryParams = useParams<RouteParam>();

  return {
    ...queryString,
    auctionId: queryString.auction_id,
    goodsCode: queryString.goods_code,
    checkoutId: queryString.checkout_id ? Number(queryString.checkout_id) : undefined,
    orderId: queryParams.id,
    pgType: queryString.pg_type ?? PG_TYPE.UNKNOWN,
    type: queryString.type ?? CHECKOUT_TYPE.DEFAULT,
    expiredDate: queryString.expired_date ? Number(queryString.expired_date) : undefined,
  };
};
