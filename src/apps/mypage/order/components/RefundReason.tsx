import styled from 'styled-components';
import { ChangeEvent } from 'react';
import { TextField } from '@pui/textfield';
import { List } from '@pui/list';
import { ListItemSelect } from '@pui/listItemSelect';

interface ReasonProps {
  code: string;
  text: string;
}

export interface RefundReasonProps {
  reasons: Array<ReasonProps>;
  reasonError?: boolean;
  showReasonText?: boolean;
  reasonCode?: string | null;
  className?: string;
  etcReason?: string | null;
  onChangeCancelReason: (code: string) => void;
  onChangeEtcReason: (text: string) => void;
}

export const RefundReasonItem = ({
  reasons,
  reasonError = false,
  showReasonText = false,
  reasonCode,
  className,
  etcReason,
  onChangeCancelReason,
  onChangeEtcReason,
}: RefundReasonProps) => {
  const handleChangeCancelReason = (code: string) => {
    onChangeCancelReason(code);
  };

  const handleChangeEtcReason = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeEtcReason(e.target.value);
  };

  const ReasonRadioItem = ({ code, text }: ReasonProps) => {
    return (
      <ListItemSelect
        is="div"
        title={text}
        type="radio"
        selectable
        checked={code === reasonCode}
        onChange={() => handleChangeCancelReason(code)}
      />
    );
  };

  return (
    <div className={className}>
      <div className="reason-inner">
        <List getKey={(data) => data.code} source={reasons} component={ReasonRadioItem} />
        {showReasonText && (
          <TextField
            type="textarea"
            helperText={!etcReason?.trim() ? '내용을 입력해주세요' : '최대 500자까지 입력할 수 있습니다'}
            placeholder="빠르게 도와드릴 수 있도록 자세히 작성해주세요"
            maxLength={500}
            value={etcReason || ''}
            error={reasonError}
            onChange={handleChangeEtcReason}
          />
        )}
      </div>
    </div>
  );
};

export const RefundReason = styled(RefundReasonItem)`
  background: ${({ theme }) => theme.color.background.surface};
  .reason-inner {
    display: flex;
    flex-direction: column;

    .radio-label {
      overflow: hidden;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
      text-overflow: ellipsis;
    }

    ${TextField} {
      padding: ${({ theme }) => `0 ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
    }
  }
`;
