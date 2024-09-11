import { baseApiClient } from '@utils/api';
import { UploadContentResponse, UploadDomainType, UploadFileType } from '@models/UploadModel';
import qs from 'qs';
import { UserJoinSchema } from '../schemas';
import { SSOAccountInfo } from '../types';

export interface SocialJoinRequestParam {
  ssoType: string;
  isJoinAgeRequirement: boolean;
  isAdReceiveAgree: boolean;
  email: string;
  ssoId: string;
  ssoAccountInfo?: SSOAccountInfo;
}

export interface EmailJoinRequestParam {
  isJoinAgeRequirement: boolean;
  isAdReceiveAgree: boolean;
  email: string;
  code: string;
  ssoAccountInfo?: SSOAccountInfo;
}

export interface EmailVerifyRequestParam {
  email: string;
  code: string;
}

export interface UploadFileByUrlRequestParam {
  domainType: UploadDomainType;
  fileType: UploadFileType;
  fileURL: string;
}

export function executeSocialJoin(param: SocialJoinRequestParam): Promise<UserJoinSchema> {
  return baseApiClient.post('/v1/user/sso', param);
}

export function executeEmailJoin(param: EmailJoinRequestParam): Promise<UserJoinSchema> {
  return baseApiClient.post('/v1/user', param);
}

export function executeEmailVerify(param: EmailVerifyRequestParam): Promise<void> {
  return baseApiClient.post('/v1/user/auth/verify', param);
}

export const updateUserProfileImage = (profileImageId: number) => {
  return baseApiClient.put(`/v1/user/profile-image/${profileImageId}`);
};

export const uploadFileByUrl = (param: UploadFileByUrlRequestParam): Promise<UploadContentResponse> => {
  const query = qs.stringify(param);
  return baseApiClient.post(`/v1/file/url?${query}`);
};
