import { forwardRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import { Button, ButtonProps } from '@pui/button';
import { TAG_NAME_MAX_LENGTH } from '../constants';
import { useRegionEventListeners } from '../hooks';

export type FilterTagProps = Exclude<ButtonProps, 'id' | 'name'> & {
  // 태그 ID
  id: number;
  // 태그 이름
  name: string;
  // 태그 토글 이벤트
  onToggle?: (selected: boolean) => void;
};

const FilterTagComponent = forwardRef<HTMLDivElement, FilterTagProps>(
  ({ className, id, name, selected: defaultSelected = false, onToggle, ...props }, ref) => {
    const [selected, setSelected] = useState(defaultSelected);

    // 글자수 제한
    const text = name.length > TAG_NAME_MAX_LENGTH ? `${name.slice(0, TAG_NAME_MAX_LENGTH)}...` : name;

    const handleClick = () => {
      setSelected((prev) => !prev);
      window.dispatchEvent(new CustomEvent('prizm:region:filter:click', { detail: { selected: !selected, id, name } }));
    };

    useUpdateEffect(() => {
      onToggle?.(selected);
    }, [selected]);

    // 태그 버튼 초기화 이벤트 리스너
    useRegionEventListeners('prizm:region:filter:clear', () => {
      setSelected(false);
    });

    return (
      <div className={className} ref={ref}>
        <Button
          className="btn-tag"
          variant="tertiaryline"
          size="medium"
          selected={selected}
          onClick={handleClick}
          {...props}
          {...(selected && { variant: 'primary' })}
        >
          {text}
        </Button>
      </div>
    );
  },
);

export const FilterTag = styled(FilterTagComponent)`
  ${Button} {
    padding: 0 1.6rem;
  }
`;
