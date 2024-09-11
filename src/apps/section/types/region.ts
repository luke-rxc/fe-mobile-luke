/** 날짜 receive type */
export interface ScheduleReceiveDataType {
  startDate: number;
  endDate: number;
  label?: string;
}

/** 지역/날짜 브릿지모달 receive type */
export interface RegionScheduleInitialDataType extends Pick<ScheduleReceiveDataType, 'startDate' | 'endDate'> {
  rootPlace: string;
}

/** 지역/날짜 data Type */
export interface RegionScheduleType {
  region: RegionScheduleInitialDataType['rootPlace'];
  schedule: ScheduleReceiveDataType;
}
