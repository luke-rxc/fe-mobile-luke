import { ShowroomSimpleSchema } from '../schemas';
import { ImageModel, toImageModel } from './LiveModel';

export interface FollowInfoModel {
  id: number;
  timedMetaDate: number;
  showroom?: ShowroomSimpleModel;
}

export interface ShowroomFollowModel {
  awaiter: FollowInfoModel | null;
  runner: FollowInfoModel | null;
}

/**
 * 쇼룸 심플 model
 */
export interface ShowroomSimpleModel extends ShowroomSimpleSchema {
  primaryImage: ImageModel;
}

/**
 * 쇼룸 심플 schema => 쇼룸 심플 model convert
 */
export const toShowroomSimpleModel = (item: ShowroomSimpleSchema): ShowroomSimpleModel => {
  return {
    ...item,
    primaryImage: toImageModel(item.primaryImage),
  };
};
