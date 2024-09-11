import { baseApiClient } from '@utils/api';
import { UpdateProfileParam } from '../models';

export const updateProfile = (params: UpdateProfileParam) => {
  return baseApiClient.put(`/v1/user`, params);
};
