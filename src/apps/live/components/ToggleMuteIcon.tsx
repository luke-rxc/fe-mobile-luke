import styled from 'styled-components';
import { Mute as MuteItem } from '@pui/lottie';
import { useTheme } from '@hooks/useTheme';

interface Props {
  show: boolean;
  active: boolean;
  onClickToggle: () => void;
}

export const ToggleMuteIcon = ({ show, active, onClickToggle: handleClickToggle }: Props) => {
  if (!show) {
    return null;
  }

  const { theme } = useTheme();
  return (
    <WrapperStyled>
      <MuteItem
        {...{
          toggle: {
            active,
            disabled: false,
            onClickToggle: handleClickToggle,
          },
          lottieColor: theme.light.color.white,
        }}
      />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  position: relative;
  background: ${({ theme }) => theme.light.color.gray20};
  border-radius: 1.6rem;

  ${MuteItem} {
    height: 3.2rem;
    padding: 0.4rem;
  }
`;
