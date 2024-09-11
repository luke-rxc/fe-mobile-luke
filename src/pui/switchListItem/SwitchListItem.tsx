import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Switch } from '@pui/switch';

export interface SwitchListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** 텍스트 */
  text?: React.ReactNode;
  /** 설명글 */
  description?: React.ReactNode;
  /** 좌측에 추가될 요수 */
  prefix?: React.ReactNode;
  /** Switch on/off */
  checked?: boolean;
  /** Switch 초기 on/off */
  defaultChecked?: boolean;
  /** Switch 비활성화 여부 */
  disabled?: boolean;
  /** Switch change event handler */
  onChangeSwitch?: (e: React.ChangeEvent<HTMLInputElement>, data: SwitchListItemProps) => void;
}
const SwitchListItemComponent = forwardRef<HTMLDivElement, SwitchListItemProps>((props, ref) => {
  const { text, description, prefix, checked, disabled, children, onChangeSwitch, ...rest } = props;

  const handleChangeSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSwitch?.(e, props);
  };

  return (
    <div ref={ref} {...rest}>
      {prefix && <span className="item-prefix">{prefix}</span>}

      <span className="item-content">
        <span className="item-text">
          {text}
          {children}
        </span>
        {description && <span className="item-description">{description}</span>}
      </span>

      <span className="item-suffix">
        <Switch checked={checked} disabled={disabled} onChange={handleChangeSwitch} />
      </span>
    </div>
  );
});

/**
 * SwitchListItem 피그마
 *
 * Notion - https://www.notion.so/rxc/SwitchListItem-9d7f623507674efe88a614f740b91c45
 */
export const SwitchListItem = styled(SwitchListItemComponent)`
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
  min-height: 5.6rem;

  .item-prefix {
    display: block;
    flex-shrink: 0;
    margin-right: ${({ theme }) => theme.spacing.s16};
  }

  .item-suffix {
    display: block;
    flex-shrink: 0;
    margin-left: ${({ theme }) => theme.spacing.s16};
  }

  .item-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
  }

  .item-text {
    display: block;
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  .item-description {
    display: block;
    margin-top: 0.6rem;
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
  }
`;
