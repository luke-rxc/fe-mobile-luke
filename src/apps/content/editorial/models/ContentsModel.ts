import { ContentType } from '@constants/content';
import { GoodsNormalStatusType } from '@constants/goods';
import { WebHeaderProps } from '@features/landmark/components/header/WebHeader';
import { CommentProps } from '@features/landmark/components/quickMenu/Comment';
import { GoodsCardProps } from '@pui/goodsCard';
import { getImageLink } from '@utils/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import type {
  BannerDisplayModel,
  BannerProps,
  BlankDisplayModel,
  BlankProps,
  ContentInfoModel,
  CouponDownProps,
  CouponDownDisplayModel,
  CouponFollowProps,
  CouponFollowDisplayModel,
  CtaDisplayModel,
  CtaProps,
  DealListADisplayModel,
  DealListAGoodsModel,
  DealListAProps,
  DealListBDisplayModel,
  DealListBGoodsModel,
  DealListBProps,
  DrawADisplayModel,
  DrawAProps,
  FooterDisplayModel,
  FooterProps,
  HeaderDisplayModel,
  HeaderProps,
  ImageViewerDisplayModel,
  ImageViewProps,
  MediaADisplayModel,
  MediaAProps,
  MediaBDisplayModel,
  MediaBProps,
  MediaViewerADisplayModel,
  MediaViewerAProps,
  MediaViewerBDisplayModel,
  MediaViewerBProps,
  PlayViewerDisplayModel,
  PlayViewerProps,
  ReplyDisplayModel,
  ReplyProps,
  ShowroomModel,
  TextADisplayModel,
  TextAProps,
  PresetContents,
  PresetModel,
  PresetDisplayTypes,
  NavigationProps,
  NavigationDisplayModel,
  VoteAProps,
  VoteADisplayModel,
  BenefitGoodsBProps,
  BenefitGoodsBDisplayModel,
  BenefitGoodsAProps,
  BenefitGoodsADisplayModel,
  BenefitListADisplayModel,
  BenefitListAProps,
  EmbedVideoAProps,
  EmbedVideoADisplayModel,
} from '.';
import { PresetType, CommentPageType, ContentStatusType } from '../constants';
import {
  ComponentListSchema,
  GoodsSchema,
  ContentSchema,
  GoodsBrandSchema,
  GoodsItemSchema,
  LiveSchema,
} from '../schema';
import { getStatusVisible } from '../utils';

/**
 * 컨텐츠 전체 정보
 */
export type ContentModel = {
  code: string; // 컨텐츠 코드
  componentList: PresetModel<PresetContents>[]; // 컴포넌트 리스트
  contentName: string; // 컨텐츠명
  contentNo: number; // 컨텐츠 Id
  publicStartDate: number; // 공개 시작일
  publicEndDate: number; // 공개 종료일
  showroom: ShowroomModel; // 쇼룸 정보
  type: ContentType; // 컨텐츠 타입
  status: ContentStatusType; // 컨텐츠 공개 상태
  keywordList: ContentKeywordModel[]; // 컨텐츠 키워드리스트
  replyCount: number; // 댓글 카운트
  seo: ContentSeoModel; // SEO
  live: LiveModel; // 편성 라이브 정보
};

export type ContentKeywordModel = {
  id: number;
  name: string;
};

/**
 * 헤더
 */
export type HeaderModel = WebHeaderProps & {
  showroomCode?: string;
  commentInfo?: CommentProps;
};

/**
 * 컨텐츠 SEO 정보
 */
export type ContentSeoModel = {
  title: string;
  description: string;
  image?: string;
  keywords: string[];
  url: string;
};

export type PresetSectionModel = {
  /** 프리셋 섹션별 index */
  sectionIndex: number;
  /** 네비게이션 컴포넌트 index */
  navigationIndex: number;
  /** 프리셋 리스트 */
  presets: PresetModel<PresetContents>[][];
};

/**
 * 컨텐츠 데이터 매핑
 * @param data
 * @returns
 */
