import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { createDebug } from '@utils/debug';
import { TemporaryError } from '../temporaryError';

const debug = createDebug('exception:errorBoundary');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThrowErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return <TemporaryError />;
};

const handleError = (error: Error, info: { componentStack: string }) => {
  /** @todo Error 로깅 처리 등 */
  debug.log('handleError %O', error);
  debug.log('handleError %O', info.componentStack);
};

export const ThrowErrorBoundary: React.FC = ({ children }) => (
  <ErrorBoundary FallbackComponent={ThrowErrorBoundaryFallback} onError={handleError}>
    {children}
  </ErrorBoundary>
);
