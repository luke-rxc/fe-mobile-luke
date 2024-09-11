import React from 'react';
import styled from 'styled-components';
import { Exception, ExceptionProps } from '@pui/exception';
import { useWebInterface } from '@hooks/useWebInterface';

export type TemporaryErrorProps = Pick<ExceptionProps, 'onAction' | 'className'>;

/**
 * 일시적인 에러 페이지 템플릿
 */
export const TemporaryError = styled(({ className, onAction }: TemporaryErrorProps) => {
  const { reload } = useWebInterface();
  /** reload action */
  const handleClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line no-nested-ternary
    return onAction ? onAction(event) : reload();
  };

  return (
    <Exception
      full
      title="일시적인 오류가 발생했습니다"
      description="다시 시도해주세요"
      actionLabel="다시 시도"
      className={className}
      onAction={handleClickAction}
    />
  );
})``;
