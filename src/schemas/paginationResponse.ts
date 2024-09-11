/**
 * Infinite Scroll 시 Pagination 정보
 */

interface PaginationPageAble {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: PaginationSort;
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
  unpaged: boolean;
}

interface PaginationSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PaginationResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: PaginationPageAble;
  sort: PaginationSort;
  size: number;
  totalPages: number;
  totalElements: number;
}
