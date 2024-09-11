import { getUser } from '@apis/user';
import { ACCESS_TOKEN } from '@constants/auth';
import { userQueryKey } from '@constants/user';
import { useQuery } from '@hooks/useQuery';
import { toUserModel } from '@models/UserModel';
import { nanoid } from '@utils/nanoid';
import { getLocalStorage, setLocalStorage } from '@utils/storage';
import { env } from '@env';
import { useMemo } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import { SendBirdUserInfo } from '../types';

export const useUser = () => {
  const { signIn } = useWebInterface();
  const token = getLocalStorage(ACCESS_TOKEN) ?? '';

  const { data: userInfo } = useQuery(userQueryKey, getUser, {
    select: (data) => {
      return toUserModel(data);
    },
    enabled: token !== '',
  });

  /**
   * 사용자 guest id 조회
   *
   * 라이브 경우 로그인없이 접근하기 위해
   * 임의의 user id를 생성후 로컬 스토리지에 저장하여 사용하도록 함
   */
  const getGuestUserId = () => {
    const userId = getLocalStorage('tempUserId');

    if (userId == null) {
      const createId = `fuser_${nanoid()}`;
      setLocalStorage('tempUserId', createId);
      return createId;
    }

    return userId;
  };

  const sendbirdUser = useMemo(() => {
    if (userInfo === undefined) {
      const userId = getGuestUserId();
      return {
        login: false,
        userId,
        nickname: userId,
        profileImagePath: '',
      } as SendBirdUserInfo;
    }

    return {
      login: true,
      userId: userInfo.userId.toString(),
      nickname: userInfo.nickname,
      profileImagePath: `${env.endPoint.cdnUrl}/${userInfo.profileImage.path}`,
    };
  }, [userInfo]);

  /**
   * 로그인 처리
   */
  const handleLogin = async () => {
    return signIn();
  };

  return { sendbirdUser, userInfo, handleLogin };
};
