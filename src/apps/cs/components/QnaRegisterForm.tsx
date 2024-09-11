import { ChangeEventHandler, forwardRef, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import classnames from 'classnames';
import { Button } from '@pui/button';
import { Collapse } from '@pui/collapse';
import { Chips } from '@pui/chips';
import { CameraFilled } from '@pui/icon';
import { Select, Option } from '@pui/select';
import { TextField } from '@pui/textfield';
import { RequestTypes } from '../constants';

export interface QnaRegisterFormProps {
  // class
  className?: string;
  // 문의 종류
  type?: RequestTypes;
  // 문의 유형 목록
  inquiryFields?: Array<{ name: string; value: string }>;
  // 첨부 파일 목록
  attachments?: Array<{ key: string; token: string; label: string; link?: string; loading?: boolean }>;
  // 첨부 파일 추가
  onUpload?: (files: File[]) => void;
  // 첨부 파일 제거
  onClickCancelFile?: (token: string) => void;
  // 첨부 파일 업로드 진행중 여부
  isUploading?: boolean;
  // 문의 등록 진행중 여부
  isRegistering?: boolean;
  // 등록 완료 이벤트
  onSubmit: () => void;
}

// Validation Rules
const Rules = {
  // 문의 유형
  InquiryValue: { required: true },
  // 제목
  Subject: {
    required: { value: true, message: '필수 입력입니다' },
    minLength: 1,
    maxLength: { value: 20, message: '최대 20자까지 입력할 수 있습니다' },
    validate: { empty: (v: string) => v.trim().length > 0 || '제목을 입력해주세요' },
  },
  // 내용
  Body: {
    required: { value: true, message: '필수 입력입니다' },
    minLength: 1,
    maxLength: { value: 500, message: '최대 500자까지 입력할 수 있습니다' },
    validate: { empty: (v: string) => v.trim().length > 0 || '내용을 입력해주세요' },
  },
} as const;

const QnaRegisterFormComponent = forwardRef<HTMLFormElement, QnaRegisterFormProps>(
  (
    {
      className,
      type = RequestTypes.GENERAL,
      inquiryFields,
      attachments,
      onSubmit: handleSubmit,
      onUpload,
      onClickCancelFile,
      isUploading = false,
      isRegistering = false,
    },
    ref,
  ) => {
    const {
      register,
      formState: { isValid, errors },
    } = useFormContext();

    // 첨부 파일 영역 Collapse
    const [expanded, setExpanded] = useState(false);

    // 첨부 파일 기준 Expanded 처리
    useEffect(() => {
      setExpanded(!!attachments?.length);
    }, [attachments]);

    // file ref
    const fileRef = useRef<HTMLInputElement | null>(null);

    // 첨부 파일 추가 버튼 클릭 이벤트
    const handleClickAddAttachments = () => {
      fileRef?.current?.click();
    };

    // 첨부 파일 Change event
    const handleChangeFiles: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { files } }) => {
      if (!files) {
        return;
      }

      const uploadFiles = Array.from(files);

      onUpload?.(uploadFiles);
    };

    const disabledInquiryField = [RequestTypes.GOODS, RequestTypes.ADDITIONAL].some((value) => value === type);

    return (
      <form ref={ref} className={className} onSubmit={handleSubmit}>
        {/* 문의 내용 섹션 */}
        <div className="fieldset">
          {/* 문의 유형 (상품 문의시 문의유형 비활성) */}
          {!disabledInquiryField && inquiryFields && (
            <Select {...register('inquiryValue', Rules.InquiryValue)} size="large" placeholder="문의유형 선택">
              {inquiryFields.map(({ name, value }) => (
                <Option key={value} value={value}>
                  {name}
                </Option>
              ))}
            </Select>
          )}
          {/* 문의 제목 */}
          {type !== RequestTypes.ADDITIONAL && (
            <TextField
              {...register('subject', Rules.Subject)}
              placeholder="제목"
              helperText={errors.subject?.message ?? ''}
              error={!!errors.subject}
            />
          )}
          {/* 문의 내용 */}
          <TextField
            {...register('body', Rules.Body)}
            type="textarea"
            placeholder="빠르게 도와드릴 수 있도록 자세히 작성해주세요"
            helperText={errors.body?.message ?? ''}
            error={!!errors.body}
          />
          {/* 사진 첨부 */}
          <Button
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
            accept="image/*"
            multiple
            hidden
            onChange={handleChangeFiles}
          />
        </div>

        {/* 첨부 파일 목록 */}
        <Collapse
          expanded={expanded}
          className={classnames({ 'is-collapse': !expanded })}
          collapseOptions={{ duration: 250 }}
        >
          <Chips
            data={attachments ?? []}
            getChipProps={({ key, label, link, loading }) => ({ key, label, link, loading })}
            onDeleteChip={({ token }) => onClickCancelFile?.(token)}
            deleteConfirm={{ enabled: true }}
          />
        </Collapse>

        {/* 문의 등록 */}
        <div className="submit-wrapper">
          <Button
            disabled={isUploading || !isValid}
            loading={isRegistering}
            variant="primary"
            size="large"
            type="submit"
            block
            bold
          >
            완료
          </Button>
        </div>

        {/* 고객센터 안내 */}
        <div className="information-wrapper">
          <p className="title">PRIZM 고객센터 운영시간</p>
          <div className="inner">
            <div className="mark">•</div>
            <div className="description">
              <p>평일 오전 10시 - 오후 6시</p>
              <p>(점심시간 오후 12시 30분 - 1시 30분)</p>
            </div>
          </div>
        </div>
      </form>
    );
  },
);

export const QnaRegisterForm = styled(QnaRegisterFormComponent)`
  .fieldset {
    padding: 1.2rem 2.4rem;
  }

  ${Select},
  ${TextField},
  ${Chips} {
    margin-bottom: 1.2rem;
  }

  ${Collapse}.is-collapse {
    opacity: 0;
  }

  .submit-wrapper {
    padding: 1.2rem 2.4rem;
  }

  .information-wrapper {
    padding: 0 2.4rem;

    .title {
      padding: 1.9rem 0;
      font: ${({ theme }) => theme.fontType.mediumB};
      color: ${({ theme }) => theme.color.black};
    }

    .inner {
      display: flex;
      padding: 0.4rem 0;

      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.gray70};

      .mark {
        width: 2.4rem;
        height: 1.8rem;
      }
    }
  }
`;
