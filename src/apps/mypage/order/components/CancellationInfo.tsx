import ko from 'date-fns/locale/ko';
import { format } from 'date-fns';
import styled from 'styled-components';
import { CollapseMoreSection, CollapseMoreSectionRef } from '@features/collapse/components';
import { useLayoutEffect, useRef, useState } from 'react';
import { TitleSub } from '@pui/titleSub';
import { ReasonArea } from './ReasonArea';

export interface CancellationInfoProps {
  /** 취소가능날짜 */
  cancelableDate?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** 티켓 취소 수수료 부과 여부 */
  isCancelFee?: boolean;
  /** 티켓 취소 수수료 부과 세부 정보 */
  cancelFeeContent?: string;
  /** 티켓 취소 수수료 정책 클릭 시 */
  onExpandMoreSection?: () => void;
  /** 숙박권 투숙일시 */
  bookingDate?: number;
  /** 취소 사유 */
  reasonText?: string;
}

const getCancelableDateAsString = (date: number) => {
  const cancelableDate = new Date(date);

  const todayYear = new Date().getFullYear();
  const cancelableYear = cancelableDate.getFullYear();
  const cancelableHHmm = format(cancelableDate, 'HH:mm');

  const yyyy = todayYear < cancelableYear ? 'yyyy년 ' : '';
  const hhmm = cancelableHHmm !== '23:59' ? ` a h시${cancelableDate.getMinutes() ? ' m분' : ''} 전` : '';

  return format(cancelableDate, `${yyyy}M월 d일(EEE)${hhmm}까지 취소 가능`, { locale: ko });
};

/**
 * 취소 정보 섹션
 */
const CancellationInfoComponent = ({
  cancelableDate,
  isCancelFee,
  cancelFeeContent,
  onExpandMoreSection,
  className,
  reasonText,
}: CancellationInfoProps) => {
  const cancelableDateAsString = !isCancelFee && cancelableDate && getCancelableDateAsString(cancelableDate);
  const collapseRef = useRef<CollapseMoreSectionRef>(null);
  const [expanded, setExpanded] = useState<boolean>(true);
  const EXPAND_MAX_LINE = 3;
  useLayoutEffect(() => {
    if (!collapseRef.current) {
      return;
    }

    const { ref, collapsedHeight } = collapseRef.current;
    if (collapseRef.current && ref.offsetHeight > collapsedHeight) {
      setExpanded(false);
    }
  }, []);

  const handleExpandView = () => {
    if (expanded) {
      return;
    }
    setExpanded(true);
    onExpandMoreSection?.();
  };

  return (
    <div className={className}>
      <TitleSub title="취소 정보" />
      <ReasonArea className={className} title="취소 사유" reasonText={reasonText} />
      {isCancelFee ? (
        <div className="collapse-wrapper">
          <CollapseMoreSection
            ref={collapseRef}
            expanded={expanded}
            expanderMaxLine={EXPAND_MAX_LINE}
            onExpandView={handleExpandView}
          >
            <p className="description-text">{cancelFeeContent}</p>
          </CollapseMoreSection>
        </div>
      ) : (
        cancelableDateAsString && <p className="description-text">{cancelableDateAsString}</p>
      )}
    </div>
  );
};

export const CancellationInfo = styled(CancellationInfoComponent)`
  .collapse-inner {
    padding-bottom: 0;
  }
  .collapse-wrapper {
    white-space: pre-wrap;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    .description-text {
      padding: 0;
    }
  }
  .description-text {
    ${({ theme }) => theme.mixin.wordBreak()}
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
  }
`;
