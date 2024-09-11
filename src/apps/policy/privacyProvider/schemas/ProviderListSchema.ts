import { PaginationResponse } from '@schemas/paginationResponse';

export interface ListSchema {
  id: number;
  name: string;
}

/** load more interface를 위한 데이터 포멧 */
export type ProviderListSchema = PaginationResponse<ListSchema>;
