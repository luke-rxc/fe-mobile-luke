import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { List } from '@pui/list';
import { TitleSub } from '@pui/titleSub';
import { Divider } from '@pui/divider';
import { ListItemTable } from '@pui/listItemTable';
import { toKRW } from '@utils/toKRW';
import { Spinner } from '@pui/spinner';
import { ListItemSelect } from '@pui/listItemSelect';
import { TextField } from '@pui/textfield';
import { CameraFilled } from '@pui/icon';
import { Button } from '@pui/button';
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Collapse } from '@pui/collapse';
import { Chips } from '@pui/chips';
import classnames from 'classnames';
import { ClaimCauseTypes } from '../constants';
import { ClaimNoticeMessage, UploadFileText } from '../constants/claim';

interface ReasonProps {
  code: string;
  text: string;
}

interface ReasonItemProps extends ReasonProps {
  cause: {
    code: string;
    name: string;
  };
}

export interface ReturnReasonProps {
  reasons: Array<ReasonItemProps>;
  reasonError?: boolean;
  reasonCode?: string | null;
  className?: string;
  causeCode: string | null;
  causeName: string | null;
  sellerCause?: string | null;
  estimatedReturnShippingCost?: number | string;
  onChangeReturnReason: (params: ReasonItemProps) => void;
  onChangeDetailCause: (text: string) => void;
  isLoadingReturnShippingCost: boolean;
  detailInfoTitle?: string;
  // 첨부 파일 목록
  attachments?: {
    key: string;
    label: string;
    fileId: number;
    loading?: boolean;
  }[];
  // 첨부 파일 추가
  onUploadDetailReasonFile?: (files: File[]) => void;
  // 첨부 파일 제거
  onDeleteDetailReasonFile?: (fileId: number) => void;
  /** 반품/교환 여부  */
  claimType?: 'RETURN' | 'EXCHANGE';
}

