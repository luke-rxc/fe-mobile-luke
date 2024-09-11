import { forwardRef, useCallback, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { Radio } from '@pui/radio';
import { CommentPageType } from '../../../constants';
import type { CommentReasonModel } from '../../../models';
import { usePresetCommentReportService } from '../../../services';

export type CommentReportProps = HTMLAttributes<HTMLDivElement> & {
  /** 댓글 타입 */
  commentType: CommentPageType;
  /** 코드 */
  code: string;
  /** 댓글 ID */
  replyId: number;
  /** 댓글 사유 */
  reasonItem: CommentReasonModel[];
  /** confirm */
  onConfirm: ({ isSuccess, message }: { isSuccess: boolean; message: string }) => void;
  /** cancel */
  onCancel: () => void;
};

const CommentReportComponent = forwardRef<HTMLDivElement, CommentReportProps>(
  ({ className, commentType, code, replyId, reasonItem, onConfirm, onCancel, ...props }, ref) => {
    const { handleRequestReport, isLoading } = usePresetCommentReportService({ commentType, code });
    const [selectedReason, setSelectedReason] = useState<CommentReasonModel | null>(null);
    const handleChangeSelect = useCallback((reason: CommentReasonModel) => {
      setSelectedReason(reason);
    }, []);

    const handleReport = useCallback(() => {
      if (!selectedReason) {
        return;
      }
      handleRequestReport(
        { replyId, reasonCode: selectedReason.code },
        {
          onSuccess: () => {
            onConfirm?.({
              isSuccess: true,
              message: '신고 되었습니다',
            });
          },
          onError: (error) => {
            onConfirm?.({
              isSuccess: false,
              message: error?.data?.message ?? '',
            });
          },
        },
      );
    }, [handleRequestReport, onConfirm, replyId, selectedReason]);

    return (
      <div ref={ref} className={className} {...props}>
        <div className="title">신고</div>
        <div className="select-wrapper">
          {reasonItem.length > 0 &&
            reasonItem.map((reason) => (
              <Radio
                block
                key={`reason_${reason.code}`}
                id={`reason_${reason.code}`}
                name="report"
                label={reason.text}
                onChange={() => handleChangeSelect(reason)}
              />
            ))}
        </div>
        <div className="buttons">
          <Button className="cancel" variant="tertiaryline" size="large" onClick={onCancel}>
            취소
          </Button>
          <Button
            className="confirm"
            variant="primary"
            size="large"
            disabled={isLoading || !selectedReason}
            onClick={handleReport}
          >
            확인
          </Button>
        </div>
      </div>
    );
  },
);

/**
 * 댓글 신고
 */
export const CommentReport = styled(CommentReportComponent)`
  width: 28rem;
  padding: 2.4rem 2.4rem 2.4rem 0;
  border-radius: ${({ theme }) => theme.radius.r12};
  background: ${({ theme }) => theme.color.background.surfaceHigh};
  color: ${({ theme }) => theme.color.text.textPrimary};
  & .title {
    padding-left: 2.4rem;
    font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
  }
  & .select-wrapper {
    padding-left: 1.6rem;
    margin: 2.4rem 0;
    ${Radio} {
      padding: 0.4rem 0;
      & .radio-label {
        font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
      }
    }
  }
  & .buttons {
    padding-left: 2.4rem;
  }

  ${Button} {
    width: calc(50% - 0.4rem);
    font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
    &:first-child {
      margin-right: 0.4rem;
    }
    &:last-child {
      margin-left: 0.4rem;
    }

    &.cancel {
      color: ${({ theme }) => theme.color.text.textTertiary};
      box-shadow: none;
    }
  }
`;
