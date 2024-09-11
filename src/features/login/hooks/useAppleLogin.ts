import { env } from '@env';
import { useScript } from '@hooks/useScript';
import { b64Decode } from '@utils/base64';
import { useCallback, useEffect } from 'react';
import { SocialParams } from '../types';

interface AppleResponse {
  authorization: {
    state: string;
    code: string;
    id_token: string;
  };
  user: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AppleUserInformation {
  aud: string;
  auth_time: number;
  c_hash: string;
  email: string;
  email_verified: string;
  exp: number;
  iat: number;
  is_private_email: string;
  iss: string;
  nonce_supported: boolean;
  sub: string;
}

export const useAppleLogin = (redirectUrl: string) => {
  const { status } = useScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js');

  function toAppleSocialParams(res: AppleResponse): SocialParams {
    const { authorization } = res;
    const info = decodeIdToken(authorization?.id_token);

    if (!info) {
      return {
        ssoId: '',
        email: '',
        ssoType: 'APPLE',
        profileImageUrl: '',
      };
    }

    const { sub, email } = info;
    const ssoAccountInfo = res.user ? getSSOAccountInfo(res.user) : null;

    return {
      ssoId: sub,
      email,
      ssoType: 'APPLE',
      profileImageUrl: '',
      ...(ssoAccountInfo && { ssoAccountInfo }),
    };
  }

  function decodeIdToken(token: string): AppleUserInformation | null {
    const regex = /\.(.*?)\./;
    const encoded = token.match(regex) && token.match(regex)?.[1];

    if (encoded) {
      const base64 = b64Decode(encoded);
      return JSON.parse(base64);
    }

    return null;
  }

  function getSSOAccountInfo(account: AppleResponse['user']) {
    const { name } = account;

    if (!name) {
      return null;
    }

    const fullName = `${name.lastName ?? ''}${name.firstName}`;

    const ssoAccountInfo = {
      ageRange: null,
      birthDay: null,
      birthYear: null,
      gender: null,
      name: fullName,
      phone: null,
    };

    return ssoAccountInfo;
  }

  const login = useCallback(async () => {
    const res = await window.AppleID.auth.signIn();
    return toAppleSocialParams(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => Promise.resolve(), []);
  const unlink = useCallback(async () => Promise.resolve(), []);

  useEffect(() => {
    if (status === 'ready') {
      if (!redirectUrl) {
        return;
      }

      window.AppleID.auth.init({
        clientId: env.authKey.apple,
        scope: 'name email',
        redirectURI: `${window.location.origin}${redirectUrl}`,
        usePopup: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    login,
    logout,
    unlink,
    status,
  };
};
