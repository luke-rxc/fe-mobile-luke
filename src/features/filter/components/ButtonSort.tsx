import styled from 'styled-components';
import { Button } from '@pui/button';
import { Sort } from '@pui/icon';

export type ButtonSortOptionType = Record<string, unknown> | number | string;

export interface ButtonSortProps<T extends ButtonSortOptionType = ButtonSortOptionType> {
  options?: T[];
  value?: string | number;
  defaultValue?: string | number;
  className?: string;
  getLabel?: (option: T, index: number) => string | number;
  getValue?: (option: T, index: number) => string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>, option: T, index: number) => void;
}

const ButtonSortComponent: React.FC<ButtonSortProps<ButtonSortOptionType>> = ({
  options,
  value,
  defaultValue,
  className,
  getLabel,
  getValue,
  onChange,
}) => {
  const getOptionLabel = (option: ButtonSortOptionType, index: number) => {
    if (getLabel) {
      return getLabel(option, index);
    }

    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }

    if (typeof option === 'object') {
      return `${option?.label || ''}` || index;
    }

    return index;
  };

  const getOptionValue = (option: ButtonSortOptionType, index: number) => {
    if (getValue) {
      return getValue(option, index);
    }

    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }

    if (typeof option === 'object') {
      return `${option?.value || ''}` || index;
    }

    return index;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange || !options) {
      return;
    }

    const selectIndex = e.target.options.selectedIndex;
    const selectOption = options[selectIndex];

    selectOption && onChange(e, selectOption, selectIndex);
  };

  return (
    <div className={className}>
      <Button variant="tertiaryline" size="bubble" children={<Sort />} tabIndex={-1} />
      <select value={value} defaultValue={defaultValue} onChange={handleChange}>
        {options?.map((option, index) => {
          const optionLabel = getOptionLabel(option, index);
          const optionValue = getOptionValue(option, index);

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const ButtonSort = styled(ButtonSortComponent)`
  position: relative;

  select {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
    background: transparent;
    -webkit-appearance: none;
    opacity: 0;
  }

  ${Button} {
    padding: ${({ theme }) => `0 ${theme.spacing.s12}`};
  }

  &:active {
    ${Button} {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }
` as (<T extends ButtonSortOptionType = ButtonSortOptionType>(
  props: ButtonSortProps<T>,
) => ReturnType<React.FC<ButtonSortProps<T>>>) &
  string;
