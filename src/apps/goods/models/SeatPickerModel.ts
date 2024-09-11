import { SeatFloatingType } from '../constants';
import { AllSeatInfoSchema, AreaSchema, LayoutSchema, SingleSeateInfoSchema } from '../schemas';

export interface SeatInfoModel {
  goodsId: number | null;
  scheduleId: number | null;
  userMaxPurchaseEa: number;
  scheduleAt: number | null;
  showAreaTab: boolean | null;
  image: {
    path: string | null;
    blurHash: string | null;
  };
  floatingObjects: Array<keyof typeof SeatFloatingType>;
  displayStage: boolean | undefined;
  selectedArea: AreaSchema | undefined;
  areaList: AreaSchema[];
  layouts: LayoutSchema[][];
}

export interface SelectSeatHandlerProps {
  seatData: LayoutSchema;
  callback: (isSelectedSeats: boolean) => void;
}

export const toSeatInfoModel = (seatInfo: AllSeatInfoSchema, selectedScheduleId: number | null): SeatInfoModel => {
  const {
    goodsId,
    scheduleId,
    scheduleAt,
    userMaxPurchaseEa,
    showAreaTab,
    mapImage,
    floatingObjects,
    areaList,
    layouts,
  } = seatInfo;
  const selectedArea = areaList.find((data) =>
    selectedScheduleId ? data.scheduleId === selectedScheduleId : data.scheduleId === scheduleId,
  );
  return {
    goodsId,
    scheduleId,
    scheduleAt,
    userMaxPurchaseEa,
    showAreaTab,
    image: {
      path: mapImage.path,
      blurHash: mapImage.blurHash,
    },
    floatingObjects,
    displayStage: selectedArea?.displayStage,
    selectedArea,
    areaList,
    layouts,
  };
};

export const toSingleSeatInfoModel = (seatInfo: SingleSeateInfoSchema): SeatInfoModel => {
  const { goodsId, scheduleId, scheduleAt, userMaxPurchaseEa, showAreaTab, mapImage, floatingObjects, area, layouts } =
    seatInfo;
  return {
    goodsId,
    scheduleId,
    scheduleAt,
    userMaxPurchaseEa,
    showAreaTab,
    image: {
      path: mapImage.path,
      blurHash: mapImage.blurHash,
    },
    floatingObjects,
    selectedArea: area,
    displayStage: area.displayStage,
    areaList: [area],
    layouts,
  };
};
