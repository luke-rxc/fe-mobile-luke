import isEmpty from 'lodash/isEmpty';
import { ProviderListSchema, ListSchema } from '../schemas';

type ProviderListModel = ProviderListSchema['content'];
export type ListModel = ListSchema;

export const toProviderListModel = (lists: ProviderListSchema): ProviderListModel => {
  return isEmpty(lists?.content)
    ? []
    : lists.content.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
};
