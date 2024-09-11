import { userAgent } from '@utils/ua';
import { isAppVersionLatestCheck } from '@utils/web2App';

const { isApp } = userAgent();

/** Web Header 사이즈 */
export const WebHeaderHeight = 56;

/** 더보기 라벨명 체크 */
export const MoreLabel = !isApp || isAppVersionLatestCheck('1.20.0') ? '더보기' : '전체';
