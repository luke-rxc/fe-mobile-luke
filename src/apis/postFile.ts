import { UploadContentResponse } from '@models/UploadModel';
import { baseFormMultipartApi, baseUploadFormMultipartApi } from '@utils/api';

export const postFile = (formData: FormData) => baseFormMultipartApi.post<UploadContentResponse>('/v1/file', formData);

/**
 * 신규 파일 업로드 API
 * @link https://upload-dev.prizm.co.kr/swagger-ui/#/%EA%B3%B5%ED%86%B5%20-%20%ED%8C%8C%EC%9D%BC%20%EC%97%85%EB%A1%9C%EB%93%9C/dummyForOfficeFileUpload
 */
export const uploadFile = (formData: FormData) => {
  return baseUploadFormMultipartApi.post<UploadContentResponse>(`/uniform/file`, formData);
};
