import { userAgent } from '@utils/ua';
import { getUniversalLink } from '@utils/link';
import { UniversalLinkTypes } from '@constants/link';
import { RegionShortcutSchema } from '../schemas';
import { RegionShortcutListProps } from '../components';

export type RegionShortcutListModel = RegionShortcutListProps;

export const toRegionShortcutListModel = (
  schema: RegionShortcutSchema,
  { showroomId: sectionId }: { showroomId: number },
): RegionShortcutListModel => {
  const toSectionShowroomLink = (rootPlace: string) => {
    const { isApp } = userAgent();

    const { app, web } = getUniversalLink(UniversalLinkTypes.SECTION_SHOWROOM_REGION, {
      sectionId, // only web
      showroomId: sectionId, // only app
      sectionType: 'region',
      rootPlace,
    });

    return isApp ? app : web;
  };

  return {
    regions: (schema?.place || []).map(({ name }) => ({ name, link: toSectionShowroomLink(name) })),
  };
};
