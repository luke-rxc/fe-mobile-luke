import { ACCESS_TOKEN, REFRESH_TOKEN } from '@constants/auth';
import { AuthTokenSchema } from '@schemas/authTokenSchema';
import { setLocalStorage } from '@utils/storage';

export const updateTokenLocalStorage = (param?: Pick<AuthTokenSchema, 'token' | 'refreshToken'>) => {
  setLocalStorage(ACCESS_TOKEN, param?.token ?? '');
  setLocalStorage(REFRESH_TOKEN, param?.refreshToken ?? '');
};
