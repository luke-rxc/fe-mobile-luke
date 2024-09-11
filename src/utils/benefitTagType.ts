import camelCase from 'lodash/camelCase';
import { TagType } from '@pui/prizmOnlyTag';

/**
 * 파리마터로 받은 문자열을 PrizmOnlyTag 컴포넌트의
 * tagType props 값으로 변환하여 반환합니다.
 *
 * @returns 'prizmOnly' | 'liveOnly' | 'none'
 * @example ```
 * console.log(getBenefitTagType('NONE')); // none
 * console.log(getBenefitTagType('PRIZM_ONLY')); // prizmOnly
 * console.log(getBenefitTagType('LIVE_ONLY')); // liveOnly
 * console.log(getBenefitTagType('PRIZM_PKG')); // none
 * console.log(getBenefitTagType('PRIZM_PKG', 'prizmOnly')); // prizmOnly
 * ```
 */
export const getBenefitTagType = (tagType: string, defaultValue: TagType = 'none'): TagType => {
  const type = camelCase(tagType) as TagType;

  if (type === 'none' || type === 'prizmOnly' || type === 'liveOnly') {
    return type;
  }

  return defaultValue;
};
