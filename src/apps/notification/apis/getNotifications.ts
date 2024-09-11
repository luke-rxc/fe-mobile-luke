import { baseApiClient } from '@utils/api';
// import { notifications } from './__mocks__';
import type { NotificationListSchema } from '../schemas';

interface GetNotificationsParams {
  size?: number;
  nextParameter?: string;
}

export const getNotifications = ({
  size = 20,
  nextParameter,
}: GetNotificationsParams): Promise<NotificationListSchema> => {
  const qs = nextParameter || `size=${size}`;

  return baseApiClient.get(`/v1/notification?${qs}`);

  // mocks
  // return Promise.resolve(notifications);
};
