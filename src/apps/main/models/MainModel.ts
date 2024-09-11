import { WebLinkTypes } from '@constants/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { getWebLink, getImageLink } from '@utils/link';
import { FeedType, AllViewLabelingCriteriaForFeed, MaximumNumberOfItemsDisplayedInFeed } from '../constants';
import {
  BannerProfileProps,
  BannerMediaProps,
  BannerListProps,
  BannerItemProps,
  ShortcutBannerProps,
  ShortcutBannerItemProps,
  FeedListProps,
  FeedItemProps,
  CategoryShortcutItemProps,
  CategoryShortcutListProps,
} from '../components';
import {
  BannerSchema,
  ShortcutSchema,
  FeedSchema,
  ContentFeedSchema,
  GoodsFeedSchema,
  LiveFeedSchema,
  ShowroomFeedSchema,
  CategoryShortcutSchema,
} from '../schemas';

export type BannerListModel = BannerListProps;
export type BannerItemModel = BannerItemProps;
export type BannerProfileModel = BannerProfileProps;
export type BannerMediaModel = BannerMediaProps;

export type ShortcutListModel = ShortcutBannerProps;
export type ShortcutListItemModel = ShortcutBannerItemProps;

export type CategoryShortcutListModel = CategoryShortcutListProps;
export type CategoryShortcutItemModel = CategoryShortcutItemProps;

export type FeedListModel = FeedListProps;
export type FeedItemModel = FeedItemProps;
export type LiveFeedModel = Extract<FeedItemProps, { type: typeof FeedType.LIVE }>;
export type GoodsFeedModel = Extract<FeedItemProps, { type: typeof FeedType.GOODS }>;
export type ContentFeedModel = Extract<FeedItemProps, { type: typeof FeedType.CONTENT }>;
export type ShowroomFeedModel = Extract<FeedItemProps, { type: typeof FeedType.SHOWROOM }>;

/**
 * 배너 리스트 모델
 */
export const toBannerListModel = (schema: BannerSchema[]): BannerItemModel[] => {
  return schema.map((banner, index) => {
    const { id, title, description, landing, type, showRoom } = banner;

    return {
      id: `${id}`,
      title,
      description,
      link: landing.web || '#none',
      mediaInfo: toBannerMediaModel(banner),
      profileInfo: toBannerProfileModel(banner),
      logoList: toBannerLogoModel(banner),
      // 이벤트 로깅을 위한 데이터
      'data-type': type,
      'data-index': index + 1,
      'data-landing': landing.scheme,
      'data-showroom-id': showRoom?.id,
      'data-showroom-name': showRoom?.name,
    };
  });
};

/**
 * 배너 미디어 모델
 */
const toBannerMediaModel = (schema: BannerSchema): BannerMediaModel => {
  const { path: src, blurHash, extension, fileType: type, thumbnailImage } = schema.primaryMedia;
  const path = getImageLink(src);
  const poster = thumbnailImage && { path: getImageLink(thumbnailImage.path), blurHash: thumbnailImage.blurHash };
  return { type, path, blurHash, extension, poster };
};

/**
 * 배너 프로필 모델
 */
const toBannerProfileModel = (schema: BannerSchema): BannerProfileModel => {
  const { showRoom, label, landing, type } = schema;
  const { liveId, liveTitle, onAir, primaryImage, code } = showRoom || {};

  return {
    landingLabel: label.name,
    landingLabelLink: landing.web || '#none',
    landingType: type,

    onAir,
    liveId,
    liveTitle,
    path: primaryImage && getImageLink(primaryImage.path),
    showroomCode: code,
    profileLink: showRoom && toBannerProfileLinkModel(showRoom),
  };
};

/**
 * 배너 로고 이미지 모델
 */
const toBannerLogoModel = (schema: BannerSchema) => {
  const { logoList } = schema;
  return logoList?.map((logo) => ({
    id: logo.id,
    path: getImageLink(logo.path),
  }));
};

