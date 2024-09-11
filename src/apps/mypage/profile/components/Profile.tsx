import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { ImageFileType } from '@constants/file';
import { WebLinkTypes } from '@constants/link';
import { userQueryKey } from '@constants/user';
import { useDialog } from '@hooks/useDialog';
import { useLink } from '@hooks/useLink';
import { UserModel } from '@models/UserModel';
import { UploadDomainType, UploadFileInfo, UploadFileType } from '@models/UploadModel';
import { useUploadService } from '@services/useUploadService';
import { Button } from '@pui/button';
import { CameraFilled } from '@pui/icon';
import { Image } from '@pui/image';
import { TextField } from '@pui/textfield';
import { getWebLink } from '@utils/link';
import { FormFields } from '../models';
import { useProfileService } from '../services';
import { UploadButton } from './UploadButton';
import { UploadViewer } from './UploadViewer';

export type ProfileProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  user: UserModel;
};
const ProfileComponent = forwardRef<HTMLDivElement, ProfileProps>(({ className, user }, ref) => {
  const { openDialog } = useDialog();
  const { toLink } = useLink();
  const queryClient = useQueryClient();
  const { handleUpdateProfile, isLoading, isError, error } = useProfileService();
  const { nickname, profileImage } = user;
  const { id: profileImageId, fileType: imageFileType, height, path, width, blurHash } = profileImage;
  const [isShowButton, setIsShowButton] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const imageId = useRef<number | null>(profileImageId);

  const { fileInfos, onUpload, uploadContent, isErrorUploadContent, isLoadingUploadContent } = useUploadService({
    domainType: UploadDomainType.USER,
    initFileInfos: [
      {
        path,
        fileType: imageFileType === ImageFileType.IMAGE ? UploadFileType.IMAGE : undefined,
        width,
        height,
        blurHash,
      },
    ],
  });

  const formMethod = useForm<FormFields>({
    defaultValues: {
      nickname,
      profileImageId,
    },
  });
  const { handleSubmit, register, watch, setValue } = formMethod;

  const watchNickName = watch('nickname');
  const [noneName, setNoneName] = useState(true);
  /**
   * 닉네임 변경
   */
  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsShowButton(!!e.target.value);
      setValue('nickname', e.target.value);
      setErrorMessage('');
      setErrorState(false);
    },
    [setValue],
  );

  /**
   * 이미지 변경
   */
  const handleChangeThumbnail = useCallback(
    (updateFiles: UploadFileInfo[]) => {
      onUpload(updateFiles, true);
      setIsShowButton(true);
      imageId.current = null;
    },
    [onUpload],
  );

  const handleSubmitProfile = useCallback(
    async (values: FormFields) => {
      if (!/^[가-힣a-z0-9-_\\.]{4,20}$/g.test(values.nickname)) {
        setErrorMessage('4-20자의 한글, 영문 소문자, 숫자 및 일부 특수문자(- . _)만 입력하실 수 있습니다');
        setErrorState(true);
        return;
      }

      if (!imageId.current) {
        const uploadFileInfos = await uploadContent(fileInfos);
        if (uploadFileInfos.length) {
          imageId.current = uploadFileInfos[0].id ?? null;
        }
      }

      handleUpdateProfile(
        {
          nickname: values.nickname,
          profileImageId: imageId.current,
        } as FormFields,
        {
          onSuccess: () => {
            queryClient.invalidateQueries(userQueryKey);
            openDialog({
              desc: '프로필을 설정했습니다',
              confirm: {
                label: '확인',
                cb: () => {
                  setIsShowButton(false);
                  toLink(getWebLink(WebLinkTypes.MYPAGE));
                },
              },
            });
          },
        },
      );
    },
    [handleUpdateProfile, uploadContent, fileInfos, openDialog, queryClient, toLink],
  );

  useEffect(() => {
    setNoneName(!!watchNickName === false);
  }, [watchNickName]);

  useEffect(() => {
    if (isError && error?.data) {
      const { data } = error;
      const msg = data.errors.length > 0 ? error.data?.errors[0].reason : error.data.message;
      setErrorMessage(msg);
      setErrorState(true);
      return;
    }
    setErrorMessage('');
    setErrorState(false);
  }, [error, isError]);

  useEffect(() => {
    if (isErrorUploadContent) {
      openDialog({
        title: '일시적인 오류가 발생하였습니다',
        desc: '다시 시도해주세요',
        confirm: {
          label: '확인',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorUploadContent]);

  return (
    <div className={className} ref={ref}>
      <FormProvider {...formMethod}>
        <form onSubmit={handleSubmit(handleSubmitProfile)}>
          <div className="thumb">
            <div className="inner">
              <UploadButton accept="image/*" fileInfos={fileInfos} onUpload={handleChangeThumbnail} maxUploadLen={1}>
                <UploadViewer fileInfos={fileInfos} resize={512} />
                <div className="upload">
                  <CameraFilled />
                </div>
              </UploadButton>
            </div>
          </div>

          <div className="name">
            <h2 className="title">닉네임</h2>
            <TextField
              {...register('nickname', { required: true })}
              placeholder="4-20자의 한글, 영문 소문자, 숫자, 특수문자(- . _)"
              onChange={handleChangeName}
              error={errorState}
              helperText={errorMessage}
              disabled={isLoading || isLoadingUploadContent}
              className={classNames({ 'is-none': noneName })}
            />
          </div>
          {isShowButton && (
            <Button
              type="submit"
              block
              bold
              variant="primary"
              size="large"
              disabled={isLoading || isLoadingUploadContent}
            >
              완료
            </Button>
          )}
        </form>
      </FormProvider>
    </div>
  );
});

export const Profile = styled(ProfileComponent)`
  padding: 0 2.4rem;

  & .thumb {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.6rem 0 1.2rem;

    & .inner {
      position: relative;
      width: 9.6rem;
      height: 9.6rem;
      ${UploadButton} {
        width: 100%;
        height: 100%;
      }
      ${Image} {
        border-radius: 50%;
      }

      & .upload {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 4rem;
        height: 4rem;
        bottom: 0;
        right: 0;
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: block;
          content: '';
          width: 100%;
          height: 100%;
          background: ${({ theme }) => theme.color.white};
          border-radius: 50%;
        }
        & svg {
          position: relative;
          & *[fill],
          *[stroke] {
            color: ${({ theme }) => theme.color.gray50};
          }
        }
      }
    }
  }
  & .name {
    & .title {
      padding: 1.9rem 0;
      font: ${({ theme }) => theme.fontType.t15B};
      color: ${({ theme }) => theme.color.black};
    }
  }

  ${Button} {
    margin-top: 1.6rem;
  }

  ${TextField} {
    &.is-none {
      & input {
        padding-right: 1.6rem;
      }
    }
  }
`;
