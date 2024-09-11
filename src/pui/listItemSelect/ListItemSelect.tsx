import React, { createElement, forwardRef, useRef, useLayoutEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import classnames from 'classnames';
import { Radio } from '@pui/radio';
import { Checkbox } from '@pui/checkbox';
import { Conditional } from '@pui/conditional';

export interface ListItemSelectProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'onClick'> {
  /** root element tag */
  is: keyof React.ReactHTML;
  /** input select ui */
  type: 'radio' | 'checkbox';
  /** input name */
  name?: string;
  /** input value */
  value?: string;
  /** 비활성화 유무 */
  disabled?: boolean;
  /** 선택 상태 */
  checked?: boolean;
  /** 기본 선택 상태값 */
  defaultChecked?: boolean;
  /** title */
  title?: React.ReactNode;
  /** description */
  description?: React.ReactNode;
  /** 우측요소 */
  suffix?: React.ReactNode;
  /** input(radio, checkbox) 기능 사용 유부 */
  selectable?: boolean;
  /** 클릭 이밴트 콜백 */
  onClick?: (e: React.MouseEvent<HTMLInputElement>, item: ListItemSelectProps) => void;
  /** 선택상태 변경 이밴트 콜백 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, item: ListItemSelectProps) => void;
}

export const ListItemSelectComponent = forwardRef<HTMLElement, ListItemSelectProps>((props, ref) => {
  const theme = useTheme();
  const labelRef = useRef<HTMLLabelElement>(null);
  const suffixRef = useRef<HTMLElement>(null);

  const {
    is,
    type,
    name,
    value,
    title,
    description,
    disabled,
    checked,
    defaultChecked,
    suffix,
    selectable = true,
    className: classNameProps,
    children,
    onClick,
    onChange,
    ...rest
  } = props;
  const className = classnames(classNameProps, { 'is-disabled': disabled });

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    onClick?.(e, props);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e, props);
  };

  const inputProps = {
    name,
    value,
    disabled,
    checked,
    defaultChecked,
    onChange: handleChange,
    onClick: handleClick,
  };

  useLayoutEffect(() => {
    if (suffixRef.current && labelRef.current) {
      const defaultBuffer = parseFloat(theme.spacing.s16) + parseFloat(theme.spacing.s8);
      const suffixWidth = (suffixRef.current.offsetWidth || 0) / 10;

      labelRef.current.style.paddingRight = `${defaultBuffer + suffixWidth}rem`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suffix]);

  return createElement(is, { ref, className, ...rest }, [
    <span key="wrapper" className="item-wrapper">
      <Conditional
        className="item-inner"
        condition={selectable}
        trueExp={<label ref={labelRef} />}
        falseExp={<span ref={labelRef} />}
      >
        {selectable && (
          <span className="item-input">
            {type === 'radio' ? <Radio is="span" {...inputProps} /> : <Checkbox is="span" {...inputProps} />}
          </span>
        )}
        <span className="item-content">
          {title && <span className="item-content-title">{title}</span>}
          {children && <span className="item-content-child">{children}</span>}
          {description && <span className="item-content-description">{description}</span>}
        </span>
      </Conditional>
      {suffix && (
        <span ref={suffixRef} className="item-suffix">
          {suffix}
        </span>
      )}
    </span>,
  ]);
});

export const ListItemSelect = styled(ListItemSelectComponent)`
  display: block;

  .item-wrapper {
    display: block;
    position: relative;
  }

  .item-inner {
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    min-height: 5.6rem;
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s12}`};
    padding-right: ${({ theme }) => theme.spacing.s24};
    font-size: 0;
    line-height: 0;
  }

  .item-input {
    display: block;
    flex-shrink: 0;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    padding-left: ${({ theme }) => theme.spacing.s4};

    &-title {
      display: flex;
      padding-top: ${({ theme }) => theme.spacing.s8};
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.medium};

      &:only-child {
        padding-top: 0;
      }
    }

    &-child {
      display: block;
    }

    &-description {
      display: flex;
      padding-top: ${({ theme }) => theme.spacing.s4};
      color: ${({ theme }) => theme.color.text.textHelper};
      font: ${({ theme }) => theme.fontType.mini};

      &:only-child {
        padding-top: 0;
      }
    }
  }

  .item-suffix {
    ${({ theme }) => theme.mixin.absolute({ t: '50%', r: theme.spacing.s16 })};
    transform: translate3d(0, -50%, 0);
  }

  &.is-disabled {
    .item-content {
      touch-action: none;

      &-title,
      &-child,
      &-description {
        color: ${({ theme }) => theme.color.text.textDisabled};
      }
    }
  }
`;
