import { GetShowroomSectionListParams } from '../apis';
import { SectionType } from '../types';
import { SectionTypes } from './section';

/**
 * Showroom Section Query Key
 */
export const ShowroomSectionQueryKeys = {
  all: [{ scope: 'showroom-section-key' }] as const,
  sections: (sectionId: GetShowroomSectionListParams['sectionId']) =>
    [{ ...ShowroomSectionQueryKeys.all[0], entity: sectionId }] as const,
  section: (sectionId: GetShowroomSectionListParams['sectionId'], type: SectionType) =>
    [{ ...ShowroomSectionQueryKeys.sections(sectionId)[0], type }] as const,
  sectionGoods: (params: GetShowroomSectionListParams) =>
    [{ ...ShowroomSectionQueryKeys.section(params.sectionId, SectionTypes.GOODS)[0], params }] as const,
  sectionFilter: (sectionId: GetShowroomSectionListParams['sectionId']) =>
    [{ ...ShowroomSectionQueryKeys.sections(sectionId)[0], sub: 'filter' }] as const,
} as const;
