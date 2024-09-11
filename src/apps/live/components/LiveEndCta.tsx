import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Floating } from '@features/floating';
import { Button } from '@pui/button';

interface Props {
  onClickShowroom: () => void;
}

export const LiveEndCta = ({ onClickShowroom: handleClickShowroom }: Props) => {
  const [floating, setFloating] = useState<boolean>(false);

  useEffect(() => {
    setFloating(true);
  }, []);

  return (
    <Floating id="LIVE_END_CTA" floating={floating}>
      <ButtonStyled variant="primary" size="large" bold onClick={handleClickShowroom}>
        쇼룸 이동
      </ButtonStyled>
    </Floating>
  );
};

const ButtonStyled = styled(Button)`
  width: 100%;
`;
