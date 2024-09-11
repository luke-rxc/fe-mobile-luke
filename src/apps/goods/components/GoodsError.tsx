import React from 'react';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { PageError, PageErrorProps } from '@features/exception/components';
import { ErrorActionButtonLabel } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

interface GoodsErrorProps extends PageErrorProps {
  /** Mweb: action button 없이 message 만 노출 여부 */
  showOnlyMessage?: boolean;
}

export const GoodsError: React.FC<GoodsErrorProps> = (props) => {
  const { isApp } = useDeviceDetect();
  const { showOnlyMessage = false, actionLabel, onAction, ...rest } = props;

  const {
    action: { handleErrorHomeCb },
  } = useErrorService();

  useHeaderDispatch({
    type: 'mweb',
    enabled: !isApp,
    quickMenus: ['cart', 'menu'],
  });

  const mwebProps = {
    actionLabel: actionLabel || ErrorActionButtonLabel.HOME,
    onAction: onAction || handleErrorHomeCb,
  };

  const appProps = { actionLabel, onAction };

  const exceptionProps = isApp ? { ...appProps } : { ...(!showOnlyMessage && mwebProps) };

  return (
    <Wrapper>
      <PageError {...rest} {...exceptionProps} isFull />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
