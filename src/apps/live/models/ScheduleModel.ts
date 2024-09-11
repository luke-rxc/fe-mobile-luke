import env from '@env';
import { LiveListItemProps } from '@pui/liveListItem';
import { getImageLink } from '@utils/link';
import { LiveFeedSectionItemSchema, ScheduleImageSchema, ScheduleItemSchema } from '../schemas';
import { toDateFormatForSchedule } from '../utils';
import { ShowroomSimpleModel, toShowroomSimpleModel } from './ShowroomModel';

/**
 * 편성표 image model
 */
export interface ScheduleImageModel extends ScheduleImageSchema {
  fullPath: string;
}

/**
 * 편성표 item model
 */
export interface ScheduleItemModel extends ScheduleItemSchema {
  bgImage: ScheduleImageModel;
  chromakeyImage: ScheduleImageModel;
  svgLogo?: ScheduleImageModel;
  scheduleDateText: string;
  itemIndex: number;
  showRoom: ShowroomSimpleModel;
}

/**
 * 라이브 피드 섹션 아이템 model
 */
export interface LiveFeedSectionItemModel extends Omit<LiveFeedSectionItemSchema, 'content'> {
  content: Array<ScheduleItemModel>;
}

/**
 * 편성표 image schema > 편성표 image model convert
 */
export const toScheduleImageModel = (item: ScheduleImageSchema): ScheduleImageModel => {
  return {
    ...item,
    fullPath: `${env.endPoint.cdnUrl}/${item.path}`,
  };
};

/**
 * 편성표 item schema > 편성표 item model convert
 */
export const toScheduleItemModel = (item: ScheduleItemSchema, index: number): ScheduleItemModel => {
  return {
    ...item,
    bgImage: toScheduleImageModel(item.bgImage),
    chromakeyImage: toScheduleImageModel(item.chromakeyImage),
    svgLogo: item.svgLogo && item.svgLogo.path ? toScheduleImageModel(item.svgLogo) : undefined,
    scheduleDateText: toDateFormatForSchedule(item.scheduleDate),
    showRoom: toShowroomSimpleModel(item.showRoom),
    itemIndex: index + 1,
  };
};

/**
 * 편성표 list schema > 편성표 list model convert
 */
export const toScheduleModalListModel = (items: Array<ScheduleItemSchema>): Array<ScheduleItemModel> => {
  return items.map(toScheduleItemModel);
};

/**
 * 편성표 item model > LiveListItemProps convert
 */
export const toLiveListItemProps = (item: ScheduleItemModel): LiveListItemProps => {
  return {
    onAir: item.liveSchedule.live.onAir,
    contentType: item.liveSchedule.live.contentsType,
    scheduleId: item.liveSchedule.live.id,
    title: item.title,
    scheduleDate: item.liveSchedule.live.liveStartDate,
    logoURL: item.svgLogo?.path && getImageLink(item.svgLogo.path),
    chromakeyURL: getImageLink(item.chromakeyImage.path, 512),
    backgroundURL: getImageLink(item.bgImage.path, 512),
    bgColorCode: item.bgColor,
    followed: item.liveSchedule?.isFollowed,
    showroomCode: item.showRoom?.code,
    profileURL: item.showRoom?.primaryImage.path && getImageLink(item.showRoom.primaryImage.path),
    landingType: item.landingType,
  };
};

/**
 * 편성표 list model > LiveListItemProps list convert
 */
export const toLiveListProps = (items: Array<ScheduleItemModel>): Array<LiveListItemProps> => {
  return items.map(toLiveListItemProps);
};

/**
 * 라이브 피드 섹션 list schema => 편성표 list model convert
 */
export const toLiveFeedSectionItemModel = (items: Array<LiveFeedSectionItemSchema>): Array<ScheduleItemModel> => {
  if (items.length === 0) {
    return [];
  }

  return items.flatMap((data) => data.content).map(toScheduleItemModel);
};
