import { SectionType } from '../types';

/**
 * Section Type
 */
export const SectionTypes: { [Key in SectionType]: Key } = {
  LIVE: 'LIVE',
  GOODS: 'GOODS',
  CONTENT: 'CONTENT',
  SHOWROOM: 'SHOWROOM',
} as const;

/**
 * Section Tab Label
 */
export const SectionTabOptions = [
  { label: 'Goods', value: SectionTypes.GOODS },
  { label: 'Showroom', value: SectionTypes.SHOWROOM },
  { label: 'Content', value: SectionTypes.CONTENT },
  { label: 'Live', value: SectionTypes.LIVE },
];

/**
 * Section Empty Description
 */
export const EmptyDescription = {
  [SectionTypes.GOODS]: '등록된 상품이 없습니다',
  [SectionTypes.LIVE]: '등록된 콘텐츠가 없습니다',
  [SectionTypes.CONTENT]: '등록된 콘텐츠가 없습니다',
  [SectionTypes.SHOWROOM]: '등록된 쇼룸이 없습니다',
} as const;
