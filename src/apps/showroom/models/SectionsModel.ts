import pick from 'lodash/pick';
import { userAgent } from '@utils/ua';
import { getBenefitTagType } from '@utils/benefitTagType';
import { getAppLink, getImageLink, getWebLink } from '@utils/link';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { AllViewLabelingCriteriaForFeed, ShowroomSectionType } from '../constants';
import { GoodsItemSchema, SectionGoodsItemSchema, SectionItemSchema } from '../schemas';
import { SectionItemProps, SectionsListProps } from '../components';

/**
 * 쇼룸 섹션 모델
 */
export const toSectionsListModel = (schema: SectionItemSchema[]): SectionsListProps['sections'] => {
  return (schema || []).map((section, i) => {
    if (section.type === ShowroomSectionType.GOODS) {
      return { ...toSectionGoodsModel(section), 'data-index': `${i + 1}` };
    }
    return { ...pick(section, ['type', 'title', 'sectionId']), content: [], headerList: [] };
  });
};

/**
 * 쇼룸 섹션 > 상품 모델
 */
export const toSectionGoodsModel = (schema: SectionGoodsItemSchema): SectionItemProps => {
  const { isApp } = userAgent();
  const { type, title, subTitle: subtitle, sectionId, content, headerList } = schema;
  const statusKr: { [k in GoodsItemSchema['goods']['status']]: string } = {
    NORMAL: '판매중',
    RUNOUT: '품절',
    UNSOLD: '판매중지',
  } as const;

  return {
    type,
    title,
    subtitle,
    sectionId,
    sectionLink:
      // eslint-disable-next-line no-nested-ternary
      content.length >= AllViewLabelingCriteriaForFeed
        ? isApp
          ? getAppLink(AppLinkTypes.SECTION_SHOWROOM, { sectionId, sectionType: 'goodslist' })
          : getWebLink(WebLinkTypes.SECTION_SHOWROOM, { sectionId, sectionType: 'goods' })
        : undefined,
    content: content.map(({ brand, goods }, i) => ({
      id: `${goods.id}`,
      goodsCode: goods.code,
      brandName: brand?.name ?? '',
      goodsName: goods.name,
      price: goods.price,
      discountRate: goods.discountRate,
      // prizmOnly: goods.isPrizmOnly,
      runOut: goods.isRunOut,
      image: {
        src: goods.primaryImage.path && getImageLink(goods.primaryImage.path, 512),
        blurHash: goods.primaryImage.blurHash,
      },
      hasCoupon: goods.hasCoupon,
      tagType: getBenefitTagType(goods.benefits?.tagType || ''),
      benefitLabel: goods.benefits?.label,
      'data-index': `${i + 1}`,
      'data-type': goods.type.toLocaleLowerCase(),
      'data-status': statusKr[goods.status],
    })),
    headerList: headerList.map((item) => ({
      id: item.id,
      title: item.title,
      referenceId: item.referenceId,
      landingLink: isApp ? item.landing.scheme : item.landing.web,
      image: {
        src: item.image.path && getImageLink(item.image.path),
        blurHash: item.image.blurHash,
      },
    })),
  };
};

export type SectionGoodsModel = {
  type: string;
  title: string;
  sectionId: number;
  content: GoodsCardSmallProps[];
};
