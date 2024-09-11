export interface LatestViewGoodsSchema {
  brand?: {
    defaultShowRoomId?: number;
    id: number;
    name: string;
    primaryImage?: PrimaryImage;
  };
  goods: {
    code: string;
    consumerPrice: number;
    discountRate: number;
    id: number;
    label?: string;
    name: string;
    price: number;
    primaryImage: PrimaryImage;
    showRoomId: number;
    status: string;
    type: string;
    hasCoupon?: boolean;
    isRunOut: boolean;
    benefits?: {
      /** 태그 타입 */
      tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY';
      /** 혜택 라벨 */
      label: string;
    };
  };
}

export interface LatestViewGoodsSchemaList {
  content: LatestViewGoodsSchema[];
}

interface PrimaryImage {
  blurHash?: string;
  height: number;
  width: number;
  id: number;
  path: string;
}
