import { AuthTokenSchema } from '@schemas/authTokenSchema';
import { UserSchema } from '@schemas/userSchema';
import { authApiClient } from '@utils/api';

export const executeReIssueToken = (): Promise<AuthTokenSchema & UserSchema> => {
  return authApiClient.get<AuthTokenSchema & UserSchema>('/v1/user/reissue-token');
};
