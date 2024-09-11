import type { DrawCommonSchema } from '@features/authentication/schemas';
import { baseApiClient } from '@utils/api';

export interface GetDrawStatusRequestParam {
  eventId: number;
}

export function getDrawStatus({ eventId }: GetDrawStatusRequestParam) {
  return baseApiClient.get<DrawCommonSchema>(`/v1/story/event/${eventId}`);
}
