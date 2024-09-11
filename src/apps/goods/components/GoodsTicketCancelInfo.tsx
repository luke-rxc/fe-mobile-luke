import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CollapseMoreSection, CollapseMoreSectionRef } from '@features/collapse/components';
import { TicketSchema } from '../schemas';

interface Props {
  ticketInfo: TicketSchema;
  onExpandView: () => void;
}

export const GoodsTicketCancelInfo: React.FC<Props> = ({ ticketInfo, onExpandView }) => {
  const { cancelPolicyMessages, cancelFeeContent } = ticketInfo;

  const collapseRef = useRef<CollapseMoreSectionRef>(null);
  const [expanded, setExpanded] = useState<boolean>(true);

  const expanderMaxLine = 3;

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
    onExpandView();
  };

  return (
    <Wrapper className={!expanded ? 'has-more-content' : ''} onClick={handleExpandView}>
      {/* 취소 정책 */}
      {cancelPolicyMessages.map((message) => (
        <p key={message} className="ticket-info">
          {message}
        </p>
      ))}

      {/* 취소 수수료 */}
      {cancelFeeContent && (
        <CollapseMoreSection ref={collapseRef} expanded={expanded} expanderMaxLine={expanderMaxLine}>
          <p>{cancelFeeContent}</p>
        </CollapseMoreSection>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textPrimary};

  .ticket-info {
    &:nth-child(2) {
      margin-top: ${({ theme }) => theme.spacing.s2};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  ${CollapseMoreSection} {
    &.has-more-button {
      &:active {
        opacity: 1;
      }
    }
  }

  &.has-more-content:active {
    opacity: 0.5;
  }
`;
