import { useState } from 'react';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { UploadFileType, getFileType } from '@models/UploadModel';
import { uploadFile } from '@apis/postFile';
import { UPLOAD_FILE_MAX_COUNT, UPLOAD_FILE_MAX_SIZE, UploadFileText } from '../constants';

interface AttachmentsType {
  key: string;
  label: string;
  fileId: number;
  loading?: boolean;
}

export const useClaimUploadService = () => {
  const { showToastMessage } = useWebInterface();
  // 첨부 파일 목록
  const [attachments, setAttachments] = useState<AttachmentsType[]>([]);
  /**
   * 파일 업로드 호출
   */
  const { mutateAsync: executeUpload, isLoading: isLoadingUploadFile } = useMutation(uploadFile, {
    onError: () => {
      showToastMessage({ message: '잠시 후 다시 시도해주세요' });
    },
  });

  const DOMAIN_TYPE = 'RETURN';
  /**
   * 파일 업로드 함수
   */
  const handleUploadFiles = async (files: File[]) => {
    // 전체 업로드 파일 수
    const uploadCount = attachments.length + files.length;

    // 최대 업로드 파일 수 제한
    if (uploadCount > UPLOAD_FILE_MAX_COUNT) {
      showToastMessage({ message: UploadFileText.TOAST.MAX_COUNT });
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const file of files) {
      try {
        const currentFile = { key: file.name, label: file.name };
        setAttachments((prev) => [{ ...currentFile, fileId: 0, loading: true }, ...prev]);

        // 파일 크기 체크
        if (file.size > UPLOAD_FILE_MAX_SIZE) {
          const sizeError = new Error(UploadFileText.TOAST.LIMIT_SIZE);
          sizeError.name = `CustomError`;
          throw sizeError;
        }

        const formData = new FormData();
        const fileType = getFileType(file.type);
        formData.append('domainType', DOMAIN_TYPE);
        formData.append('fileType', fileType);
        formData.append('file', file);
        formData.append('blurHash', fileType === UploadFileType.IMAGE ? 'true' : 'false');
        formData.append('sound', fileType === UploadFileType.VIDEO ? 'true' : 'false');

        const data = await executeUpload(formData);
        data && setAttachments((prev) => [{ ...currentFile, fileId: data.id, loading: false }, ...prev.slice(1)]);
      } catch (error) {
        const customMessage = isObject(error) && get(error, 'name') === 'CustomError' && get(error, 'message');
        if (!get(error, 'data') && !customMessage) {
          return;
        }
        showToastMessage({ message: customMessage || '파일에 오류가 있습니다' });
        setAttachments((prev) => [...prev.slice(1)]);
      }
    }
  };

  /**
   * 화면상 업로드 파일 삭제
   */
  const handleDeleteFile = (deleteFileId: number) => {
    setAttachments((prev) => [...prev.filter(({ fileId }) => fileId !== deleteFileId)]);
  };

  return {
    attachments,
    isLoadingUploadFile,
    handleUploadFiles,
    handleDeleteFile,
  };
};
