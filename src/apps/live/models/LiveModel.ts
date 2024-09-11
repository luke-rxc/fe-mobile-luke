import { LiveAuctionStatus, LiveContentsType, LiveStatus } from '@constants/live';
import env from '@env';
import type { SEOProps } from '@pui/seo';
import { getImageLink } from '@utils/link';
import { TagType } from '@pui/prizmOnlyTag';
import { getBenefitTagType } from '@utils/benefitTagType';
import { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { GoodsCardProps } from '@pui/goodsCard';
import {
  ImageSchema,
  LiveAuctionItemSchema,
  LiveChatChannelSchema,
  LiveGoodsBrandItemSchema,
  LiveGoodsItemSchema,
  LiveGoodsSchema,
  LiveRaffleWinnerSchema,
  LiveSchema,
  LiveShowroomSchema,
  LiveTitleLogoSchema,
  LiveVideoSizeSchema,
  PurchaseVerificationStatusSchema,
  RaffleImageSchema,
  RaffleMediaSchema,
} from '../schemas';

/**
 * image model
 */
export interface ImageModel extends Omit<ImageSchema, 'path'> {
  path: string;
}

interface LiveDealGoodsBenefitModel {
  label: string | null;
  tagType: TagType;
  isPrizmOnly: boolean;
  isLiveOnly: boolean;
}

/**
 * Live goods item model
 */
export interface LiveGoodsItemModel {
  id: number;
  name: string;
  primaryImage: ImageSchema;
  consumerPrice: number;
  consumerPriceText: string;
  price: number;
  priceText: string;
  discountRate: number;
  discountRateText: string;
  showRoomId: number;
  type: string;
  status: string;
  code: string;
  hasCoupon: boolean;
  isRunout: boolean;
  benefits: LiveDealGoodsBenefitModel;
}

/**
 * Live goods brand item model
 */
export interface LiveGoodsBrandItemModel {
  id: number;
  name: string;
}

/**
 * Live goods model
 */
export interface LiveGoodsModel {
  goods: LiveGoodsItemModel;
  brand: LiveGoodsBrandItemModel | null;
}

/**
 * Live goods model
 */
export interface LiveAuctionItemModel extends Omit<LiveAuctionItemSchema, 'goodsDetail'> {
  goodsDetail: LiveGoodsModel;
  startPriceText: string;
}

/**
 * Live deal goods
 */
export interface LiveDealGoods {
  id: number;
  goodsName: string;
  images: Array<ImageModel>;
  priceText: string;
  discountRateText?: string;
  status?: LiveAuctionStatus;
  bidColor?: string | null;
  textColor?: string;
  goodsCount?: number;
  hasCoupon?: boolean;
  isRunOut: boolean;
  benefits: LiveDealGoodsBenefitModel;
}

/**
 * Live deal goods items
 */
export interface LiveDealGoodsItems {
  [LiveContentsType.STANDARD]: LiveDealGoods | undefined;
  [LiveContentsType.AUCTION]: LiveDealGoods | undefined;
}

/**
 * Live showroom model
 */
export interface LiveShowroomModel extends LiveShowroomSchema {
  primaryImage: ImageModel;
}

/**
 * Live chat channel model
 */
export interface LiveChatChannelModel extends LiveChatChannelSchema {
  applicationId: string;
}

export interface LiveTitleLogoModel {
  primaryImage: ImageModel;
  secondaryImage: ImageModel | null;
}

export interface LiveVideoSizeModel extends LiveVideoSizeSchema {
  horizontalRatioVideo: boolean;
  isFoldTypeScreen: boolean;
  videoRatio: number;
}

/**
 * 라이브 fnb model
 */
export interface LiveFnbModel {
  showFaq: boolean;
}

/**
 * Live model
 */
export interface LiveModel extends Omit<LiveSchema, 'goodsList' | 'auctionList'> {
  /** 일반/경매상품 복합구성 여부 */
  multiTypeContents: boolean;
  /** 쇼룸정보 */
  showRoom: LiveShowroomModel;
  /** 커버이미지 정보 */
  coverImage: ImageModel;
  /** 일반상품 리스트 */
  goodsList: Array<LiveGoodsModel>;
  /** 경매상품 리스트 */
  auctionList: Array<LiveAuctionItemModel>;
  /** 채팅채널 정보 */
  chatChannel: LiveChatChannelModel;
  /** 라이브 타이틀 로고 */
  liveTitleLogo: LiveTitleLogoModel;
  /** 딜 상품 items */
  dealGoodsItems: LiveDealGoodsItems;
  /** 딜 상품 item */
  dealGoodsItem: LiveDealGoods | undefined;
  fnb: LiveFnbModel;

  /** 공개된 경매상품 */
  openningAuctionItem: LiveAuctionItemModel | undefined;
  /** 라이브 SEO 정보 */
  seo: SEOProps;
  videoSize: LiveVideoSizeModel;
}

/**
 * Live GoodsCardSmall model
 */
export interface LiveGoodsCardSmallModel extends GoodsCardSmallProps {
  id: string;
  goodsType: string;
}

/**
 * Live GoodsCard model
 */
export interface LiveGoodsCardModel extends GoodsCardProps {
  goodsIndex: number;
}

/**
 * Live 종료 model
 */
export interface LiveEndViewModel {
  id: number;
  liveStatus: LiveStatus;
  title: string;
  /** 쇼룸정보 */
  showRoom: LiveShowroomModel;
  /** 일반상품 리스트 */
  goodsList: Array<LiveGoodsCardSmallModel>;
  // 다운로드 가능한 쿠폰 유무
  hasDownloadableCoupon: boolean;
  // live feed section id
  sectionId: number;
}

/**
 * Live 상품뷰 model
 */
export interface LiveViewGoodsModel {
  id: number;
  liveStatus: LiveStatus;
  title: string;
  /** 일반상품 리스트 */
  goodsList: Array<LiveGoodsCardModel>;
}

/**
 * 레플 당첨자 발표 info model
 */
export interface RaffleWinnerInfoModel {
  id: number;
  timedMetaDate: number;
}

/**
 * 라이브 레플 당첨자 image Model
 */
export interface RaffleImageModel extends Omit<RaffleImageSchema, 'path'> {
  path: string;
}

/**
 * 라이브 레플 당첨자 media Model
 */
export interface RaffleMediaModel extends Omit<RaffleMediaSchema, 'path'> {
  path: string;
  thumbnailImage: RaffleImageModel;
}

/**
 * 라이브 레플 유저 model
 */
export interface RaffleUserInfoModel {
  nickname: string;
  userId: number;
}

/**
 * 라이브 레플 당첨자 Model
 */
export interface LiveRaffleWinnerModel {
  winnerList: Array<RaffleUserInfoModel>;
  goodsMedia: RaffleMediaModel | null;
  goodsImage: RaffleImageModel | null;
}

/**
 * ImageSchema => ImageModel convert
 */
export const toImageModel = (item: ImageSchema): ImageModel => {
  return {
    ...item,
    path: `${env.endPoint.cdnUrl}/${item.path}`,
  };
};

/**
 * LiveShowroomSchema => LiveShowroomModel convert
 */
export const toLiveShowRoomModel = (item: LiveShowroomSchema): LiveShowroomModel => {
  return {
    ...item,
    primaryImage: toImageModel(item.primaryImage),
  };
};

/**
 * LiveGoodsItemSchema => LiveGoodsItemModel convert
 */
export const toLiveGoodsItemModel = (item: LiveGoodsItemSchema): LiveGoodsItemModel => {
  const tagType = getBenefitTagType(item.benefits.tagType);

  return {
    id: item.id,
    name: item.name,
    primaryImage: toImageModel(item.primaryImage),
    consumerPrice: item.consumerPrice,
    consumerPriceText: `${item.consumerPrice.toLocaleString()}원`,
    price: item.price,
    priceText: `${item.price.toLocaleString()}원`,
    discountRate: item.discountRate,
    discountRateText: `${item.discountRate.toLocaleString()}원`,
    showRoomId: item.showRoomId,
    code: item.code,
    status: item.status,
    type: item.type,
    hasCoupon: item.hasCoupon,
    isRunout: item.isRunOut,
    benefits: {
      label: item.benefits.label,
      tagType,
      isPrizmOnly: tagType === 'prizmOnly',
      isLiveOnly: tagType === 'liveOnly',
    },
  };
};

/**
 * LiveGoodsBrandItemSchema => LiveGoodsBrandItemModel convert
 */
export const toLiveGoodsBrandItemModel = (item: LiveGoodsBrandItemSchema): LiveGoodsBrandItemModel => {
  return {
    id: item.id,
    name: item.name, // goods.label || brand.name
  };
};

/**
 * LiveGoodsSchema => LiveGoodsModel convert
 */
export const toLiveGoodsModel = (item: LiveGoodsSchema): LiveGoodsModel => {
  return {
    goods: toLiveGoodsItemModel(item.goods),
    brand: item.brand ? toLiveGoodsBrandItemModel(item.brand) : null,
  };
};

/**
 * LiveGoodsSchema list => LiveGoodsModel list convert
 */
export const toLiveGoodsModels = (items: Array<LiveGoodsSchema>): Array<LiveGoodsModel> => {
  return items.map(toLiveGoodsModel);
};

/**
 * LiveAuctionItemSchema => LiveAuctionItemModel convert
 */
export const toLiveAuctionModel = (item: LiveAuctionItemSchema): LiveAuctionItemModel => {
  return {
    ...item,
    goodsDetail: toLiveGoodsModel(item.goodsDetail),
    startPriceText: item.startPrice.toLocaleString(),
  };
};

/**
 * LiveAuctionItemSchema list => LiveAuctionItemModel list convert
 */
export const toLiveAuctionModels = (items: Array<LiveAuctionItemSchema>): Array<LiveAuctionItemModel> => {
  return items.map(toLiveAuctionModel);
};

/**
 * LiveChatChannelSchema => LiveChatChannelModel convert
 */
export const toLiveChatChannelModel = (item: LiveChatChannelSchema): LiveChatChannelModel => {
  return {
    ...item,
    applicationId: env.sendbirdAppId,
  };
};

/**
 * LiveGoodsSchema list => LiveDealGoods convert
 */
export const toLiveDealGoods = (goodsList: Array<LiveGoodsSchema>): LiveDealGoods | undefined => {
  if (goodsList.length === 0) {
    return undefined;
  }

  // 가격이 낮은 순서로 sort
  const orderedGoodsListByLowPrice = [...goodsList].sort((a, b) => {
    return Number(a.goods.price) - Number(b.goods.price);
  });

  const { goods } = orderedGoodsListByLowPrice[0];

  const hasCoupon = goodsList.length === 1 ? goods.hasCoupon : false;
  const tagType = getBenefitTagType(goods.benefits?.tagType);

  return {
    id: goods.id,
    goodsName: `${goods.name}`,
    images: goodsList.map((item) => toImageModel(item.goods.primaryImage)),
    priceText: `${goods.price.toLocaleString()}원${goodsList.length > 1 ? ' ~' : ''}`,
    goodsCount: goodsList.length,
    hasCoupon,
    // 상품리스트 아이템이 1개이고 품절인 경우
    isRunOut: goodsList.length === 1 && goods.isRunOut,
    ...(goods.discountRate && {
      discountRateText: `${goods.discountRate}%`,
    }),
    benefits: {
      label: goodsList.length === 1 ? goods.benefits.label : null,
      tagType,
      isPrizmOnly: goodsList.length === 1 && tagType === 'prizmOnly',
      isLiveOnly: goodsList.length === 1 && tagType === 'liveOnly',
    },
  };
};

const getBidColor = ({ auctionList, currentAuctionId, showRoom }: LiveSchema) => {
  const currentAuctionStatus = auctionList.find((item) => item.id === currentAuctionId)?.status;
  if (currentAuctionStatus === LiveAuctionStatus.SUCCESSFUL_BID) {
    return ['rgba(0, 0, 0, 0.20)', '#ffffff'];
  }

  return [showRoom.tintColor, '#ffffff'];
};

/**
 * LiveDealGoodsItems 리턴
 */
const getDealGoodsItems = (item: LiveSchema): LiveDealGoodsItems => {
  const standardDealGoods = toLiveDealGoods(item.goodsList);

  if (item.contentsType === LiveContentsType.AUCTION) {
    const auctionItem = item.auctionList.find((data) => data.id === item.currentAuctionId);
    const convert = auctionItem ? toLiveAuctionModel(auctionItem) : undefined;

    return {
      [LiveContentsType.AUCTION]: convert
        ? {
            id: convert.id,
            goodsName: convert.goodsDetail.goods.name,
            images: [convert.goodsDetail.goods.primaryImage],
            status: convert.status,
            priceText: `경매 시작가 ${convert.startPriceText}원`,
            bidColor: getBidColor(item)[0],
            textColor: getBidColor(item)[1],
            isRunOut: false,
            benefits: {
              label: null,
              tagType: 'none',
              isPrizmOnly: false,
              isLiveOnly: false,
            },
          }
        : undefined,
      [LiveContentsType.STANDARD]: standardDealGoods,
    };
  }
  return {
    [LiveContentsType.STANDARD]: standardDealGoods,
    [LiveContentsType.AUCTION]: undefined,
  };
};

/**
 * currentAuctionId 리턴
 */
const getCurrentAuctionId = (item: LiveSchema): number | null => {
  // currentAuctionId 값이 있고 경매타입 라이브이면서 일반 상품이 없을 경우(일반적인 경매라이브) currentAuctionId에 해당하는 경매상품이 공개된 상태인지 확인
  // 공개상태가 아닐경우 currentAuctionId를 null로 리턴
  if (item.currentAuctionId && item.contentsType === LiveContentsType.AUCTION && item.goodsList.length === 0) {
    const auctionItem = item.auctionList.find((auction) => auction.id === item.currentAuctionId);

    if (
      !(
        auctionItem?.status === LiveAuctionStatus.OPENING ||
        auctionItem?.status === LiveAuctionStatus.BIDDING ||
        auctionItem?.status === LiveAuctionStatus.COUNTDOWN ||
        auctionItem?.status === LiveAuctionStatus.PAUSE
      )
    ) {
      return null;
    }
  }

  return item.currentAuctionId;
};

/**
 * LiveTitleLogo schema > LiveTitleLogo model convert
 */
export const toLiveTitleLogoModel = (item: LiveTitleLogoSchema): LiveTitleLogoModel => {
  return {
    primaryImage: toImageModel(item.primaryImage),
    secondaryImage: item.secondaryImage ? toImageModel(item.secondaryImage) : null,
  };
};

export const toLiveSeoModel = (item: LiveSchema): SEOProps => ({
  title: item.title,
  description: item.description,
  image: getImageLink(item.coverImage.path),
  url: window.location.origin.concat(window.location.pathname),
});

/**
 * 라이브 video size schema => 라이브 video size model convert
 */
export const toLiveVideoSize = (item: LiveVideoSizeSchema): LiveVideoSizeModel => {
  const screenRatio = window.screen.width / window.screen.height;

  return {
    ...item,
    horizontalRatioVideo: item.width >= item.height,
    isFoldTypeScreen: screenRatio > 0.8,
    videoRatio: item.height / item.width,
  };
};

/**
 * LiveSchema => LiveModel convert
 */
export const toLiveModel = (item: LiveSchema): LiveModel => {
  const auctionList = toLiveAuctionModels(item.auctionList);
  const currentAuctionId = getCurrentAuctionId(item);
  const dealGoodsItems = getDealGoodsItems({ ...item, currentAuctionId });

  return {
    ...item,
    multiTypeContents: item.contentsType === LiveContentsType.AUCTION && item.goodsList.length > 0,
    showRoom: toLiveShowRoomModel(item.showRoom),
    coverImage: toImageModel(item.coverImage),
    goodsList: toLiveGoodsModels(item.goodsList),
    auctionList,
    chatChannel: toLiveChatChannelModel(item.chatChannel),
    liveTitleLogo: toLiveTitleLogoModel(item.liveTitleLogo),
    dealGoodsItems: getDealGoodsItems({ ...item, currentAuctionId }),
    dealGoodsItem: dealGoodsItems[item.contentsType],
    openningAuctionItem: auctionList.find(
      (auction) =>
        auction.status === LiveAuctionStatus.OPENING ||
        auction.status === LiveAuctionStatus.BIDDING ||
        auction.status === LiveAuctionStatus.COUNTDOWN ||
        auction.status === LiveAuctionStatus.PAUSE,
    ),
    currentAuctionId,
    seo: toLiveSeoModel(item),
    videoSize: toLiveVideoSize(item.videoSize),
  };
};

/**
 * Live goods schema > Live GoodsCardSmall model convert
 */
const toLiveGoodsCardSmallModel = ({
  goods: { id, code, name, price, discountRate, hasCoupon, primaryImage, isRunOut, type },
  brand,
}: LiveGoodsSchema): LiveGoodsCardSmallModel => {
  return {
    id: id.toString(),
    goodsCode: code,
    brandName: brand?.name || '',
    goodsName: name,
    price,
    discountRate,
    hasCoupon,
    image: {
      src: primaryImage.path,
      blurHash: primaryImage.blurHash,
    },
    runOut: isRunOut,
    goodsType: type,
  };
};

/**
 * Live goods schema > Live GoodsCard model convert
 */
const toLiveGoodsCardModel = (
  { goods: { id, code, name, price, discountRate, hasCoupon, primaryImage, isRunOut }, brand }: LiveGoodsSchema,
  index: number,
): LiveGoodsCardModel => {
  return {
    goodsId: id,
    goodsCode: code,
    brandName: brand?.name || '',
    goodsName: name,
    price,
    discountRate,
    hasCoupon,
    image: {
      src: primaryImage.path,
      blurHash: primaryImage.blurHash,
    },
    runOut: isRunOut,
    goodsIndex: index + 1,
  };
};

/**
 * Live schema > Live 종료 model convert
 */
export const toLiveEndViewModel = ({
  id,
  liveStatus,
  title,
  showRoom,
  goodsList,
  sectionId,
  hasDownloadableCoupon,
}: LiveSchema): LiveEndViewModel => {
  return {
    id,
    liveStatus,
    title,
    /** 쇼룸정보 */
    showRoom: toLiveShowRoomModel(showRoom),
    /** 일반상품 리스트 */
    goodsList: goodsList.map(toLiveGoodsCardSmallModel),
    hasDownloadableCoupon,
    sectionId,
  };
};

/**
 * Live schema > Live 상품뷰 model convert
 */
export const toLiveViewGoodsModel = ({ id, liveStatus, title, goodsList }: LiveSchema): LiveViewGoodsModel => {
  return {
    id,
    liveStatus,
    title,
    /** 일반상품 리스트 */
    goodsList: goodsList.map(toLiveGoodsCardModel),
  };
};

/**
 * RaffleImageSchema => RaffleImageModel convert
 */
export const toRaffleImage = ({ fileType, ...item }: RaffleImageSchema): RaffleImageModel => {
  return {
    fileType,
    ...toImageModel(item),
  };
};

/**
 * RaffleMediaSchema => RaffleMediaModel convert
 */
export const toRaffleMedia = ({
  fileType,
  thumbnailImage,
  chromaKey,
  ...item
}: RaffleMediaSchema): RaffleMediaModel => {
  return {
    fileType,
    chromaKey,
    ...toImageModel(item),
    thumbnailImage: toRaffleImage(thumbnailImage),
  };
};

/**
 * LiveRaffleWinnerSchema => LiveRaffleWinnerModel convert
 */
export const toLiveRaffleWinnerModel = ({
  winnerList,
  goodsImage,
  goodsMedia,
}: LiveRaffleWinnerSchema): LiveRaffleWinnerModel => {
  return {
    winnerList,
    goodsMedia: toRaffleMedia(goodsMedia),
    goodsImage: toRaffleImage(goodsImage),
  };
};

/**
 * PurchaseVerificationStatusSchema => boolean convert
 */
export const toPurchaseVerificationStatusModel = ({
  isPurchaseVerifiable,
}: PurchaseVerificationStatusSchema): boolean => {
  return isPurchaseVerifiable;
};
