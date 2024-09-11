import { mobileWebApiClient } from '@utils/api';
import qs from 'qs';
import pickBy from 'lodash/pickBy';
import { LiveFeedSectionItemSchema, ScheduleItemSchema } from '../schemas';
import { LiveFeedSectionParams } from '../types';

/**
 * 편성표 모달 정보 조회
 */
export const getContentsSchedule = (): Promise<Array<ScheduleItemSchema>> => {
  return mobileWebApiClient.get<Array<ScheduleItemSchema>>(`/v2/contents-schedule`);
};

export const getFeedLiveSectionItem = ({
  sectionId,
  nextParameter = '',
  ...params
}: LiveFeedSectionParams): Promise<LiveFeedSectionItemSchema> => {
  const query = qs.stringify({ ...pickBy(params, Boolean), ...qs.parse(nextParameter) });
  return mobileWebApiClient.get<LiveFeedSectionItemSchema>(`/v1/discover/feed/${sectionId}/live?${query}`);
};
