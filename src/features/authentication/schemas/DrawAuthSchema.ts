export interface DrawCommonSchema {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  isDrawed: boolean;
  /** 응모 선착순 타입 */
  type: 'NORMAL' | 'LIMIT';
  /** NORMAL 일 경우 항상 true, LIMIT일경우 응답시점에 남은 수량 있는경우 true */
  isDrawable: boolean;
}

export interface DrawAuthSchema extends DrawCommonSchema {
  isAgreeNow: boolean;
}
