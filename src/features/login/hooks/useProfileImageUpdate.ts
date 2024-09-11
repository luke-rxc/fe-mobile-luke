import { useMutation } from '@hooks/useMutation';
import { UploadDomainType, UploadFileType } from '@models/UploadModel';
import { createDebug } from '@utils/debug';
import { updateUserProfileImage as updateUserProfileImageApi, uploadFileByUrl } from '../apis';

const debug = createDebug('features:login:hooks:useProfileImageUpdate');

export const useProfileImageUpdate = () => {
  const { mutateAsync: upload } = useMutation(uploadFileByUrl);
  const { mutateAsync: updateUserProfileImage } = useMutation((id: number) => updateUserProfileImageApi(id));

  const update = async (profileImageUrl: string) => {
    try {
      const uploadParam = {
        domainType: UploadDomainType.USER,
        fileType: UploadFileType.IMAGE,
        fileURL: profileImageUrl,
      };
      const { id: imageId } = await upload(uploadParam);
      await updateUserProfileImage(imageId);
    } catch (e) {
      debug.error(e);
    }
  };

  return {
    update,
  };
};
