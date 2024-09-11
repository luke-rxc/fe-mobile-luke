import get from 'lodash/get';
import toString from 'lodash/toString';
import { BannerItemModel, ShortcutListItemModel, FeedItemModel } from './MainModel';

export const toBannerListLogModel = (banner: BannerItemModel) =>
  ({
    contents_name: banner.title,
    contents_id: toString(banner.id),
    contents_type: toString(get(banner, 'data-type')),
    landing_scheme: toString(get(banner, 'data-landing-schema')),
    contents_index: get(banner, 'data-index'),
  } as const);

export const toShortcutLogModel = (shortcut: ShortcutListItemModel) =>
  ({
    banner_id: toString(get(shortcut, 'data-banner-id')),
    banner_type: toString(get(shortcut, 'data-banner-type')),
    banner_name: toString(get(shortcut, 'data-banner-name')),
    contents_id: toString(shortcut.id),
    contents_name: shortcut.title,
    landing_scheme: shortcut.link,
    contents_type: shortcut['data-type'],
    contents_index: shortcut['data-index'],
  } as const);

export const toSectionLogModel = (section: FeedItemModel) =>
  ({
    section_type: section.type,
    section_name: section.title,
    section_description: section.subtitle,
    section_id: toString(section.sectionId),
    display_type: toString(get(section, 'data-display-type')),
    section_index: get(section, 'data-section-index'),
  } as const);
