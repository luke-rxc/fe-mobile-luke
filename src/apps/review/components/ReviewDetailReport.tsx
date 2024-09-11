import { forwardRef, useCallback, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { Radio } from '@pui/radio';
import type { ReviewReportReasonModel } from '../models';
import { useReportService } from '../services';

/**
 * 리뷰 신고 팝업
 */
export type ReviewDetailReportProps = HTMLAttributes<HTMLDivElement> & {
  /** 리뷰 id */
  reviewId: number;
  /** confirm */
  onConfirm: ({ isSuccess, message }: { isSuccess: boolean; message: string }) => void;
  /** cancel */
  onCancel: () => void;
};

const ReviewDetailReportComponent = forwardRef<HTMLDivElement, ReviewDetailReportProps>(
  ({ className, reviewId, onConfirm, onCancel, ...props }, ref) => {
    const { reasonItem, isLoading, handleRequestReport } = useReportService();
    const [selectedReason, setSelectedReason] = useState<ReviewReportReasonModel | null>(null);
    const handleChangeSelect = useCallback((reason: ReviewReportReasonModel) => {
      setSelectedReason(reason);
    }, []);

    const handleReport = useCallback(() => {
      if (!selectedReason) {
        return;
      }
      handleRequestReport(
        { reviewId, reasonCode: selectedReason.code },
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
    }, [handleRequestReport, onConfirm, reviewId, selectedReason]);

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
 * 리뷰 신고
 */
export const ReviewDetailReport = styled(ReviewDetailReportComponent)`
  width: 28rem;
  padding: 2.4rem 2.4rem 2.4rem 0;
  border-radius: ${({ theme }) => theme.radius.s12};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.black};

  & .title {
    padding-left: 2.4rem;
    font: ${({ theme }) => theme.fontType.largeB};
  }

  & .select-wrapper {
    margin: 2.4rem 0;
    padding-left: 1.6rem;
    ${Radio} {
      padding: 0.4rem 0;

      & .radio-label {
        font: ${({ theme }) => theme.fontType.medium};
      }
    }
  }

  & .buttons {
    padding-left: 2.4rem;
  }

  ${Button} {
    width: calc(50% - 0.4rem);
    font: ${({ theme }) => theme.fontType.mediumB};

    &:first-child {
      margin-right: 0.4rem;
    }

    &:last-child {
      margin-left: 0.4rem;
    }

    &.cancel {
      box-shadow: none;
      color: ${({ theme }) => theme.color.gray50};
    }
  }
`;
