import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadMedia } from './UploadMedia';

export type UploadViewerProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  fileInfos: UploadFileInfo[];
  resize?: number;
  onDelete?: (fileInfo: UploadFileInfo) => void;
  noBlurHash?: boolean;
};

const UploadViewerComponent = forwardRef<HTMLDivElement, UploadViewerProps>(
  ({ className, children, fileInfos, resize, onDelete, noBlurHash = true, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {fileInfos.length > 0 &&
          fileInfos.map((info, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <UploadMedia key={index} fileInfo={info} resize={resize} onDelete={onDelete} noBlurHash={noBlurHash} />
            );
          })}
      </div>
    );
  },
);

/**
 * 파일 업로드 뷰어
 */
export const UploadViewer = styled(UploadViewerComponent)`
  width: 100%;
  height: 100%;
`;
