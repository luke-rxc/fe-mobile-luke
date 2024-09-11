import { baseApiClient } from '@utils/api';
import { UserAdultInfoSchema } from '../schemas';

export interface PostUserAdultInfoParams {
  /** 아임포트 응답값(imp_uid) */
  impUid: string;
  /** 체크할 나이값(dev환경에서만 동작) */
  checkAge?: number;
}

/** 성인인증 정보 */
export function getUserAdultInfo(): Promise<UserAdultInfoSchema> {
  return baseApiClient.get('/v1/user/identify/adult');
}

/** 성인인증 처리(완료페이지) */
export function postUserAdultInfo({ impUid, checkAge }: PostUserAdultInfoParams): Promise<'ok'> {
  const params = { impUid, checkAge };
  return baseApiClient.post<'ok'>('/v1/user/identify/adult', params);
}
