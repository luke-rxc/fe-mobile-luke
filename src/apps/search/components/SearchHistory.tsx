import React, { useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { ButtonText } from '@pui/buttonText';
import { Chips, ChipsProps } from '@pui/chips';
import { Collapse } from '@pui/collapse';
import { TitleSection } from '@pui/titleSection';
import { SearchHistoryItemSchema } from '../schemas';

interface SearchHistoryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  history: SearchHistoryItemSchema[];
  onClick: (query: string) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

/**
 * 최근 검색어 리스트
 */
export const SearchHistory = styled(
  ({ history = [], onClick, onDelete, onDeleteAll, className }: SearchHistoryProps) => {
    const { confirm, generateHapticFeedback } = useWebInterface();
    const [expanded, setExpanded] = useState<boolean>(true);
    const classNames = classnames(className, { 'is-collapse': !expanded });

    /**
     * 최근 검색어 영역 hide
     */
    const handleCollapse = () => {
      setExpanded(false);
    };

    /**
     * 최근 검색어 영역 hide 이후 실행할 콜백 (실제 onDeleteAll가 호출)
     */
    const handleCollapseEnd = () => {
      onDeleteAll();
    };

    /**
     * 최근 검색어 전체 삭제 Confirm 및 hide
     */
    const handleClear = async () => {
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });
      (await confirm({ title: '전체 삭제할까요?' })) && handleCollapse();
    };

    /**
     * 검색어 삭제 이벤트 핸들러를 반환
     */
    const getDeleteHandler = (): Pick<ChipsProps<SearchHistoryItemSchema>, 'getChipProps' | 'onDeleteChip'> => {
      return history.length === 1
        ? // 검색어가 한 개 => 최근 검색어 영역 hide
          { getChipProps: () => ({ onDelete: handleCollapse }) }
        : // 검색어가 여려개 => 해당 검색어만 삭제
          { onDeleteChip: ({ id }) => onDelete(id) };
    };

    return (
      <Collapse
        expanded={expanded}
        className={classNames}
        collapseOptions={{ duration: 250, onCollapseEnd: handleCollapseEnd }}
      >
        <div className="search-history-inner">
          <TitleSection title="최근 검색어" suffix={<ButtonText onClick={handleClear}>전체 삭제</ButtonText>} />
          <Chips
            data={history}
            getKey={({ id }) => `${id}`}
            getLabel={({ query }) => query}
            onClickChip={({ query }) => onClick(query)}
            {...getDeleteHandler()}
          />
        </div>
      </Collapse>
    );
  },
)`
  overflow: visible !important;

  .search-history-inner {
    opacity: 1;
    transition: opacity 250ms;
    padding-bottom: 2.4rem;
  }

  &.is-collapse {
    .search-history-inner {
      opacity: 0;
    }
  }
`;