export const toContentsData = (
  data: ContentSchema | undefined,
  options: {
    /** 컨텐츠 페이지 딥링크 url */
    deepLink: string;
    /** 컴포넌트 노출을 위한 기준 시간 */
    displayDateTime: string;
  },
): ContentModel | null => {
  if (!data) {
    return null;
  }
  // 컨텐츠 공통정보
  const {
    code,
    componentList,
    contentName,
    contentNo,
    publicEndDate,
    publicStartDate,
    showroom,
    status,
    type,
    keywordList,
    replyCount,
    primaryImage: contentImage,
    live,
  } = data;

  const {
    id: showroomId,
    name: showroomName,
    primaryImage: showroomImage,
    brand,
    code: showroomCode,
    onAir,
    liveId,
    isFollow,
    notice = '',
    backgroundColor,
    contentColor,
    textColor,
    tintColor,
  } = showroom;

  const contentShowroom: ShowroomModel = {
    showroomId,
    showroomCode,
    showroomName,
    showroomImage: showroomImage ? { ...showroomImage } : { blurHash: '', width: 0, height: 0, id: 0, path: '' },
    brand,
    onAir,
    liveId,
    notice,
    isFollow,
    backgroundColor,
    contentColor,
    textColor,
    tintColor,
  };

  const contentInfo: Omit<ContentInfoModel, 'contentIndex' | 'presetType'> = {
    contentId: contentNo,
    contentName,
    contentCode: code,
    contentType: type,
  };

  const { deepLink, displayDateTime } = options;

  // 컴포넌트 리스트
  const compList = componentList.map((comp: ComponentListSchema, index) => {
    const contentInfos: Omit<ContentInfoModel, 'presetType'> = { ...contentInfo, contentIndex: index };
    switch (comp.componentType) {
      case PresetType.BANNER:
        return toContentsBannerComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.BENEFIT_GOODS_A:
        return toContentsBenefitGoodsAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.BENEFIT_GOODS_B:
        return toContentsBenefitGoodsBComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.BENEFIT_LIST_A:
        return toContentsBenefitListAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.BLANK:
        return toContentsBlankComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.COUPON_DOWN:
        return toContentsCouponDownComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
          deepLink,
        });
      case PresetType.COUPON_FOLLOW:
        return toContentsCouponFollowComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
          deepLink,
        });
      case PresetType.CTA:
        return toContentsCTAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          deepLink,
          displayDateTime,
        });
      case PresetType.DEAL_A:
        return toContentsDealAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.DEAL_B:
        return toContentsDealBComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.DRAW_A:
        return toContentsDrawAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.EMBED_VIDEO_A:
        return toContentsEmbedVideoAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.FOOTER:
        return toContentsFooterComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          showroom: contentShowroom,
        });
      case PresetType.HEADER:
        return toContentsHeaderComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
        });
      case PresetType.IMAGE_VIEWER:
        return toContentsImageViewerComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.MEDIA_A:
        return toContentsMediaAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.MEDIA_B:
        return toContentsMediaBComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.MEDIA_VIEWER_A:
        return toContentsMediaViewerAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.MEDIA_VIEWER_B:
        return toContentsMediaViewerBComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.NAVIGATION:
        return toContentsNavigationComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          showroom: contentShowroom,
        });
      case PresetType.PLAY_VIEWER:
        return toContentsPlayViewerComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.REPLY:
        return toContentsReplyComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          deepLink,
          displayDateTime,
        });
      case PresetType.TEXT:
        return toContentsTextComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
          displayDateTime,
        });
      case PresetType.VOTE_A:
        return toContentsVoteAComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
        });
      default:
        return toContentsComponent({
          componentInfo: comp,
          contentInfo: contentInfos,
        });
    }
  });

  return {
    code,
    componentList: compList,
    contentName,
    contentNo,
    publicStartDate,
    publicEndDate,
    showroom: {
      ...contentShowroom,
    },
    live,
    type,
    status,
    keywordList,
    replyCount,
    seo: {
      title: contentName,
      description: contentName,
      image: contentImage?.path && getImageLink(contentImage.path),
      keywords: keywordList.map(({ name }) => name),
      url: window.location.origin.concat(window.location.pathname),
    },
  };
};

/** 배너 컴포넌트 */
const toContentsBannerComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<BannerProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, BannerDisplayModel> = JSON.parse(contents);

  const contentsData: BannerProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: true,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 혜택 상품 A 컴포넌트 */
const toContentsBenefitGoodsAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<BenefitGoodsAProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: BenefitGoodsADisplayModel = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
      displayDateTime,
      visible: getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }),
    } as BenefitGoodsAProps,
  };
};

/** 혜택 상품 B 컴포넌트 */
const toContentsBenefitGoodsBComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<BenefitGoodsBProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: BenefitGoodsBDisplayModel = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
      displayDateTime,
      visible: getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }),
    } as BenefitGoodsBProps,
  };
};

/** 혜택 리스트 A 컴포넌트 */
const toContentsBenefitListAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<BenefitListAProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: BenefitListADisplayModel = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
      displayDateTime,
      visible: getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }),
    } as BenefitListAProps,
  };
};

/** 여백 컴포넌트 */
const toContentsBlankComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<BlankProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: Extract<PresetDisplayTypes, BlankDisplayModel> = JSON.parse(contents);

  const contentsData: BlankProps = {
    ...contentData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: contentData.useDisplayDateTime,
      displayStartDateTime: contentData.displayStartDateTime,
      displayEndDateTime: contentData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 쿠폰 다운 컴포넌트 */
const toContentsCouponDownComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
  deepLink = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
  deepLink: string;
}): PresetModel<CouponDownProps> => {
  const { componentGroup, componentType, contents, couponList } = componentInfo;
  const contentData: Extract<PresetDisplayTypes, CouponDownDisplayModel> = JSON.parse(contents);

  const contentsData: CouponDownProps = {
    ...contentData,
    couponList,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    deepLink,
    visible:
      getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }) && couponList.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 쿠폰 팔로우 컴포넌트 */
const toContentsCouponFollowComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
  deepLink = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
  deepLink: string;
}): PresetModel<CouponFollowProps> => {
  const { componentGroup, componentType, contents, couponList } = componentInfo;
  const contentData: Extract<PresetDisplayTypes, CouponFollowDisplayModel> = JSON.parse(contents);

  const contentsData: CouponFollowProps = {
    ...contentData,
    couponList,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    deepLink,
    visible:
      getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }) && couponList.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/**
 * CTA 컴포넌트
 */
