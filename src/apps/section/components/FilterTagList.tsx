import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FilterTag, FilterTagProps } from './FilterTag';

export interface FilterTagListProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: FilterTagProps[];
  onToggleTag?: (tagProps: FilterTagProps, index: number) => void;
}

const FilterTagListComponent = forwardRef<HTMLDivElement, FilterTagListProps>(
  ({ className, tags, onToggleTag, ...props }, ref) => (
    <div className={className} ref={ref} {...props}>
      {tags.map((tag, index) => {
        const { id, name, ...rest } = tag;
        const handleTagToggle = (selected: boolean) => {
          onToggleTag?.({ ...tag, selected }, index);
        };

        return <FilterTag key={`${id}`} id={id} name={name} onToggle={handleTagToggle} {...rest} />;
      })}
    </div>
  ),
);

export const FilterTagList = styled(FilterTagListComponent)`
  display: flex;
  flex-wrap: wrap;
  padding: 0.8rem 2.4rem 2.4rem;
  gap: ${({ theme }) => theme.spacing.s8};
`;
