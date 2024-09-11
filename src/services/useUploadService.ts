import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import ExifReader from 'exifreader';
import {
  getFileType,
  UploadContentResponse,
  UploadDomainType,
  UploadFileInfo,
  UploadFileType,
} from '@models/UploadModel';
import { createDebug } from '@utils/debug';
import { postFile } from '../apis/postFile';

const debug = createDebug('content:service:useContentBrandService');

export type UploadProps = {
  domainType: UploadDomainType;
  initFileInfos?: UploadFileInfo[];
};

export const useUploadService = ({ domainType, initFileInfos = [] }: UploadProps) => {
  const [fileInfos, setFileInfos] = useState<Array<UploadFileInfo>>(initFileInfos);

  const {
    mutateAsync: mutateFileUpload,
    isLoading: isLoadingUploadContent,
    isError: isErrorUploadContent,
  } = useMutation(postFile);

  const onUpload = (updateFiles: Array<UploadFileInfo>, isOverwrite = false) => {
    const updateFileInfos = isOverwrite ? updateFiles : fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };

  const onDeleteImage = (fileName: string) => {
    setFileInfos(fileInfos.filter((info) => info?.file?.name !== fileName));
  };

  const onDelete = (uploadFileInfo: UploadFileInfo) => {
    const fileList = fileInfos.filter((info) => {
      if (uploadFileInfo.path) {
        return info?.path !== uploadFileInfo.path;
      }
      return info?.file?.name !== uploadFileInfo.file?.name;
    });
    setFileInfos(fileList);
  };

  const uploadContent = async (uploadFileInfos: UploadFileInfo[] = fileInfos) => {
    const fileInfo = await uploadFileInfos.reduce(async (promise, info) => {
      const result: Array<UploadFileInfo> = await promise.then();

      if (!info.file || (info.file && getFileType(info.file.type) !== UploadFileType.IMAGE)) {
        return Promise.resolve(result);
      }
      let updateFile = info.file;
      try {
        // 이미지 회전 체크
        updateFile = await readFileAsync(info.file);
      } catch (e) {
        debug.log(e);
      }

      const formData = new FormData();
      const fileType = getFileType(info.file.type);
      formData.append('domainType', domainType);
      formData.append('fileType', fileType);
      formData.append('file', updateFile);
      // 서버 업로드
      const uploadInfos: UploadContentResponse = await mutateFileUpload(formData);

      result.push({
        ...info,
        ...uploadInfos,
      });

      return Promise.resolve(result);
    }, Promise.resolve([] as Array<UploadFileInfo>));

    return fileInfo;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const draw = useCallback((image, width, height, mimeType, orientation) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
    }

    return canvas.toDataURL(mimeType);
  }, []);

  /**
   * image string을 binary로 전환
   * @param {string} dataUri canvas에서 추출한 data string
   * @param {string} type 이미지 타입
   */
  const dataUrlToBlob = useCallback((dataURI: string, type: string) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  }, []);

  const readFileAsync = useCallback(
    async (file) => {
      // flow
      // 1. input file에서 image upload
      // 2. File API중 FileReader를 사용하여 file의 data 확인
      // 3. reader.onload 에서 orientation 값 추출, 존재하는 경우 Image 인스턴스 생성
      // 4. read의 result값 == binary 데이터
      // 5. img src에 result값 삽입
      // 6. canvas 생성, img를 canvas에서 다시 그림 (drawImage)
      // 7. 해당 canvas의 toDataURL를 사용하여 dataUrl추출
      // 8. orientation 정보없는 이미지 파일로 생성하여 서버 업로드 진행

      return new Promise<File>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (!e.target?.result) {
            resolve(file);
            return;
          }
          const fileBuffer = e.target.result as ArrayBuffer;
          const tags = ExifReader.load(fileBuffer, { expanded: true });

          if (tags.exif?.Orientation) {
            const orientation = tags.exif.Orientation.value;
            debug.log(`파일 정보: ${tags}`);
            debug.log(`orientation value: ${orientation}`);
            const image = new Image();
            const blob = new Blob([fileBuffer], { type: file.type });
            const src = URL.createObjectURL(blob);
            image.onload = async () => {
              const { width } = image;
              const { height } = image;

              // canvas dataUrl
              const canvasData = draw(image, width, height, file.type, orientation);
              const imageBlob = dataUrlToBlob(canvasData, file.type);
              const newFile = new File([imageBlob as Blob], file.name);
              resolve(newFile);
            };
            image.onerror = () => {
              resolve(file);
            };
            image.src = src;
          } else {
            resolve(file);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    [dataUrlToBlob, draw],
  );

  return {
    fileInfos,
    isLoadingUploadContent,
    isErrorUploadContent,
    onDelete,
    onDeleteImage,
    onUpload,
    uploadContent,
  };
};
