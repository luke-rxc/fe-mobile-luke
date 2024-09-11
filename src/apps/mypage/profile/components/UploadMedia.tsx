/* eslint-disable no-nested-ternary */
import { forwardRef, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFileType, UploadFileInfo, UploadFileType } from '@models/UploadModel';
import { getIsImageType, getIsVideoType, imageToDataUrl } from '@utils/file';
import { getImageLink } from '@utils/link';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { Button } from '@pui/button';

export type UploadMediaProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  fileInfo: UploadFileInfo; // 업로드 파일 모델
  resize?: number;
  onDelete?: (fileInfo: UploadFileInfo) => void;
  noBlurHash?: boolean;
};

const UploadMediaComponent = forwardRef<HTMLDivElement, UploadMediaProps>(
  ({ className, fileInfo, resize = 512, noBlurHash = true, onDelete, ...props }, ref) => {
    const { file, path = '', extension = '', fileType = '', blurHash = '' } = fileInfo;
    const [resourceUrl, setResourceUrl] = useState(path ? getImageLink(path, resize) : '');

    const isVideoType = file
      ? getFileType(file?.type) === UploadFileType.VIDEO
      : extension
      ? getIsVideoType(extension)
      : fileType === UploadFileType.VIDEO;
    const isImageType = file
      ? getFileType(file?.type) === UploadFileType.IMAGE
      : extension
      ? getIsImageType(extension)
      : fileType === UploadFileType.IMAGE;

    useEffect(() => {
      if (file && isImageType) {
        loadToImgUrl();
      } else if (file && isVideoType) {
        loadToVideoUrl();
      }

      async function loadToImgUrl() {
        if (!file) return;
        const dataUrl = await imageToDataUrl(file);
        dataUrl !== resourceUrl && setResourceUrl(dataUrl);
      }

      function loadToVideoUrl() {
        if (!file) return;
        const dataUrl = URL.createObjectURL(file);
        dataUrl !== resourceUrl && setResourceUrl(dataUrl);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, path, isVideoType, isImageType]);

    const handelRemoveFile = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onDelete?.(fileInfo);
      },
      [fileInfo, onDelete],
    );

    return (
      <div ref={ref} className={className} {...props}>
        {isVideoType && <Video src={resourceUrl} />}
        {isImageType && <Image src={resourceUrl} blurHash={!noBlurHash ? blurHash : null} />}
        {onDelete && (
          <Button className="delete" onClick={handelRemoveFile}>
            삭제
          </Button>
        )}
      </div>
    );
  },
);

/**
 * 미디어
 */
export const UploadMedia = styled(UploadMediaComponent)`
  width: 100%;
  height: 100%;
  position: relative;
  & .delete {
    position: absolute;
    top: 0;
    right: 0;
  }
`;
