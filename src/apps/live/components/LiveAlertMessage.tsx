import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LiveShowroomModel } from '../models';

interface Props {
  message: string | null;
  liveShowroom: LiveShowroomModel;
  onClearAlertMessage: () => void;
}

/**
 * 라이브 알림 메세지 component
 */
export const LiveAlertMessage = ({
  message,
  liveShowroom: { type, textColor, tintColor },
  onClearAlertMessage: handleClearAlertMessage,
}: Props) => {
  const [className, setClassName] = useState('default');
  useEffect(() => {
    if (!message) {
      return;
    }

    setClassName('show');
    const timeout = setTimeout(() => {
      setClassName('hide');
    }, 5000);

    const cleanMessageTimeout = setTimeout(() => {
      handleClearAlertMessage();
    }, 6000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeout);
      clearTimeout(cleanMessageTimeout);
    };
  }, [handleClearAlertMessage, message]);

  return (
    <WrapperStyled className={className}>
      <MessageStyled type={type} tintColor={tintColor} textColor={textColor}>
        {message}
      </MessageStyled>
    </WrapperStyled>
  );
};

const show = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const hide = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const WrapperStyled = styled.div`
  position: absolute;
  left: 0;
  top: 6.4rem;
  padding: 0 1.6rem;
  z-index: 3;

  &.default {
    opacity: 0;
  }

  &.show {
    animation: ${show} 1.5s forwards;
  }

  &.hide {
    animation: ${hide} 1s forwards;
  }
`;

const MessageStyled = styled.div<{
  type?: LiveShowroomModel['type'];
  tintColor?: LiveShowroomModel['tintColor'];
  textColor?: LiveShowroomModel['textColor'];
}>`
  background-color: ${({ tintColor }) => tintColor};
  color: ${({ textColor }) => textColor};
  font-size: ${({ theme }) => theme.fontSize.s15};
  opacity: 0.8;
  padding: 8px;
  border-radius: 0.8rem;
  line-height: 1.8rem;
  min-height: 3.4rem;
`;