const toContentsCTAComponent = ({
  componentInfo,
  contentInfo,
  deepLink,
  displayDateTime,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  deepLink: string;
  displayDateTime: string;
}): PresetModel<CtaProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: Extract<PresetDisplayTypes, CtaDisplayModel> = JSON.parse(contents);

  const contentsData: CtaProps = {
    ...contentData,
    deepLink,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: contentData.useDisplayDateTime,
      displayStartDateTime: contentData.displayStartDateTime,
      displayEndDateTime: contentData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 상품 A 컴포넌트 */
const toContentsDealAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<DealListAProps> => {
  const { componentGroup, componentType, contents, goodsList } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, DealListADisplayModel> = JSON.parse(contents);
  const { goodsColor } = displayData;

  const contentsData: DealListAProps = {
    ...displayData,
    goodsList: goodsList.map((goodsData: GoodsSchema): DealListAGoodsModel => {
      const { brand, goods } = goodsData;
      const item = toGoods(brand, goods, goodsColor);
      return {
        ...item,
        type: goods.type,
        status: goods.status,
      };
    }),
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible:
      getStatusVisible({
        useDisplayDateTime: displayData.useDisplayDateTime,
        displayStartDateTime: displayData.displayStartDateTime,
        displayEndDateTime: displayData.displayEndDateTime,
        displayDateTime,
      }) && goodsList.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 상품 B 컴포넌트 */
const toContentsDealBComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<DealListBProps> => {
  const { componentGroup, componentType, contents, goodsList } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, DealListBDisplayModel> = JSON.parse(contents);
  const { goodsColor } = displayData;

  const contentsData: DealListBProps = {
    ...displayData,
    goodsList: goodsList.map((goodsData: GoodsSchema): DealListBGoodsModel => {
      const { brand, goods } = goodsData;
      const item = toGoods(brand, goods, goodsColor);
      return {
        ...item,
        type: goods.type,
        status: goods.status,
      };
    }),
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible:
      getStatusVisible({
        useDisplayDateTime: displayData.useDisplayDateTime,
        displayStartDateTime: displayData.displayStartDateTime,
        displayEndDateTime: displayData.displayEndDateTime,
        displayDateTime,
      }) && goodsList.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

const toGoods = (brand: GoodsBrandSchema, goods: GoodsItemSchema, goodsColor: string): GoodsCardProps => {
  const {
    id: brandId,
    name: brandName,
    primaryImage: brandImage,
  } = brand ?? {
    id: null,
    name: '',
    primaryImage: null,
  };
  const {
    id: goodsId,
    code: goodsCode,
    primaryImage: goodsImage,
    name: goodsName,
    discountRate,
    price,
    label,
    hasCoupon,
    status,
    benefits,
  } = goods;

  return {
    goodsId,
    goodsCode,
    image: {
      src: goodsImage?.path ? getImageLink(goodsImage.path) : '',
      blurHash: goodsImage?.blurHash,
    },
    goodsName,
    price,
    discountRate,
    brandId,
    brandName,
    brandImageUrl: brandImage?.path ? getImageLink(brandImage.path) : null,
    label,
    benefitLabel: benefits?.label || '',
    tagType: getBenefitTagType(benefits?.tagType || 'none'),
    hasCoupon,
    enableBrandSvg: goodsColor === '#ffffff',
    noDarkMode: true,
    runOut: status === GoodsNormalStatusType.RUNOUT,
  };
};

/** 응모 A 컴포넌트 */
const toContentsDrawAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<DrawAProps> => {
  const { componentGroup, componentType, contents, eventList } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, DrawADisplayModel> = JSON.parse(contents);

  const contentsData: DrawAProps = {
    ...displayData,
    eventList,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible:
      getStatusVisible({
        useDisplayDateTime: displayData.useDisplayDateTime,
        displayStartDateTime: displayData.displayStartDateTime,
        displayEndDateTime: displayData.displayEndDateTime,
        displayDateTime,
      }) && eventList.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 임베드 비디오 A 컴포넌트 */
const toContentsEmbedVideoAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<EmbedVideoAProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: EmbedVideoADisplayModel = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
      displayDateTime,
      visible: getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }),
    } as EmbedVideoAProps,
  };
};

/** 푸터 컴포넌트 */
const toContentsFooterComponent = ({
  componentInfo,
  contentInfo,
  showroom,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  showroom: ShowroomModel;
}): PresetModel<FooterProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, FooterDisplayModel> = JSON.parse(contents);

  const contentsData: FooterProps = {
    ...displayData,
    ...showroom,
    notice: '쇼룸에 더 많은 상품이 있습니다\n팔로우하면 라이브와 혜택 소식을 알려드립니다',
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    visible: true,
  };

  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 헤더 컴포넌트 */
const toContentsHeaderComponent = ({
  componentInfo,
  contentInfo,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
}): PresetModel<HeaderProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, HeaderDisplayModel> = JSON.parse(contents);

  const contentsData: HeaderProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    visible: true,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 이미지 컴포넌트 */
const toContentsImageViewerComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<ImageViewProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, ImageViewerDisplayModel> = JSON.parse(contents);

  const contentsData: ImageViewProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: displayData.useDisplayDateTime,
      displayStartDateTime: displayData.displayStartDateTime,
      displayEndDateTime: displayData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 미디어 A 컴포넌트 */
const toContentsMediaAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<MediaAProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, MediaADisplayModel> = JSON.parse(contents);

  const contentsData: MediaAProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: displayData.useDisplayDateTime,
      displayStartDateTime: displayData.displayStartDateTime,
      displayEndDateTime: displayData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 미디어 B컴포넌트 */
const toContentsMediaBComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<MediaBProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, MediaBDisplayModel> = JSON.parse(contents);

  const contentsData: MediaBProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: displayData.useDisplayDateTime,
      displayStartDateTime: displayData.displayStartDateTime,
      displayEndDateTime: displayData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 미디어 뷰어 A 컴포넌트 */
const toContentsMediaViewerAComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<MediaViewerAProps | MediaViewerBProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, MediaViewerADisplayModel> = JSON.parse(contents);

  const contentsData: MediaViewerAProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible:
      getStatusVisible({
        useDisplayDateTime: displayData.useDisplayDateTime,
        displayStartDateTime: displayData.displayStartDateTime,
        displayEndDateTime: displayData.displayEndDateTime,
        displayDateTime,
      }) && displayData.mediaLists.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 미디어 뷰어 B 컴포넌트 */
const toContentsMediaViewerBComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<MediaViewerAProps | MediaViewerBProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, MediaViewerBDisplayModel> = JSON.parse(contents);

  const contentsData: MediaViewerBProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible:
      getStatusVisible({
        useDisplayDateTime: displayData.useDisplayDateTime,
        displayStartDateTime: displayData.displayStartDateTime,
        displayEndDateTime: displayData.displayEndDateTime,
        displayDateTime,
      }) && displayData.mediaLists.length > 0,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 네비게이션 컴포넌트 */
const toContentsNavigationComponent = ({
  componentInfo,
  contentInfo,
  showroom,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  showroom: ShowroomModel;
}): PresetModel<NavigationProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: Extract<PresetDisplayTypes, NavigationDisplayModel> = JSON.parse(contents);

  const contentsData: NavigationProps = {
    ...contentData,
    showroom,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    visible: true,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 플레이뷰어 컴포넌트 */
const toContentsPlayViewerComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<PlayViewerProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: PlayViewerDisplayModel = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
      displayDateTime,
      visible: getStatusVisible({
        useDisplayDateTime: contentData.useDisplayDateTime,
        displayStartDateTime: contentData.displayStartDateTime,
        displayEndDateTime: contentData.displayEndDateTime,
        displayDateTime,
      }),
    } as PlayViewerProps,
  };
};

