import React from 'react';
import styled from 'styled-components';
import { Exception, ExceptionProps } from '@pui/exception';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorTitle, ErrorMessage, ErrorActionButtonLabel } from '@features/exception/constants';

export type NetworkErrorProps = Pick<ExceptionProps, 'onAction' | 'className'>;

/**
 * 네트워크 에러 페이지 템플릿
 *
 * https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10816%3A51517
 */
export const NetworkError = styled(({ className, onAction }: NetworkErrorProps) => {
  const { reload } = useWebInterface();
  /** reload action */
  const handleClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line no-nested-ternary
    return onAction ? onAction(event) : reload();
  };

  return (
    <Exception
      full
      title={ErrorTitle.Network}
      description={ErrorMessage.Network}
      actionLabel={ErrorActionButtonLabel.RELOAD}
      className={className}
      onAction={handleClickAction}
    />
  );
})``;
