import { baseApiClient } from '@utils/api';
import { DrawAuthSchema } from '@features/authentication/schemas';

export interface DrawAuthenticationRequestParam {
  code: string;
  eventId: string | number;
}

export function drawAuthentication({ code, eventId }: DrawAuthenticationRequestParam) {
  return baseApiClient.post<DrawAuthSchema>(`/v1/story/${code}/event/${eventId}`);
}