/** 댓글 컴포넌트 */
const toContentsReplyComponent = ({
  componentInfo,
  contentInfo,
  deepLink,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  deepLink: string;
  displayDateTime: string;
}): PresetModel<ReplyProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, ReplyDisplayModel> = JSON.parse(contents);

  const contentsData: ReplyProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    type: CommentPageType.STORY,
    deepLink,
    visible: getStatusVisible({
      useDisplayDateTime: displayData.useDisplayDateTime,
      displayStartDateTime: displayData.displayStartDateTime,
      displayEndDateTime: displayData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 텍스트 컴포넌트 */
const toContentsTextComponent = ({
  componentInfo,
  contentInfo,
  displayDateTime = '',
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  displayDateTime: string;
}): PresetModel<TextAProps> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, TextADisplayModel> = JSON.parse(contents);

  const contentsData: TextAProps = {
    ...displayData,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    displayDateTime,
    visible: getStatusVisible({
      useDisplayDateTime: displayData.useDisplayDateTime,
      displayStartDateTime: displayData.displayStartDateTime,
      displayEndDateTime: displayData.displayEndDateTime,
      displayDateTime,
    }),
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

/** 투표 A 컴포넌트 */
const toContentsVoteAComponent = ({
  componentInfo,
  contentInfo,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
}): PresetModel<VoteAProps> => {
  const { componentGroup, componentType, contents, voteList } = componentInfo;
  const displayData: Extract<PresetDisplayTypes, VoteADisplayModel> = JSON.parse(contents);

  const vote = voteList.length > 0 ? voteList[0] : null;
  const contentsData: VoteAProps = {
    ...displayData,
    vote: vote
      ? {
          id: vote.id,
          title: vote.title,
          startDate: vote.startDate,
          endDate: vote.endDate,
          voteList: vote.nomineeList,
        }
      : null,
    contentInfo: {
      ...contentInfo,
      presetType: componentType,
    },
    visible: voteList.length > 0 && !!vote,
  };

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: contentsData,
  };
};

const toContentsComponent = ({
  componentInfo,
  contentInfo,
}: {
  componentInfo: ComponentListSchema;
  contentInfo: Omit<ContentInfoModel, 'presetType'>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): PresetModel<any> => {
  const { componentGroup, componentType, contents } = componentInfo;
  const contentData: Partial<PresetDisplayTypes> = JSON.parse(contents);

  // 프리셋 데이터
  return {
    presetGroup: componentGroup,
    presetType: componentType,
    contents: {
      ...contentData,
      contentInfo: {
        ...contentInfo,
        presetType: componentType,
      },
    },
  };
};
export type LiveModel = LiveSchema;
