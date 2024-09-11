import { env } from '@env';
import { useScript } from '@hooks/useScript';
import { createDebug } from '@utils/debug';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useQueryString } from '@hooks/useQueryString';
import { KAKAO_CALLBACK_URL } from '../constants';
import { SocialParams } from '../types';

type QueryParams = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};

const debug = createDebug();

interface KakaoResponse {
  id: number;
  kakao_account: {
    email: string;
    age_range: string;
    birthday: string;
    birthyear: string;
    gender: string;
    name: string;
    phone_number: string;
  };
  properties: {
    profile_image: string;
  };
}

interface KakaoServiceTermResponse {
  id: number;
  allowed_service_terms: {
    tag: string;
    agreed_at: string;
  }[];
}

interface KakaoOAuthTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  id_token?: string;
  scope?: string;
}

export const useKakaoLogin = () => {
  const { status } = useScript('https://developers.kakao.com/sdk/js/kakao.js');
  const queryParams = useQueryString<QueryParams>();
  const [socialParams, setSocialParams] = useState<SocialParams | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kakaoSdkRef = useRef<any>(null);

  /**
   * 카카오톡 사용자 정보 조회
   */
  function getKakaoUser(): Promise<KakaoResponse> {
    return new Promise((resolve, reject) => {
      if (kakaoSdkRef.current) {
        kakaoSdkRef.current.API.request({
          url: '/v2/user/me',
          success: (res: KakaoResponse) => {
            resolve(res);
          },
          fail: (res: unknown) => {
            reject(res);
          },
        });
      }
    });
  }

  function toKakaoSocialParams(
    res: KakaoResponse,
    agreement: KakaoServiceTermResponse['allowed_service_terms'],
  ): SocialParams {
    const {
      id,
      kakao_account: { email },
      properties: { profile_image: profileImageUrl },
    } = res;
    const isAdAgree = !!agreement.find((agree) => agree.tag === 'promotion_221111')?.agreed_at;
    const ssoAccountInfo = getSSOAccountInfo(res.kakao_account);

    return {
      ssoId: id.toString(),
      email,
      ssoType: 'KAKAO',
      profileImageUrl,
      isAdAgree,
      ...(ssoAccountInfo && { ssoAccountInfo }),
    };
  }

  function getSSOAccountInfo(account: KakaoResponse['kakao_account']) {
    const { age_range: ageRange, birthday, birthyear, gender, name, phone_number: phone } = account;

    if (!ageRange && !birthday && !birthyear && !gender && !name && !phone) {
      return null;
    }

    const ssoAccountInfo = {
      ageRange: ageRange || null,
      birthDay: birthday || null,
      birthYear: birthyear || null,
      gender: gender?.slice(0, 1).toUpperCase() ?? null,
      name: name || null,
      phone: phone || null,
    };

    return ssoAccountInfo;
  }

  /**
   * 카카오 로그인 (팝업 방식)
   */
  const login = useCallback(async () => {
    if (!kakaoSdkRef.current) {
      throw new Error('sdk 정보가 없습니다.');
    }

    return new Promise<SocialParams>((resolve, reject) => {
      kakaoSdkRef.current.Auth.login({
        success: async (res: KakaoOAuthTokenResponse) => {
          const { access_token: token } = res;
          kakaoSdkRef.current.Auth.setAccessToken(token);
          const user = await getKakaoUser();
          const agreements = await getAgreements();
          resolve(toKakaoSocialParams(user, agreements.allowed_service_terms));
        },
        fail: reject,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 카카오 로그인 (redirect 방식)
   */
  const authorize = (): void => {
    const state = encodeURIComponent(window.location.href);

    kakaoSdkRef.current.Auth.authorize({
      redirectUri: KAKAO_CALLBACK_URL,
      ...(state && { state }),
    });
  };

  /**
   * 카카오 로그인 redirect 이후 처리
   */
  const loginAfterAuthorize = async () => {
    const { access_token: token } = await getAccessToken();
    kakaoSdkRef.current.Auth.setAccessToken(token);
    const user = await getKakaoUser();
    const agreements = await getAgreements();
    setSocialParams(toKakaoSocialParams(user, agreements.allowed_service_terms));
  };

  /**
   * 카카오톡 access_token 조회
   */
  const getAccessToken = async (): Promise<KakaoOAuthTokenResponse> => {
    return axios
      .post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: env.authKey.kakaoRestApi,
          redirect_uri: KAKAO_CALLBACK_URL,
          code: queryParams.code ?? '',
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        const errResponse = {
          data: {
            code: err.error_code,
            message: err.error_description,
          },
        };
        return Promise.reject(errResponse);
      });
  };

  /**
   * 카카오 로그인 동의서 조회
   */
  const getAgreements = async (): Promise<KakaoServiceTermResponse> => {
    return new Promise((resolve, reject) => {
      kakaoSdkRef.current.API.request({
        url: '/v1/user/service/terms',
        success: resolve,
        fail: reject,
      });
    });
  };

  const logout = useCallback(async () => {
    await kakaoSdkRef.current.Auth.logout();
  }, []);

  const unlink = useCallback(async () => {
    return new Promise((resolve, reject) => {
      kakaoSdkRef.current.API.request({
        url: '/v1/user/unlink',
        success: resolve,
        fail: reject,
      });
    });
  }, []);

  useEffect(() => {
    if (status === 'ready') {
      kakaoSdkRef.current = window.Kakao;

      if (!kakaoSdkRef.current) {
        debug.error('카카오 SDK 로드 실패');
        return;
      }

      kakaoSdkRef.current.init(env.authKey.kakao);

      if (!kakaoSdkRef.current.isInitialized()) {
        throw new Error('카카오 초기화 오류');
      }
    }
  }, [status]);

  /**
   * 카카오 로그인 authorize 이후 로직 실행
   */
  useEffect(() => {
    if (queryParams.error) {
      alert({ title: queryParams.error ?? '', message: queryParams.error_description ?? '' });
      return;
    }

    if (status === 'ready' && queryParams.code) {
      loginAfterAuthorize();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, queryParams?.code]);

  return {
    login,
    authorize,
    logout,
    unlink,
    status,
    socialParams,
  };
};
