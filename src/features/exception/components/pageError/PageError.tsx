import React from 'react';
import { ErrorModel } from '@utils/api/createAxios';
import { Exception, ExceptionProps } from '@pui/exception';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useErrorService } from '../../services';
import { ErrorStatus, ErrorTitle, ErrorMessage, ErrorActionButtonLabel } from '../../constants';

interface ExceptionMainProps extends Pick<ExceptionProps, 'onAction'> {
  title?: string;
  description?: string;
  actionLabel?: string;
  isFull?: boolean;
  className?: string;
}

type HandleErrorStatus = {
  [key in number]: ExceptionMainProps;
};

export interface PageErrorProps extends ExceptionMainProps {
  /** API Error Model */
  error?: ErrorModel | null;
  /** API Error Model중에 메시지를 못받은 케이스에 대응하는 공통 메시지 */
  defaultMessage?: string;
  /** custom status 처리 */
  status?: HandleErrorStatus;
}

/**
 * #### Figma의 MWeb Empty / Error ([Guide 문서 링크](https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10699%3A53366))
 */
export const PageError: React.FC<PageErrorProps> = ({
  error,
  title: customTitle,
  description: customDescription,
  actionLabel,
  onAction: handleAction,
  isFull = true,
  defaultMessage,
  status = {},
  className,
}) => {
  const { isApp } = useDeviceDetect();

  const {
    action: { handleErrorConfirmCb, handleErrorReloadCb },
  } = useErrorService();

  const { data, status: httpStatus } = error ?? {};
  const title = customTitle || data?.title || '';
  const message = customDescription || data?.message || defaultMessage || ErrorMessage.Network;

  /**
   * custom status 처리
   */
  const statusList = Object.keys(status);

  if (httpStatus && statusList.length) {
    const isMatchedStatus = statusList.includes(`${httpStatus}`);

    if (isMatchedStatus) {
      const {
        title: statusTitle,
        description,
        actionLabel: statusActionLabel,
        onAction: handleStatusAction,
      } = status[httpStatus];

      const baseProps = {
        title: statusTitle,
        description,
        full: isFull,
      };

      const actionProps =
        statusActionLabel && handleStatusAction
          ? {
              actionLabel: statusActionLabel,
              onAction: handleStatusAction,
            }
          : null;

      const exceptionProps = actionProps
        ? {
            ...baseProps,
            ...actionProps,
          }
        : { ...baseProps };

      return <Exception className={className} {...exceptionProps} />;
    }
  }

  /**
   * 429 Error
   */
  if (httpStatus === ErrorStatus.Traffic) {
    const actionProps = !isApp
      ? {
          actionLabel: ErrorActionButtonLabel.CONFIRM,
          onAction: handleErrorConfirmCb,
        }
      : {};
    return (
      <Exception
        className={className}
        full={isFull}
        title={ErrorTitle.Traffic}
        description={ErrorMessage.Traffic}
        {...actionProps}
      />
    );
  }

  /**
   * 500, network Error
   */
  if (error && (!httpStatus || httpStatus >= 500)) {
    const actionProps = !isApp
      ? {
          actionLabel: ErrorActionButtonLabel.RELOAD,
          onAction: handleErrorReloadCb,
        }
      : {};
    return (
      <Exception
        className={className}
        full={isFull}
        title={ErrorTitle.Network}
        description={ErrorMessage.Network}
        {...actionProps}
      />
    );
  }

  return (
    <Exception
      className={className}
      full={isFull}
      title={title}
      description={
        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      }
      actionLabel={actionLabel}
      onAction={handleAction}
    />
  );
};
