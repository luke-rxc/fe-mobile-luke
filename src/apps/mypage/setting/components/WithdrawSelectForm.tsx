import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Option, Select } from '@pui/select';
import { TextField } from '@pui/textfield';

export interface WithdrawSelectProps {
  reasonItems: { code: string; text: string }[];
  reasonCode: string;
  onChangeReasonCode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const WithdrawSelectForm = forwardRef<HTMLInputElement, WithdrawSelectProps>(
  ({ reasonItems, reasonCode, onChangeReasonCode: handleChangeReasonCode }, ref) => {
    return (
      <SelectWrapperStyled>
        <Select
          placeholder="탈퇴 사유 선택"
          placeholderStyleProps={{ disabled: false }}
          size="large"
          onChange={handleChangeReasonCode}
        >
          {reasonItems.map(({ code, text }) => (
            <Option key={code} value={code}>
              {text}
            </Option>
          ))}
        </Select>
        {reasonCode && (
          <TextFieldStyled
            ref={ref}
            type="textarea"
            placeholder="고객 경험을 개선할 수 있도록 자세히 작성해주세요(선택)"
          />
        )}
      </SelectWrapperStyled>
    );
  },
);
const SelectWrapperStyled = styled.div`
  padding: 2.4rem 2.4rem 0;
`;
const TextFieldStyled = styled(TextField)`
  margin: 1.2rem 0 1.6rem;
`;
