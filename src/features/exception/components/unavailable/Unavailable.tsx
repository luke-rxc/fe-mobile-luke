import styled from 'styled-components';
import { Exception, ExceptionProps } from '@pui/exception';

export interface UnavailableProps extends ExceptionProps {
  startDate: string;
  endDate: string;
  className?: string;
}

/**
 * 서비스 정검 페이지 템플릿
 */
export const Unavailable = styled(({ startDate, endDate, className }: UnavailableProps) => {
  return (
    <Exception
      full
      title=""
      className={className}
      description={
        <>
          서비스 점검중입니다
          <br />
          (점검 시간 : {startDate} - {endDate})
        </>
      }
    />
  );
})``;
