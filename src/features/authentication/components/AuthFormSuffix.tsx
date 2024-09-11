import { Button } from '@pui/button';
import styled from 'styled-components';

interface AuthFormSuffixProps {
  editable: boolean;
  disabled: boolean;
  isSend: boolean;
  onEdit: () => void;
  onSend: () => Promise<void>;
}

export const AuthFormSuffix = ({
  editable,
  disabled,
  isSend,
  onEdit: handleEdit,
  onSend: handleSend,
}: AuthFormSuffixProps) => {
  if (editable) {
    return (
      <ButtonStyled variant="primary" selected bold size="squircle" onClick={handleEdit}>
        변경
      </ButtonStyled>
    );
  }

  if (isSend) {
    return (
      <ButtonStyled variant="primary" selected bold size="squircle" onClick={handleSend} disabled={disabled}>
        재전송
      </ButtonStyled>
    );
  }

  return (
    <ButtonStyled variant="primary" bold size="squircle" onClick={handleSend} disabled={disabled}>
      인증
    </ButtonStyled>
  );
};

const ButtonStyled = styled(Button)`
  &.is-squircle {
    height: 4rem;
    min-width: 5rem;
  }
`;
