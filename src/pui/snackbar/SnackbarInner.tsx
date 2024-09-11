import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { Button } from '@pui/button';

export interface SnackbarActionProps {
  // 최대 4자
  label?: string;
  // 링크 주소
  href?: string;
  // onClick Event
  onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, snackbarId: string) => void;
  // highlighted (Button Color)
  highlighted?: boolean;
  // class Name
  className?: string;
}

export interface SnackActionComponentProps extends SnackbarActionProps {
  /**
   * Snackbar 고유 ID
   */
  snackbarId: string;
}

export interface SnackbarImageProps {
  src: string;
}

export interface SnackbarInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** title */
  title?: string;
  /** message */
  message: string;
  /**
   * image source 주소
   */
  image?: SnackbarImageProps;
  /**
   * 우측 버튼 제어
   */
  action?: SnackbarActionProps;
}

export interface SnackbarInnerComponentProps extends SnackbarInnerProps {
  /**
   * Snackbar 고유 ID
   */
  snackbarId: string;
}

/** 디자인 가이드 */
const GUIDE = {
  BUTTON_LABEL_SIZE: 4,
  BUTTON_DEFAULT_NAME: '이동',
} as const;

const SnackbarActionComponent: React.FC<SnackActionComponentProps> = ({
  label = GUIDE.BUTTON_DEFAULT_NAME,
  onClick,
  href,
  snackbarId,
  className,
}) => {
  const handleClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick?.(evt, snackbarId);
    if (href) {
      window.location.href = href;
    }
  };

  /** 가이드 : 최대 4자 */
  const buttonLabel = label.substring(0, GUIDE.BUTTON_LABEL_SIZE);

  return (
    <Button
      bold
      variant="primary"
      is="button"
      size="bubble"
      children={buttonLabel}
      onClick={handleClick}
      className={className}
    />
  );
};

const SnackbarInnerComponent: React.FC<SnackbarInnerComponentProps> = ({
  title,
  message,
  image,
  action,
  snackbarId,
  className,
  ...rest
}) => {
  return (
    <div
      className={classnames(className, {
        image: !!image,
      })}
      {...rest}
    >
      {image && (
        <div className="image-wrapper">
          <Image src={image.src} />
        </div>
      )}

      {(title || message) && (
        <div
          className={classnames('text-wrapper', {
            'align-center': !image && !title && !action,
          })}
        >
          {title && <p className="text title">{title}</p>}
          <p
            className={classnames('text', 'message', {
              'without-title': !title,
              'with-title': title,
            })}
          >
            {message}
          </p>
        </div>
      )}

      {action && (
        <SnackbarActionComponent
          {...action}
          snackbarId={snackbarId}
          className={classnames('action-wrapper', {
            highlighted: !!action.highlighted,
          })}
        />
      )}
    </div>
  );
};

export const SnackbarInner = styled(SnackbarInnerComponent)`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `1.5rem ${theme.spacing.s16}`};
  height: 6.4rem;
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.white};

  &.is-ios {
    color: ${({ theme }) => theme.color.whiteLight};
  }

  &.image {
    padding: 1rem 1.6rem;
    padding: ${({ theme }) => `1rem ${theme.spacing.s16}`};
  }

  .image-wrapper {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    width: 4.4rem;
    height: 4.4rem;
    margin-right: ${({ theme }) => theme.spacing.s12};
    overflow: hidden;
    background: ${({ theme }) => theme.color.white};
    border-radius: ${({ theme }) => theme.radius.r4};
  }

  .text-wrapper {
    width: 100%;
    font-size: ${({ theme }) => theme.fontSize.s15};
    text-align: left;
    overflow: hidden;

    &.align-center {
      text-align: 'center';
    }

    .text {
      ${({ theme }) => theme.mixin.ellipsis()};

      &.title {
        font-weight: ${({ theme }) => theme.fontWeight.bold};
      }

      &.message {
        font-weight: ${({ theme }) => theme.fontWeight.regular};
        &.without-title {
          ${({ theme }) => theme.mixin.multilineEllipsis(2, 17)};
          white-space: inherit;
        }
        &.with-title {
          font-size: ${({ theme }) => theme.fontSize.s12};
        }
      }
    }
  }

  ${Button} {
    position: relative;
    margin-left: 1.2rem;
    flex-shrink: 1;
    word-break: keep-all;
  }

  .action-wrapper {
    &.highlighted {
      background-color: ${({ theme }) => theme.color.semantic.live};
      color: #fff;
    }
  }
`;
