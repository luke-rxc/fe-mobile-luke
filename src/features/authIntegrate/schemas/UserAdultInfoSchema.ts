export interface UserAdultInfoSchema {
  isAdult: boolean;
  // 인증이 되어 있는 상태는 null
  merchantId: string | null;
  // 인증이 되어 있는 상태는 null
  shopId: string | null;
}
