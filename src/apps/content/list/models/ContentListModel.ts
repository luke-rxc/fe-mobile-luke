import isEmpty from 'lodash/isEmpty';
import { ContentListInfoSchema, ContentListSchema } from '../schema';

export type ContentListModel = Pick<
  ContentListInfoSchema,
  'id' | 'name' | 'code' | 'contentType' | 'image' | 'startDate' | 'isActive'
>;

/**
 * 쇼룸 딜 리스트 데이터
 */
export const toContentListModel = (contents: ContentListSchema): ContentListModel[] => {
  return isEmpty(contents?.content)
    ? []
    : contents.content.map(({ id, name, code, contentType, image, startDate, isActive }) => {
        return {
          id,
          name,
          code,
          contentType,
          image,
          startDate,
          isActive,
        };
      });
};
