/**
 * 티켓 DatePicker Field 정보타입
 */
export type TicketReservationFieldType = {
  label?: string;
  error?: boolean | string;
  value?: { exportId: number; bookingDate: number; stayNights: number };
};

/**
 * 티켓(숙박) 예약 날짜 캘린더 열기 => initialValues
 */
export type TicketCalendarInitialDataType = {
  type: string;
  data: {
    /** 출고ID */
    exportId: number;
  };
};

/**
 * 티켓(숙박) 예약 날짜 캘린더 닫기 => receiveValues
 */
export type TicketCalendarReceiveDataType = {
  type: string;
  data: {
    /** 출고ID */
    exportId: number;
    /** 캘린더에서 선택한 날짜(Field) 정보 */
    selectedDateInfo: TicketReservationFieldType;
  };
};
