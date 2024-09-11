import isEmpty from 'lodash/isEmpty';
import { ContentListItemProps } from '@pui/contentListItem';
import { ContentSchema } from '../schemas';

/**
 * 쇼룸 딜 리스트 데이터
 */
export const toContentModel = (contents: ContentSchema): ContentListItemProps[] => {
  return isEmpty(contents?.content)
    ? []
    : contents.content.map(({ id, name, code, contentType, image, startDate, isActive }) => {
        return {
          id,
          name,
          code,
          contentType,
          imageProps: {
            path: image.path,
            blurHash: image.blurHash,
          },
          startDate,
          release: isActive,
        };
      });
};
