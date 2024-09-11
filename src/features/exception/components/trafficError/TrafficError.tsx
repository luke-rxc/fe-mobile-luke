import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { Exception, ExceptionProps } from '@pui/exception';
import { ErrorTitle, ErrorMessage } from '@features/exception/constants';

export type TrafficErrorProps = Pick<ExceptionProps, 'onAction' | 'className'>;

/**
 * Traffic 몰릴때 (429) 페이지 템플릿
 *
 * https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=19715%3A50112
 */
export const TrafficError = styled(({ className, onAction }: TrafficErrorProps) => {
  const { isApp } = useDeviceDetect();
  const history = useHistory();
  const { close } = useWebInterface();

  const handleClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onAction) {
      onAction(event);
      return;
    }

    close(undefined, {
      doWeb: () => {
        history.goBack();
      },
    });
  };

  const actionProps = isApp
    ? {
        actionLabel: isApp ? '확인' : undefined,
        onAction: handleClickAction,
      }
    : {};

  return (
    <>
      <Exception
        full
        title={ErrorTitle.Traffic}
        description={ErrorMessage.Traffic}
        className={className}
        {...actionProps}
      />
    </>
  );
})``;
