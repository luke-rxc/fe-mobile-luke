import isEmpty from 'lodash/isEmpty';
import { getImageLink } from '@utils/link';
import { FileType } from '@constants/file';
import type { MWebHeaderProps } from '@pui/mwebHeader';
import { FileModel } from '@models/FileModel';
import {
  GoodsSchema,
  InformationListSchema,
  FileListSchema,
  BrandSchema,
  AuctionSchema,
  AccomSchema,
  DetailInfoSchema,
  DetailInfoOndaSectionSchema,
  DetailInfoOndaSchema,
  CheckInOutSchema,
} from '../schemas';
import { getRatio } from '../utils';
import { GoodsAccomInfoTitle } from '../constants';

export type InformationModel = InformationListSchema;
export type AuctionModel = AuctionSchema;
export interface BrandModel extends BrandSchema {
  primaryImageOriginal: FileModel | null;
}

export interface GoodsCoverModel extends FileListSchema {
  type: FileType;
}

export interface GoodsDetailModel extends FileListSchema {
  type?: FileType;
  containerWidth: number | null;
  containerHeight: number | null;
}

export interface AccomModel {
  title: string;
  contents: string[];
}

export interface GoodsModel extends Omit<GoodsSchema, 'fileList' | 'brand' | 'accom'> {
  headers: GoodsCoverModel[];
  brand: BrandModel | null;
  accom?: AccomModel[];
}

/** 교환/환불 Model (Front 자체 Model) */
export interface GoodsCsModel {
  id: number;
  title: string;
  list: GoodsCsListModel[];
}

interface GoodsCsListModel {
  id: number;
  desc: string;
}

export interface HeaderModel extends MWebHeaderProps {
  title?: string;
  showroomCode?: string;
}

export type DetailInfoModel = DetailInfoOndaSectionSchema & Pick<DetailInfoSchema, 'section'>;

export type DetailInfoOndaModel = DetailInfoOndaSchema;

/**
 * App Header Data
 */
export const toHeaderModel = (detailGoods: GoodsSchema): HeaderModel => {
  const { brand } = detailGoods;
  return {
    title: brand?.name ?? undefined,
    titleImagePath: brand?.primaryImage?.path,
    /** webApp interface(optional) */
    showroomCode: brand?.showRoom?.code ?? undefined,
  };
};

const getFilteredContents = (contents: string[]) => {
  return [...contents].filter((content) => content);
};

/**
 * Accom Data
 */
const toAccomModel = (accom?: AccomSchema, checkInOutData?: CheckInOutSchema): AccomModel[] => {
  const { stdPersonText, maxPersonText, roomSizeM2, roomDetails, accomRoomAmenityTags } = accom ?? {};
  const { checkIn, checkOut } = checkInOutData ?? {};

  // 체크인아웃 값은 ticket.checkInOut 값을 참조
  const checkInOut = {
    title: GoodsAccomInfoTitle.CHECK_IN_OUT,
    contents: getFilteredContents([checkIn ?? '', checkOut ?? '']),
  };

  const person = {
    title: GoodsAccomInfoTitle.PERSON,
    contents: getFilteredContents([stdPersonText ?? '', maxPersonText ?? '', roomSizeM2 ? `${roomSizeM2}㎡` : '']),
  };

  const detail = {
    title: GoodsAccomInfoTitle.DETAIL,
    contents: getFilteredContents(roomDetails ?? []),
  };

  const amenity = {
    title: GoodsAccomInfoTitle.AMENITY,
    contents: getFilteredContents(accomRoomAmenityTags ?? []),
  };

  return [checkInOut, person, detail, amenity].filter(({ contents }) => !isEmpty(contents));
};

/**
 * header Data
 */
export const toGoodsModel = (detailGoods: GoodsSchema): GoodsModel => {
  const { fileList, brand: brandData, auction: auctionData, accom: accomData, ...props } = detailGoods;
  const headers = toGoodsCover(fileList);
  const brand = toGoodsBrand(brandData);
  const auction = auctionData ? toGoodsAuction(auctionData) : auctionData;
  const accom = toAccomModel(accomData, props.ticket?.checkInOut);

  return {
    ...props,
    headers,
    brand,
    auction,
    accom,
  };
};

/**
 * Auction Data
 */
const toGoodsAuction = (auction: AuctionSchema): AuctionModel => {
  return {
    ...auction,
    bidder: {
      ...auction.bidder,
      profileImage: {
        ...auction.bidder.profileImage,
        path: getImageLink(auction.bidder.profileImage.path, 192),
      },
    },
  };
};

/**
 * Cover Data
 */
const getGoodsVideoThumbnail = (file: FileModel): FileModel['thumbnailImage'] | null => {
  if (file.thumbnailImage) {
    return {
      ...file.thumbnailImage,
      path: getImageLink(file.thumbnailImage.path),
    };
  }

  return null;
};
const toGoodsCover = (fileList: FileListSchema[]): GoodsCoverModel[] => {
  return fileList.reduce((headers: GoodsCoverModel[], fileInfo: FileListSchema) => {
    const type = fileInfo.file.type ?? (fileInfo.videoPlayType !== null ? FileType.VIDEO : FileType.IMAGE);
    const addFile: GoodsCoverModel = {
      ...fileInfo,
      file: {
        ...fileInfo.file,
        path: getImageLink(fileInfo.file.path),
        thumbnailImage: type === FileType.VIDEO ? getGoodsVideoThumbnail(fileInfo.file) : null,
      },
      type,
    };
    return headers.concat(addFile);
  }, []);
};

/**
 * Brand Data
 */
const toGoodsBrand = (brand: GoodsSchema['brand']): BrandModel | null => {
  if (brand === null) {
    return null;
  }

  const { primaryImage: primarySvgData, ...props } = brand;
  const primaryImage = primarySvgData
    ? {
        ...primarySvgData,
        path: getImageLink(primarySvgData.path),
      }
    : null;

  return {
    ...props,
    primaryImage,
    primaryImageOriginal: primarySvgData,
  };
};

/**
 * 상품 상세 이미지
 */
export const toGoodsDetail = (lists: FileListSchema[]): GoodsDetailModel[] => {
  return lists.map((list) => {
    const { width: containerWidth, height: containerHeight } = getRatio(
      list.file.width ?? null,
      list.file.height ?? null,
    );
    const type = list.file.type ?? (list.videoPlayType !== null ? FileType.VIDEO : FileType.IMAGE);

    return {
      ...list,
      file: {
        ...list.file,
        path: getImageLink(list.file.path),
        thumbnailImage: type === FileType.VIDEO ? getGoodsVideoThumbnail(list.file) : null,
      },
      type,
      containerWidth,
      containerHeight,
    };
  });
};

/**
 * 이용 안내
 */
export const toDetailInfo = (info: DetailInfoSchema[]): DetailInfoModel[] => {
  return info.map(({ section, sectionName, items }) => {
    return {
      section,
      items: items
        .filter((item) => item.contents)
        .map((item) => {
          return {
            ...item,
            isBullet: false,
          };
        }),
      name: sectionName,
    };
  });
};

/**
 * 이용 안내 (ONDA)
 */
export const toDetailInfoOnda = (info: DetailInfoOndaSchema): DetailInfoOndaModel => {
  return {
    tabs: info.tabs.map(({ sections, ...tab }) => {
      return {
        ...tab,
        sections: sections
          .map(({ items, ...section }) => {
            return {
              ...section,
              items: items.filter(({ contents, contentList }) => contents || (contentList && contentList.length > 0)),
            };
          })
          .filter(({ items }) => items.length > 0),
      };
    }),
  };
};
