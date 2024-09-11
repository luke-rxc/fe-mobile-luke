import { ContentListItemProps } from '@pui/contentListItem';
import { ContentsHistoryListSchema } from '../schemas';

export const toContentsHistoryListModel = ({ content }: ContentsHistoryListSchema): ContentListItemProps[] => {
  return content.map((item) => {
    const { code, contentType, id, image, isActive, name, showRoom, startDate } = item;
    const { path, blurHash } = image;

    return {
      code,
      contentType,
      id,
      name,
      showroomCode: showRoom?.code,
      startDate,
      imageProps: {
        path,
        blurHash: blurHash ?? null,
      },
      release: isActive,
    };
  });
};
