import styled from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { Gobackward, Location } from '@pui/icon';
import { useWebInterface } from '@hooks/useWebInterface';
import { ToolbarButtonTappedParams } from '@constants/webInterface';

export const SeatToolbar = () => {
  const { theme } = useTheme();
  const iconDefaultProps = { size: '2.4rem', colorCode: theme.color.black };
  const { emitToolbarButtonTapped } = useWebInterface();
  const handleToolbarTapped = ({ type }: ToolbarButtonTappedParams) => {
    emitToolbarButtonTapped({ type });
  };
  return (
    <ToolbarWrapperStyled>
      <IconWrapperStyled onClick={() => handleToolbarTapped({ type: 'view' })}>
        <Location {...iconDefaultProps} />
      </IconWrapperStyled>
      <IconWrapperStyled onClick={() => handleToolbarTapped({ type: 'refresh' })}>
        <Gobackward {...iconDefaultProps} />
      </IconWrapperStyled>
    </ToolbarWrapperStyled>
  );
};

const ToolbarWrapperStyled = styled.div`
  display: flex;
`;

const IconWrapperStyled = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.background.surface};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  user-select: none;
  &:active {
    opacity: 0.5;
  }
`;
