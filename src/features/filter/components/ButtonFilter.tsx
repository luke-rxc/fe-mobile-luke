import styled from 'styled-components';
import { Button } from '@pui/button';
import { Filter } from '@pui/icon';

export interface ButtonFilterProps {
  selected?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ButtonFilterComponent: React.FC<ButtonFilterProps> = ({ selected, onClick, className }) => {
  const variant = selected ? 'primary' : 'tertiaryline';

  return (
    <div className={className}>
      <Button size="bubble" variant={variant} selected={selected} onClick={onClick}>
        <Filter />
      </Button>
    </div>
  );
};

export const ButtonFilter = styled(ButtonFilterComponent)`
  position: relative;

  select {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
    background: transparent;
    -webkit-appearance: none;
    opacity: 0;
  }

  ${Button} {
    padding: ${({ theme }) => `0 ${theme.spacing.s12}`};

    &:active {
      transform: scale(1) !important;
    }
  }
`;
