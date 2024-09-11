import { forwardRef, HTMLAttributes, useRef, useCallback } from 'react';
import type { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import { UploadModuleProps } from '@models/UploadModel';
import { isAvailableUploadType } from '@utils/file';

export type UploadButtonProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> &
  Omit<UploadModuleProps, 'onDeleteImage'> & {
    accept?: string;
  };

const UploadButtonComponent = forwardRef<HTMLDivElement, UploadButtonProps>(
  (
    {
      className,
      children,
      fileInfos,
      onUpload,
      maxUploadLen = 1,
      /** 22.11.04 기준 유저향 비디오 업로드 지원 X */
      accept = 'image/*',
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isMultiple = maxUploadLen > 1;

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      ({ currentTarget: { files: uploadFiles } }) => {
        if (!uploadFiles) return;
        if (uploadFiles.length === 0) return;

        const acceptedFiles = Array.from(uploadFiles).filter((file) => {
          if (!file) return false;
          if (!isAvailableUploadType(file.type)) {
            /* showToast({
                autoDismiss: 2500,
                message: '첨부파일은 JPG, PNG, GIF, MP4, MOV파일만 가능합니다.',
              }); */
            return false;
          }

          if (fileInfos.find((info) => info.file === file)) {
            return false;
          }
          return true;
        });

        if (acceptedFiles.length === 0) return;

        if (isMultiple && acceptedFiles.length + fileInfos.length > maxUploadLen) {
          /* showToast({
                autoDismiss: 2500,
                message: '첨부파일은 최대 3개까지 등록 가능합니다.',
              }); */
          onUpload(
            acceptedFiles.slice(0, maxUploadLen - fileInfos.length).map((file) => {
              return {
                file,
              };
            }),
          );
        } else {
          onUpload(
            acceptedFiles.map((file) => {
              return {
                file,
              };
            }),
          );
        }

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
      [isMultiple, fileInfos, maxUploadLen, onUpload],
    );

    return (
      <div ref={ref} className={className} {...props}>
        <input
          ref={inputRef}
          accept={accept}
          disabled={isMultiple && (fileInfos?.length ?? 0) > maxUploadLen - 1}
          hidden
          id="button-multiple-file"
          multiple={isMultiple}
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="button-multiple-file">{children}</label>
      </div>
    );
  },
);

/**
 * 파일 업로드 버튼
 */
export const UploadButton = styled(UploadButtonComponent)``;
