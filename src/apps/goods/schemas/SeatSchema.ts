import { SeatFloatingType, SeatObjectType } from '../constants/seats';
import { OptionInfoSchema } from './OptionSchema';

export interface SeatInfoCommonSchema {
  goodsId: number;
  scheduleId: number;
  userMaxPurchaseEa: number;
  scheduleAt: number;
  showAreaTab: boolean;
  mapImage: SeatMapImageSchema;
  floatingObjects: Array<keyof typeof SeatFloatingType>;
  layouts: LayoutSchema[][];
}

export interface AllSeatInfoSchema extends SeatInfoCommonSchema {
  areaList: AreaSchema[];
}

export interface SingleSeateInfoSchema extends SeatInfoCommonSchema {
  area: AreaSchema;
}

export interface SeatMapImageSchema {
  id: number;
  path: string;
  blurHash: string | null;
  width: number;
  height: number;
  fileType: 'IMAGE';
  extension: string;
}

export interface AreaSchema {
  scheduleId: number;
  areaName: string;
  orderAbleLayoutCount: number;
  displayPrice: number;
  displayStage: boolean;
}

export interface LayoutSchema {
  id: number;
  names: string[];
  object: keyof typeof SeatObjectType;
  enable: boolean;
  locked: boolean;
  selectedValue: string;
  option: null | OptionInfoSchema;
}

export interface LayoutLockSchema {
  goodsId: number;
  scheduleId: number;
  layoutId: number;
  expiredDate: number;
}
