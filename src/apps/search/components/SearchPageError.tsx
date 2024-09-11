import styled from 'styled-components';
import { PageError, PageErrorProps } from '@features/exception/components';

export const SearchPageError = styled(({ className, ...props }: PageErrorProps & { className?: string }) => {
  return (
    <div className={className}>
      <PageError isFull={false} {...props} />
    </div>
  );
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 18rem;
`;
