import { useHistory } from 'react-router-dom';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useQuery } from '@hooks/useQuery';
import { getAppLink, getWebLink } from '@utils/link';
import { branch } from '@utils/log';
import { getThrillSimple } from '../apis';
import { LandingTypes, REDIRECT_TO_HOME_TIME } from '../constants';
import { toThrillMetaModel } from '../models';
import type { BridgeParams } from '../types';

export const useBridgeService = ({ landingType, code }: BridgeParams) => {
  const { isIOSSafari } = useDeviceDetect();
  const history = useHistory();

  const { data, error, isError, isFetching, isLoading, isSuccess } = useQuery(
    ['bridge', landingType, code],
    () => getThrillSimple({ code }),
    {
      select: toThrillMetaModel,
      cacheTime: 0,
      enabled: landingType === LandingTypes.THRILL,
    },
  );

  const handleOpenLink = async (thrillCode: string) => {
    const { appLink } = await branch.generateOneLinkBranchURL({
      deepLinkPath: getAppLink(AppLinkTypes.THRILL, { thrillCode }),
    });

    setTimeout(() => {
      if (isIOSSafari) {
        window.open(appLink, '_blank');
        return;
      }
      window.location.href = appLink;
    }, 0);
  };

  const handleRedirect = () => {
    setTimeout(() => {
      history.push(getWebLink(WebLinkTypes.HOME));
    }, REDIRECT_TO_HOME_TIME);
  };

  return {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    handleOpenLink,
    handleRedirect,
  };
};
