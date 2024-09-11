import { LiveFaqItemSchema } from '../schemas';

/**
 * 라이브 FAQ item model
 */
export interface LiveFaqItemModel {
  id: number;
  question: string;
  answer: string;
}

/**
 * 라이브 FAQ item schema > 라이브 FAQ item model convert
 */
export const toLiveFaqItemModel = (item: LiveFaqItemSchema): LiveFaqItemModel => {
  return {
    ...item,
  };
};

/**
 * 라이브 FAQ list schema > 라이브 FAQ list model convert
 */
export const toLiveFaqListModel = (items: Array<LiveFaqItemSchema>): Array<LiveFaqItemModel> => {
  return items.map(toLiveFaqItemModel);
};