/**
 * 배너 프로필 링크 생성
 */
const toBannerProfileLinkModel = (schema: Required<BannerSchema>['showRoom']): string => {
  const { liveId, onAir, code: showroomCode } = schema;
  return onAir ? getWebLink(WebLinkTypes.LIVE, { liveId }) : getWebLink(WebLinkTypes.SHOWROOM, { showroomCode });
};

/**
 * 숏컷 리스트 모델
 */
export const toShortcutListModel = (schema: ShortcutSchema): ShortcutListItemModel[] => {
  const { id, multiType, title } = schema;

  if (multiType === 'box') {
    return (schema.items || []).map((shortcut, index) => ({
      id: shortcut.id,
      title: shortcut.title,
      titleType: shortcut.titleType,
      description: shortcut.description,
      titleImage: shortcut.titleImage && {
        path: getImageLink(shortcut.titleImage.path),
      },
      primaryMedia: shortcut.primaryMedia && {
        ...shortcut.primaryMedia,
        path: getImageLink(shortcut.primaryMedia.path),
      },
      link: shortcut.landing.web || '',
      'data-index': index + 1,
      'data-type': shortcut.type,
      'data-banner-id': id,
      'data-banner-type': multiType,
      'data-banner-name': title,
    }));
  }

  return [];
};

/**
 * 카테고리 숏컷 리스트 모델
 */
export const toCategoryShortcutListMode = (schema: CategoryShortcutSchema[]): CategoryShortcutItemModel[] => {
  return schema.map(({ discoverCategoryId, title, image }, index) => ({
    id: `${discoverCategoryId}`,
    index,
    title,
    link: getWebLink(WebLinkTypes.SECTION_CATEGORY, { categoryId: discoverCategoryId }),
    image: getImageLink(image.path),
    blurHash: image.blurHash,
  }));
};

/**
 * 피드 리스트 모델
 */
export const toFeedListModel = (schema: FeedSchema[]): FeedItemModel[] => {
  return schema
    .flatMap(({ content }) => content)
    .reduce<FeedItemModel[]>((items, item, index) => {
      // 이벤트 로깅을 위한 데이터
      const loggingData = {
        'data-display-type': item.displayType,
        'data-section-index': index + 1,
      };

      // 상품
      if (item.type === FeedType.GOODS) {
        return [...items, { ...loggingData, ...toGoodsFeedModel(item) }];
      }

      // 콘텐츠
      if (item.type === FeedType.CONTENT) {
        return [...items, { ...loggingData, ...toContentFeedModel(item) }];
      }

      // 라이브
      if (item.type === FeedType.LIVE) {
        return [...items, { ...loggingData, ...toLiveFeedModel(item) }];
      }

      // 쇼룸
      if (item.type === FeedType.SHOWROOM) {
        return [...items, { ...loggingData, ...toShowroomFeedModel(item) }];
      }

      return items;
    }, []);
};

/**
 * 콘텐츠 아이템 모델
 */
const toContentFeedModel = (schema: ContentFeedSchema): ContentFeedModel => {
  const { type, title, subTitle: subtitle, sectionId, content } = schema;
  const sectionLink = toFeedAllViewLink(schema);

  const source = content.slice(0, MaximumNumberOfItemsDisplayedInFeed).map((item, index) => {
    const layoutType: ContentFeedModel['source'][0]['layoutType'] = content.length > 1 ? 'swipe' : 'none';

    return {
      layoutType,
      title: item.name,
      contentCode: item.code,
      contentType: item.type,
      startDate: item.startDate,
      endDate: item.endDate,
      image: {
        src: item.image.path && getImageLink(item.image.path, 768),
        blurHash: item.image.blurHash,
      },
      // 이벤트 로깅
      'data-index': index + 1,
      'data-content-id': item.id,
    };
  });

  return { type, title, subtitle, sectionId, sectionLink, source };
};

/**
 * 상품 아이템 모델
 */
