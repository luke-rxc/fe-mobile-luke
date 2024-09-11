import { getImageLink } from '@utils/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { TabsProps } from '@pui/tabs';
import { SectionTypes } from '../constants';
import {
  SectionLiveListSchema,
  SectionGoodsListSchema,
  SectionContentListSchema,
  SectionShowroomListSchema,
  SectionMetaDataSchema,
  FilterSchema,
} from '../schemas';
import { SectionListProps, SectionHeaderProps } from '../components';
import { GetDiscoverSectionGoodsParams } from '../apis';

// 섹션 헤더 모델 타입
export type SectionHeaderListModel = SectionHeaderModel[];
export type SectionHeaderModel = SectionHeaderProps;

// 섹션 필터 모델 타입
export type SectionFilterModel = FilterSchema;

// 라이브 섹션 모델 타입
export type SectionLiveListModel = Extract<SectionListProps, { type: typeof SectionTypes.LIVE }>;
export type SectionLiveModel = SectionLiveListModel['data'];

// 상품 섹션 모델 타입
export type SectionGoodsListModel = Extract<SectionListProps, { type: typeof SectionTypes.GOODS }>;
export type SectionGoodsModel = SectionGoodsListModel['data'];

// 콘텐츠 섹션 모델 타입
export type SectionContentListModel = Extract<SectionListProps, { type: typeof SectionTypes.CONTENT }>;
export type SectionContentModel = SectionContentListModel['data'];

// 쇼룸 섹션 모델 타입
export type SectionShowroomListModel = Extract<SectionListProps, { type: typeof SectionTypes.SHOWROOM }>;
export type SectionShowroomModel = SectionShowroomListModel['data'];

/**
 * 섹션 헤더 모델
 */
export const toSectionHeaderListModel = (
  schema: NonNullable<SectionMetaDataSchema['headerList']>,
): SectionHeaderModel[] =>
  schema.map((header) => {
    const { media, title, subTitle: description } = header;

    let video: string | undefined;
    let image: string | undefined;
    let blurHash: string | undefined;

    if (media.fileType === 'VIDEO') {
      video = getImageLink(media.path);
      image = media.thumbnailImage?.path;
      blurHash = media.thumbnailImage?.blurHash;
    } else {
      image = media.path;
      blurHash = media.blurHash;
    }

    return { image, blurHash, video, title, description };
  });

/**
 * 상품 Filter 모델
 */
export const toFilterModel = (schema: FilterSchema) => {
  return { ...schema, sort: toSortingOptionsModel(schema.sort) };
};

/**
 * 상품 Filter options 모델
 */
export const toSortingOptionsModel = (sort: FilterSchema['sort']): TabsProps['sortingOptions'] => {
  return sort.map(({ code, text }) => ({ label: text, value: code }));
};

/**
 * 라이브 섹션 모델
 */
export const toSectionLiveModel = (
  schema: SectionLiveListSchema[],
  metaData: SectionMetaDataSchema,
): SectionLiveModel => {
  return schema
    .flatMap((data) => data.content)
    .map(
      (
        {
          id,
          landingStory,
          liveSchedule,
          scheduleDate,
          title,
          svgLogo,
          bgColor,
          bgImage,
          chromakeyImage,
          showRoom,
          landingType,
          web,
          scheme,
        },
        index,
      ) => ({
        web,
        scheme,
        onAir: liveSchedule?.live.onAir ?? false,
        liveId: liveSchedule?.live.id,
        contentCode: landingStory?.code,
        contentType: landingStory?.contentsType,
        scheduleId: id,
        title,
        scheduleDate,
        logoURL: svgLogo?.path && getImageLink(svgLogo.path),
        chromakeyURL: getImageLink(chromakeyImage.path, 512),
        backgroundURL: getImageLink(bgImage.path, 512),
        bgColorCode: bgColor,
        followed: liveSchedule?.isFollowed,
        showroomName: showRoom.name,
        showroomCode: showRoom.code,
        profileURL: showRoom.primaryImage.path ? getImageLink(showRoom?.primaryImage.path) : '',
        landingType,
        // 로그 트래킹에 사용되는 데이터
        showroomId: showRoom.id,
        'data-index': index + 1,
        'data-section-id': metaData.id,
        'data-section-name': metaData.title,
        'data-section-description': metaData.subTitle,
      }),
    );
};

/**
 * 상품 섹션 모델
 */
export const toSectionGoodsModel = (
  schema: SectionGoodsListSchema[],
  params?: GetDiscoverSectionGoodsParams,
): SectionGoodsModel => {
  return schema
    .flatMap((data) => data.content)
    .map(({ brand, goods }, i) => ({
      goodsId: goods.id,
      goodsCode: goods.code,
      goodsName: goods.name,
      price: goods.price,
      discountRate: goods.discountRate,
      brandId: brand?.id,
      brandName: brand?.name,
      image: {
        src: getImageLink(goods.primaryImage.path, 512),
        blurHash: goods.primaryImage.blurHash,
      },
      brandImageUrl: brand?.primaryImage?.path && getImageLink(brand?.primaryImage.path),
      label: goods.label,
      hasCoupon: goods.hasCoupon,
      benefitLabel: goods.benefits?.label,
      tagType: getBenefitTagType(goods.benefits?.tagType || ''),
      prizmOnlyTagOption: {
        resetTrigger: `${params?.sort}-${params?.categoryFilter}`,
      },
      runOut: goods.isRunOut,
      'data-index': `${i + 1}`,
    }));
};

/**
 * 콘텐츠 섹션 모델
 */
export const toSectionContentModel = (
  schema: SectionContentListSchema[],
  metaData: SectionMetaDataSchema,
): SectionContentModel => {
  return schema
    .flatMap((data) => data.content)
    .map(({ id, name, code, contentType, image, startDate, isActive, showRoom }, index) => ({
      id,
      name,
      code,
      contentType,
      imageProps: { path: image.path && getImageLink(image.path, 288), blurHash: image.blurHash ?? null },
      startDate,
      release: isActive,
      showroomCode: showRoom?.code,
      'data-index': index + 1,
      'data-section-id': metaData.id,
      'data-section-name': metaData.title,
      'data-section-description': metaData.subTitle,
    }));
};

/**
 * 쇼룸 섹션 모델
 */
export const toSectionShowroomModel = (
  schema: SectionShowroomListSchema[],
  metaData: SectionMetaDataSchema,
): SectionShowroomModel => {
  let goodsCount = 0;
  return schema
    .flatMap((data) => data.content)
    .map(({ id, name, code, primaryImage, onAir, liveId, isFollowed, goodsList }, index) => ({
      title: name,
      showroomId: id,
      showroomCode: code,
      imageURL: getImageLink(primaryImage.path),
      onAir,
      liveId,
      followed: isFollowed,
      goods: goodsList.map((goods) => ({
        goodsId: goods.id,
        goodsCode: goods.code,
        goodsName: goods.name,
        price: goods.price,
        discountRate: goods.discountRate,
        image: {
          src: getImageLink(goods.primaryImage.path, 288),
          blurHash: goods.primaryImage.blurHash,
        },
        // eslint-disable-next-line no-plusplus
        'data-goods-index': ++goodsCount,
        'data-section-id': metaData.id,
        'data-section-name': metaData.title,
        'data-section-description': metaData.subTitle,
      })),
      'data-showroom-index': index + 1,
      'data-section-id': metaData.id,
      'data-section-name': metaData.title,
      'data-section-description': metaData.subTitle,
    }));
};
