import styled from 'styled-components';
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { useTheme } from '@hooks/useTheme';
import { Empty, Stand, Wheelchair } from '@pui/icon';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { SeatFloatingType } from '../constants';

interface SeatTypeFloatingProps {
  items: Array<keyof typeof SeatFloatingType>;
  showSeatTypeFloating: boolean;
}

export const SeatTypeFloating = ({ items, showSeatTypeFloating }: SeatTypeFloatingProps) => {
  const { theme } = useTheme();
  const { isApp, isIOS } = useDeviceDetect();
  const iconDefaultProps = { size: '1.2rem', colorCode: isApp && isIOS ? theme.color.whiteLight : theme.color.white };
  return items.length > 0 ? (
    <FloatingBackgroundStyled className={classnames({ 'is-hide': !showSeatTypeFloating })}>
      <FloatingWrapperStyled
        className={classnames({
          'is-ios': isApp && isIOS,
        })}
      >
        {items.map((data: keyof typeof SeatFloatingType) => {
          return (
            <FloatingItemStyled key={uuid().slice(0, 8)}>
              {data === 'STANDING' && <Stand {...iconDefaultProps} />}
              {data === 'WHEELCHAIR_SEAT' && <Wheelchair {...iconDefaultProps} />}
              {data === 'PART_VIEW_SEAT' && <Empty {...iconDefaultProps} />}
              <span
                className={classnames({
                  'is-ios': isApp && isIOS,
                })}
              >
                {SeatFloatingType[data]}
              </span>
            </FloatingItemStyled>
          );
        })}
      </FloatingWrapperStyled>
    </FloatingBackgroundStyled>
  ) : (
    <></>
  );
};

const FloatingBackgroundStyled = styled.div`
  display: flex;
  padding: ${({ theme }) => `${theme.spacing.s12} 0`};
  justify-content: center;
  align-items: center;
  width: 100%;
  will-change: opacity;
  opacity: 1;
  transition: opacity 0.3s;
  &.is-hide {
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

const FloatingWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  max-width: 34.5rem;
  min-height: 3.2rem;
  border-radius: ${({ theme }) => `${theme.radius.r8}`};
  background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s16}`};
  font: ${({ theme }) => theme.fontType.micro};
  text-overflow: ellipsis;
  &.is-ios {
    background: rgba(44, 44, 44, 0.4);
    backdrop-filter: blur(2.5rem);
    color: ${({ theme }) => theme.color.whiteLight};
  }
`;

const FloatingItemStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;
