import { TitleSection } from '@pui/titleSection';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { SearchRecommendationItemSchema } from '../schemas';
import { SearchRecommendationItem } from './SearchRecommendationItem';

interface SearchRecommendationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** 검색어 목록 */
  list: SearchRecommendationItemSchema[];
  /** 검색어 클릭 이벤트 */
  onClick: (query: string, id: number) => void;
  /** Intersection observer 콜백 이벤트 */
  onVisibility: (query: string, id: number) => void;
}

/**
 * 추천 검색어 리스트
 */
export const SearchRecommendation = ({ list, onClick, onVisibility }: SearchRecommendationProps) => {
  if (isEmpty(list)) {
    return null;
  }

  return (
    <Wrapper>
      <TitleSection title="추천 검색어" />
      <List>
        {list.map((item, index) => (
          <SearchRecommendationItem
            key={item.id}
            item={item}
            index={index + 1}
            onClick={({ query }) => onClick(query, index + 1)}
            onVisibility={(query) => onVisibility(query, index + 1)}
          />
        ))}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.s24};
`;

const List = styled.ol`
  overflow: hidden;
  overflow-x: auto;
  box-sizing: border-box;
  height: 4rem;
  padding: 0 2rem;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;
