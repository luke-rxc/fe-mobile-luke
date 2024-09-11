import { baseApiClient } from '@utils/api';
import type { DrawCommonSchema } from '@features/authentication/schemas';

export interface GetDrawStatusRequestParam {
  eventId: number;
}

export function getDrawStatus({ eventId }: GetDrawStatusRequestParam) {
  return baseApiClient.get<DrawCommonSchema>(`/v1/story/event/${eventId}`);
}