const toGoodsFeedModel = (schema: GoodsFeedSchema): GoodsFeedModel => {
  const { type, title, subTitle: subtitle, sectionId, content } = schema;
  const sectionLink = toFeedAllViewLink(schema);

  const source = content.slice(0, MaximumNumberOfItemsDisplayedInFeed).map(({ brand, goods }, index) => {
    const { id, code, price, discountRate, name, primaryImage, hasCoupon, isRunOut, benefits } = goods;
    const { tagType, label: benefitLabel } = benefits || {};

    return {
      id: `${id}`,
      goodsCode: code,
      brandName: brand?.name ?? '',
      goodsName: name,
      price,
      discountRate,
      image: { src: primaryImage.path && getImageLink(primaryImage.path, 512), blurHash: primaryImage.blurHash },
      hasCoupon,
      benefitLabel,
      tagType: getBenefitTagType(tagType || ''),
      runOut: isRunOut,
      // 이벤트 로깅
      'data-index': index + 1,
    };
  });
  return { type, title, subtitle, sectionId, sectionLink, source };
};

/**
 * 라이브 아이템 모델
 */
const toLiveFeedModel = (schema: LiveFeedSchema): LiveFeedModel => {
  const { type, title, subTitle: subtitle, sectionId, content } = schema;
  const sectionLink = toFeedAllViewLink(schema);

  const source = content.slice(0, MaximumNumberOfItemsDisplayedInFeed).map((item, index) => ({
    web: item.web,
    scheme: item.scheme,
    onAir: item.liveSchedule?.live.onAir,
    liveId: item.liveSchedule?.live.id,
    contentCode: item.landingStory?.code,
    contentType: item.landingStory?.contentsType,
    title: item.title,
    scheduleId: item.id,
    scheduleDate: item.scheduleDate,
    logoURL: item.svgLogo?.path && getImageLink(item.svgLogo.path),
    chromakeyURL: getImageLink(item.chromakeyImage.path, 512),
    backgroundURL: getImageLink(item.bgImage.path, 512),
    bgColorCode: item.bgColor,
    followed: item.liveSchedule?.isFollowed,
    showroomCode: item.showRoom?.code,
    profileURL: item.showRoom?.primaryImage.path && getImageLink(item.showRoom.primaryImage.path),
    landingType: item.landingType,
    // 이벤트 로깅
    'data-index': index + 1,
    'data-landing-schema': item.web,
    'data-showroom-id': item.showRoom?.id,
    'data-showroom-name': item.showRoom?.id,
  }));
  return { type, title, subtitle, sectionId, sectionLink, source };
};

/**
 * 쇼룸 아이템 모델
 */
const toShowroomFeedModel = (schema: ShowroomFeedSchema): ShowroomFeedModel => {
  const { type, title, subTitle: subtitle, sectionId, content } = schema;
  const sectionLink = toFeedAllViewLink(schema);

  const source = content.slice(0, MaximumNumberOfItemsDisplayedInFeed).map((item, index) => ({
    title: item.name,
    showroomId: item.id,
    showroomCode: item.code,
    imageURL: item.primaryImage.path,
    onAir: item.onAir,
    liveId: item.liveId,
    followed: item.isFollowed,
    // 이벤트 로깅
    'data-index': index + 1,
  }));

  return { type, title, subtitle, sectionId, sectionLink, source };
};

/**
 * 피드 전체 보기 링크 생성
 */
const toFeedAllViewLink = ({ sectionId, type, content }: FeedSchema['content'][0]) => {
  if (content.length < AllViewLabelingCriteriaForFeed) {
    return undefined;
  }

  if (type === FeedType.GOODS) {
    return getWebLink(WebLinkTypes.SECTION_DISCOVER, { sectionId });
  }

  if (type === FeedType.CONTENT) {
    return getWebLink(WebLinkTypes.SECTION_DISCOVER, { sectionId, sectionType: 'content' });
  }

  return getWebLink(WebLinkTypes.SECTION_DISCOVER, { sectionId, sectionType: type.toLowerCase() });
};
