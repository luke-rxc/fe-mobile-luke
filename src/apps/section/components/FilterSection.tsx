import styled from 'styled-components';
import { TitleSection } from '@pui/titleSection';
import type { FilterTagProps } from './FilterTag';
import { FilterTagList } from './FilterTagList';
import { FilterCollapseSection } from './FilterCollapseSection';

export interface FilterSectionGroupProps {
  name: string;
  child: FilterSectionGroupProps[] | FilterTagProps[];
  tagGroupId: number;
  selectedCount?: number;
}

export interface FilterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  // 첫번째 그룹 펼침 여부
  expandFirstGroup?: boolean;
  data: FilterSectionGroupProps;
  onToggleTag?: (
    tagProps: FilterTagProps,
    tagIndex: number,
    groupProps: Omit<FilterSectionGroupProps, 'child'>,
    groupIndex: number,
  ) => void;
}

// 1depth 타입 가드
const isSingleDepth = (child: FilterSectionGroupProps['child']): child is FilterTagProps[] => {
  return !child.some((sub) => 'child' in sub);
};

// 2depth 타입 가드
const isNestedDepth = (child: FilterSectionGroupProps['child']): child is FilterSectionGroupProps[] => {
  return child.some((sub) => 'child' in sub);
};

const FilterSectionComponent = ({
  className,
  expandFirstGroup = true,
  data,
  onToggleTag,
  ...props
}: FilterSectionProps) => {
  return (
    <div className={className} {...props}>
      <TitleSection title={data.name} />

      {/* Section 1depth */}
      {isSingleDepth(data.child) && (
        <FilterTagList
          tags={data.child}
          onToggleTag={(tagProps, tagIndex) => {
            onToggleTag?.(tagProps, tagIndex, { name: data.name, tagGroupId: data.tagGroupId }, 0);
          }}
        />
      )}

      {/* Section 2depth */}
      {isNestedDepth(data.child) &&
        data.child.map((child, groupIndex) => {
          // 첫번째 그룹 펼침 여부
          const isFirstExpanded = expandFirstGroup && !groupIndex;
          // 첫번째 그룹 펼침 여부 or 그룹 내 선택된 태그 있을 경우 펼침
          const expanded = isFirstExpanded || !!child.selectedCount;

          return (
            <FilterCollapseSection key={`${child.tagGroupId}`} title={child.name} expanded={expanded}>
              <FilterTagList
                tags={child.child as FilterTagProps[]}
                onToggleTag={(tagProps, tagIndex) => {
                  onToggleTag?.(tagProps, tagIndex, { name: child.name, tagGroupId: child.tagGroupId }, groupIndex);
                }}
              />
            </FilterCollapseSection>
          );
        })}
    </div>
  );
};

export const FilterSection = styled(FilterSectionComponent)`
  display: block;
  background: ${({ theme }) => theme.color.background.surface};
`;
