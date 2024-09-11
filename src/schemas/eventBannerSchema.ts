import { MediaSchema } from './mediaSchema';

interface EventBannerLandingSchema {
  referenceId: number;
  /** Deep Link */
  schema: string;
  /** Web Link */
  web: string;
}

export interface EventBannerSchema {
  /**
   * Banner Type
   * @todo 차후 타입의 종류가 늘어나면 Type화 진행
   */
  commonBannerType: string;
  /** banner id */
  id: number;
  /** banner Title */
  title: string;
  /** banner Sub Title */
  subTitle: string;
  /** bg color */
  bgColor: string;
  /** text color */
  textColor: string;
  /** banner Media 1 */
  layerFile: MediaSchema;
  /** banner Media 1 Loop 여부 */
  layerLoop: boolean;
  /** banner Media 2 (optional) */
  layer2File?: MediaSchema;
  /** banner Media 2 Loop 여부 */
  layer2Loop: boolean;
  /** 정렬 번호 */
  sortNum: number;
  /**
   * banner landing
   * @todo 랜딩 부분의 필수여부는 차후 오피스 운영시 결정
   */
  landing?: EventBannerLandingSchema;
}
