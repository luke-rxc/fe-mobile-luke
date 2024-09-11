import { baseApiClient } from '@utils/api';
import { ContentType } from '@constants/content';
import type { ContentEventSchema, ContentHistorySchema, ContentSchema } from '../schema';

/**
 * 콘텐츠 조회
 * @param contentType
 * @param code
 * @returns
 */
export const getContent = (contentType: string, code: string): Promise<ContentSchema> => {
  return baseApiClient.get<ContentSchema>(`v1/story/${code}?type=${contentType}`);
};

/**
 * 미리보기
 * - 공개/비공개상태와는 별개로 오피스에서 상시 조회 가능
 */
export const getPreviewContent = ({
  contentType,
  code,
  uuid,
  dateTime,
}: {
  contentType: ContentType;
  code: string;
  uuid: string;
  dateTime: string;
}): Promise<ContentSchema> => {
  const dateValue = dateTime ? new Date(dateTime).getTime() : '';
  return baseApiClient.get<ContentSchema>(`v1/story/${code}/preview/${uuid}?type=${contentType}&dateTime=${dateValue}`);
};

export const postContentEvent = (eventCode: string): Promise<ContentEventSchema> => {
  return baseApiClient.post(`/v1/event/kiosk/${eventCode}`);
};

export const postContentHistory = (contentNo: number): Promise<ContentHistorySchema> => {
  const params = { storyId: contentNo };
  return baseApiClient.post(`/v1/story/history`, params);
};
