import get from 'lodash/get';
import toString from 'lodash/toString';
import { toGoodsListModel } from './GoodsModel';
import { toSectionsListModel } from './SectionsModel';
import { toContentListModel } from './ShowroomModel';

export type GoodsViewLogModel = { goods_id: string[]; goods_index: string[] };
export type ContentsViewLogModel = { contents_id: string[]; contents_index: string[] };
export type SectionsViewLogModel = { section_id: string[]; section_index: string[]; section_type: string[] };

/**
 * 상품 리스트 로깅 데이터 가공
 */
export const toGoodsViewLogModel = (goods?: ReturnType<typeof toGoodsListModel>): GoodsViewLogModel =>
  (goods || []).reduce<GoodsViewLogModel>(
    (acc, curr) => ({
      goods_id: [...acc.goods_id, toString(get(curr, 'goodsId'))],
      goods_index: [...acc.goods_index, toString(get(curr, 'data-index'))],
    }),
    { goods_id: [], goods_index: [] },
  );

/**
 * 콘텐츠 리스트 로깅 데이터 가공
 */
export const toContentsViewLogModel = (
  contents?: ReturnType<typeof toContentListModel>['contents'],
): ContentsViewLogModel =>
  (contents || []).reduce<ContentsViewLogModel>(
    (acc, curr) => ({
      contents_id: [...acc.contents_id, toString(get(curr, 'contentId'))],
      contents_index: [...acc.contents_index, toString(get(curr, 'data-index'))],
    }),
    { contents_id: [], contents_index: [] },
  );

/**
 * 섹션 리스트 로깅 데이터 가공
 */
export const toSectionsViewLogModel = (sections?: ReturnType<typeof toSectionsListModel>): SectionsViewLogModel =>
  (sections || []).reduce<SectionsViewLogModel>(
    (acc, curr) => ({
      section_id: [...acc.section_id, toString(get(curr, 'sectionId'))],
      section_index: [...acc.section_index, toString(get(curr, 'data-index'))],
      section_type: [...acc.section_type, toString(get(curr, 'type'))],
    }),
    { section_id: [], section_index: [], section_type: [] },
  );
