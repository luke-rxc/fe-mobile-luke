import isEmpty from 'lodash/isEmpty';
import { getImageLink, getUniversalLink } from '@utils/link';
import type { SEOProps } from '@pui/seo';
import { UniversalLinkTypes } from '@constants/link';
import { userAgent } from '@utils/ua';
import { ShowroomColor } from '../types';
import { AllViewLabelingCriteriaForFeed } from '../constants';
import { PostMultipleCouponDownloadParams } from '../apis';
import { ShowroomSchema, MultipleCouponDownloadSchema, FilterSchema } from '../schemas';
import {
  AccomInfoProps,
  ContentListProps,
  CouponListProps,
  CoverMediaProps,
  ProfileProps,
  SortOptionType,
} from '../components';

/**
 * 쇼룸 기본 정보 스키마
 */
export const toShowroomModel = (schema: ShowroomSchema) => {
  const { id, type, code, name, brand, onAir, liveId, accom, isFollowed } = schema;

  return {
    id,
    type,
    code,
    name,
    onAir,
    liveId,
    isFollowed,
    isVisibleRegionShortcut: schema.isAccomRoomSearchUse,
    hasMap: !!accom?.place,
    logoURL: brand?.primaryImage?.path,
    cover: toCoverMediaModel(schema),
    profile: toProfileModel(schema),
    coupon: toCouponListModel(schema),
    content: toContentListModel(schema),
    colors: toColorModel(schema),
    seo: toSeoModel(schema),
    accom: toAccomModel(schema),
    _sections: schema.sectionList,
    _goods: schema.goodsList,
  };
};

/**
 * 커버 미디어 데이터 모델
 */
export const toCoverMediaModel = (schema: ShowroomSchema): CoverMediaProps => {
  const { coverImage, coverVideo } = schema;
  const { width, height, path: imageURL, blurHash } = coverVideo?.thumbnailImage || coverImage || {};

  return {
    videoURL: coverVideo?.path && getImageLink(coverVideo.path),
    width,
    height,
    imageURL,
    blurHash,
  };
};

/**
 * 프로필 데이터 모델
 */
export const toProfileModel = (schema: ShowroomSchema): ProfileProps => {
  const { about, name, id, code, onAir, liveId, primaryImage, isFollowed } = schema;

  return {
    description: about,
    profileInfo: {
      title: name,
      showroomId: id,
      showroomCode: code,
      followed: isFollowed,
      imageURL: primaryImage.path,
      disabledProfileLink: !(onAir && liveId),
      onAir,
      liveId,
    },
  };
};

/**
 * 쿠폰 리스트 모델
 */
export const toCouponListModel = (schema: ShowroomSchema): CouponListProps => {
  const { couponList = [], isFollowed } = schema;

  return {
    expanded: isFollowed && !isEmpty(couponList),
    ...couponList.reduce<Pick<CouponListProps, 'downloadedCoupons' | 'downloadableCoupons'>>(
      (acc, { couponId: id, display, isDownloaded }) => {
        const coupon = { id, name: display.name, title: display.title };
        return isDownloaded
          ? {
              downloadableCoupons: acc.downloadableCoupons,
              downloadedCoupons: (acc.downloadedCoupons || []).concat(coupon),
            }
          : {
              downloadedCoupons: acc.downloadedCoupons,
              downloadableCoupons: (acc.downloadableCoupons || []).concat(coupon),
            };
      },
      {},
    ),
  };
};

/**
 * 다운로드 쿠폰데이터를 기존 쿠폰데이터와 병합
 */
export const toMergedDownloadCouponList = (
  originCoupons: ShowroomSchema['couponList'],
  downloadCoupons: MultipleCouponDownloadSchema['downloadedCouponList'],
  targetIds: PostMultipleCouponDownloadParams['couponIds'],
): ShowroomSchema['couponList'] => {
  const originCouponMap = originCoupons.reduce(
    (map, coupon) => new Map(map.set(coupon.couponId, coupon)),
    new Map<number, ShowroomSchema['couponList'][0]>(),
  );

  const downloadedCouponMap = downloadCoupons.reduce(
    (map, coupon) => new Map(map.set(coupon.couponId, coupon)),
    new Map<number, ShowroomSchema['couponList'][0]>(),
  );

  /**
   * 다운로드 요청한 쿠폰중 응답값에 포함되어 있지 않으면 제거된 쿠폰으로
   * 기존 리스트에서도 삭제
   *
   * [12344, 12345] => [{couponId: 12344, ...}] // 12345는 비활성화된 쿠폰
   */
  targetIds.forEach((id) => {
    const coupon = downloadedCouponMap.get(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    coupon ? originCouponMap.set(id, coupon) : originCouponMap.delete(id);
  });

  return Array.from(originCouponMap.values());
};

/**
 * 콘텐츠 리스트 모델
 */
export const toContentListModel = (schema: ShowroomSchema): ContentListProps => {
  const { isApp } = userAgent();
  const { id: showroomId, storyList = [] } = schema;
  const contentLink =
    storyList.length >= AllViewLabelingCriteriaForFeed
      ? getUniversalLink(UniversalLinkTypes.GOODS_CONTENT, { showroomId })
      : undefined;

  return {
    sectionLink: isApp ? contentLink?.app : contentLink?.web,
    contents: storyList.slice(0, 8).map((content, i) => ({
      title: content.name,
      contentId: content.id,
      contentType: content.type,
      contentCode: content.code,
      startDate: content.startDate,
      endDate: content.endDate,
      image: {
        src: content.image.path,
        blurHash: content.image.blurHash,
      },
      // 이벤트 로깅을 위한 데이터
      'data-index': `${i + 1}`,
      'data-status': content.startDate && new Date().getTime() >= content.startDate ? '공개중' : '공계예정',
    })),
  };
};

/**
 * 쇼룸 Color 모델
 */
export const toColorModel = ({
  backgroundColor,
  contentColor,
  tintColor,
  textColor,
}: ShowroomSchema): ShowroomColor => {
  return {
    backgroundColor,
    contentColor,
    tintColor,
    textColor,
  };
};

/**
 * SEO 모델 (meta 데이터)
 */
export const toSeoModel = (schema: ShowroomSchema): SEOProps => {
  const { about, name, primaryImage, keywordList } = schema;
  const { origin, pathname } = window.location;

  return {
    title: name,
    description: about,
    image: getImageLink(primaryImage.path),
    keywords: keywordList.map((keyword) => keyword.name),
    url: origin.concat(pathname),
  };
};

/**
 * 상품 Filter 모델
 */
export const toFilterModel = (schema: FilterSchema) => {
  let categoryFilter: typeof schema.categoryFilter = [];

  if (schema.categoryFilter && schema.categoryFilter.length > 1) {
    categoryFilter = [{ name: '전체', id: 0 }].concat(schema.categoryFilter);
  }

  return { ...schema, categoryFilter, sort: toSortingOptionsModel(schema.sort) };
};

/**
 * 상품 Filter options 모델
 */
export const toSortingOptionsModel = (sort: FilterSchema['sort']): SortOptionType[] => {
  return sort.map(({ code, text }) => ({ label: text, value: code }));
};

/**
 * 티켓 숙박 상품 정보
 */
export const toAccomModel = (schema: ShowroomSchema): AccomInfoProps | undefined => {
  const { accom } = schema;

  if (!accom) {
    return undefined;
  }

  return {
    info: accom.info.map(({ title, items }) => ({ title, contents: items.map(({ name }) => name) })),
    place: accom.place,
  };
};
