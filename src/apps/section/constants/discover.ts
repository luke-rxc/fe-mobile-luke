import { SectionType } from '../types';
import {
  GetDiscoverSectionBaseParams,
  GetDiscoverSectionLiveParams,
  GetDiscoverSectionGoodsParams,
  GetDiscoverSectionContentParams,
  GetDiscoverSectionShowroomParams,
} from '../apis';
import { SectionTypes } from './section';

/**
 * Section Query Key
 */
export const DiscoverQueryKeys = {
  all: [{ scope: 'discover-section-key' }] as const,
  sections: (sectionId: GetDiscoverSectionBaseParams['sectionId']) =>
    [{ ...DiscoverQueryKeys.all[0], entity: sectionId }] as const,
  section: (sectionId: GetDiscoverSectionBaseParams['sectionId'], type: SectionType) =>
    [{ ...DiscoverQueryKeys.sections(sectionId)[0], type }] as const,
  sectionLive: (params: GetDiscoverSectionLiveParams) =>
    [{ ...DiscoverQueryKeys.section(params.sectionId, SectionTypes.LIVE)[0], params }] as const,
  sectionGoods: (params: GetDiscoverSectionGoodsParams) =>
    [{ ...DiscoverQueryKeys.section(params.sectionId, SectionTypes.GOODS)[0], params }] as const,
  sectionContent: (params: GetDiscoverSectionContentParams) =>
    [{ ...DiscoverQueryKeys.section(params.sectionId, SectionTypes.CONTENT)[0], params }] as const,
  sectionShowroom: (params: GetDiscoverSectionShowroomParams) =>
    [{ ...DiscoverQueryKeys.section(params.sectionId, SectionTypes.SHOWROOM)[0], params }] as const,
  sectionFilter: (sectionId: GetDiscoverSectionBaseParams['sectionId'], type: SectionType) =>
    [{ ...DiscoverQueryKeys.sections(sectionId)[0], type, sub: 'filter' }] as const,
} as const;