const ReturnReasonItem = ({
  reasons,
  reasonError = false,
  reasonCode,
  className,
  causeCode,
  causeName,
  sellerCause,
  estimatedReturnShippingCost = 0,
  isLoadingReturnShippingCost,
  detailInfoTitle = '예상 반품 비용',
  attachments,
  claimType,
  onUploadDetailReasonFile,
  onDeleteDetailReasonFile,
  onChangeReturnReason: handleChangeReturnReason,
  onChangeDetailCause,
}: ReturnReasonProps) => {
  const shippingCostText =
    causeCode === ClaimCauseTypes.PURCHASER ? `${toKRW(+estimatedReturnShippingCost)} (구매자 부담)` : `판매자 부담`;

  const paymentText = claimType === 'RETURN' ? '환불금에서 차감' : '계좌이체 (계좌 정보 전달 예정)';

  // 첨부 파일 영역 Collapse
  const [expandedAttachment, setExpandedAttachment] = useState(false);
  /**
   * Collapse 영역 collapse/expand 상태값
   */
  const [expandedDetailArea, setExpandedDetailArea] = useState(false);

  // 첨부 파일 영역 Expand 처리
  useEffect(() => {
    setExpandedAttachment(!!attachments?.length);
  }, [attachments]);

  // 상세 정보 영역 Expand 처리
  useEffect(() => {
    setExpandedDetailArea(!!isLoadingReturnShippingCost);
  }, [isLoadingReturnShippingCost]);

  // file ref
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 첨부 파일 추가 버튼 클릭 이벤트
  const handleClickAddAttachments = () => {
    fileRef?.current?.click();
  };

  // 첨부 파일 Change event
  const handleChangeFiles: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { files } }) => {
    if (!files) return;
    if (files.length === 0) return;

    const uploadFiles = Array.from(files);

    onUploadDetailReasonFile?.(uploadFiles);
  };

  const handleChangeDetailCause = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDetailCause(e.target.value);
  };

  const ReasonRadioItem = ({ code, text, cause }: ReasonItemProps) => {
    return (
      <ListItemSelect
        is="div"
        title={text}
        type="radio"
        selectable
        checked={code === reasonCode}
        onChange={() => {
          handleChangeReturnReason({ code, text, cause });
        }}
      />
    );
  };

  return (
    <div className={className}>
      <div className="reason-inner">
        <List getKey={(data) => data.code} source={reasons} component={ReasonRadioItem} />
      </div>
      {isLoadingReturnShippingCost ? (
        <Spinner className="reason-spinner" />
      ) : (
        <Collapse expanded={!expandedDetailArea} collapseOptions={{ duration: 300 }}>
          {causeCode && causeName && (
            <>
              <Divider t="1.2rem" />
              <TitleSub title={detailInfoTitle} />
              <List>
                <ListItemTable titleWidth={80} title="배송비" text={shippingCostText} />
                {causeCode === ClaimCauseTypes.PURCHASER && (
                  <ListItemTable titleWidth={80} title="지불 방법" text={paymentText} />
                )}
              </List>
              {causeCode && causeCode === ClaimCauseTypes.SELLER && (
                <>
                  <TitleSub title="상세 사유" />
                  <DetailContentWrapperStyled>
                    <TextField
                      type="textarea"
                      placeholder="빠르게 도와드릴 수 있도록 자세히 작성해주세요"
                      value={sellerCause || ''}
                      error={reasonError}
                      maxLength={500}
                      onChange={handleChangeDetailCause}
                      helperText={!sellerCause?.trim() ? '내용을 입력해주세요' : '최대 500자까지 입력할 수 있습니다'}
                    />
                    <Button
                      className="attachment-button"
                      size="large"
                      variant="tertiaryline"
                      suffix={<CameraFilled size="1.8rem" />}
                      onClick={handleClickAddAttachments}
                      children="사진 첨부"
                      block
                      bold
                    />
                    <input
                      type="file"
                      ref={fileRef}
                      id="attachment-files"
                      accept="image/*, video/*"
                      multiple
                      hidden
                      onChange={handleChangeFiles}
                    />
                  </DetailContentWrapperStyled>
                  {/* 첨부 파일 목록 */}
                  <Collapse
                    expanded={expandedAttachment}
                    className={classnames({ 'is-collapse': !expandedAttachment })}
                    collapseOptions={{ duration: 250 }}
                  >
                    <Chips
                      className="attchement-chips"
                      data={attachments ?? []}
                      getChipProps={({ key, label, loading }) => ({ key, label, loading })}
                      onDeleteChip={({ fileId }) => onDeleteDetailReasonFile?.(fileId)}
                      deleteConfirm={{ enabled: true, title: UploadFileText.CONFIRM.TITLE }}
                    />
                  </Collapse>
                </>
              )}

              <Divider t="2.4rem" />
              <TitleSub title="교환/반품 검수 유의사항" />
              {ClaimNoticeMessage.map((message, index) => (
                <NoticeWrapperStyled key={uuid().slice(0, 8)}>
                  <NoticeRowWrapperStyled>
                    <NoticeIndexWrapperStyled>{index + 1}</NoticeIndexWrapperStyled>
                    <NoticeTextWrapperStyled>{message}</NoticeTextWrapperStyled>
                  </NoticeRowWrapperStyled>
                </NoticeWrapperStyled>
              ))}
            </>
          )}
        </Collapse>
      )}
    </div>
  );
};

export const ReturnReason = styled(ReturnReasonItem)`
  background: ${({ theme }) => theme.color.background.surface};
  .reason-inner {
    display: flex;
    flex-direction: column;

    .radio-label {
      overflow: hidden;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
      text-overflow: ellipsis;
    }
  }
  .detail-reason-title {
    margin-top: ${({ theme }) => `${theme.spacing.s12}`};
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
  }
  .reason-spinner {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 100%;
  }

  &.is-collapse {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .attchement-chips {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    margin-bottom: ${({ theme }) => `${theme.spacing.s12}`};
  }
`;

const DetailContentWrapperStyled = styled.div`
  padding: ${({ theme }) => `0 ${theme.spacing.s24}`};

  .attachment-button {
    margin: ${({ theme }) => `${theme.spacing.s12} 0`};
  }
`;

const NoticeWrapperStyled = styled.ul`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s24}`};
`;

const NoticeRowWrapperStyled = styled.div`
  display: flex;
`;

const NoticeIndexWrapperStyled = styled.span`
  min-width: 2.4rem;
  align-self: stretch;
  font: ${({ theme }) => theme.fontType.small};
  color: ${({ theme }) => theme.color.text.textSecondary};
`;

const NoticeTextWrapperStyled = styled.li`
  font: ${({ theme }) => theme.fontType.small};
  color: ${({ theme }) => theme.color.text.textSecondary};
`;
