import React from 'react';
import styled from 'styled-components';
import { useLink } from '@hooks/useLink';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Exception, ExceptionProps } from '@pui/exception';
import { UniversalLinkTypes } from '@constants/link';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

export type NotFoundProps = Pick<ExceptionProps, 'onAction' | 'actionLabel' | 'className'> & {
  mwebHeader?: boolean;
};

/**
 * 404 페이지 템플릿
 *
 * https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10816%3A51490
 */
export const NotFound = styled(({ className, onAction, actionLabel, mwebHeader = false }: NotFoundProps) => {
  const { toLink, getLink } = useLink();
  const { isApp } = useDeviceDetect();
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const isActiveMwebFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV) && !isApp;

  useHeaderDispatch({
    type: 'mweb',
    enabled: isActiveMwebFlag && mwebHeader,
    quickMenus: ['cart', 'menu'],
  });

  const handleClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onAction) {
      onAction(event);
      return;
    }

    toLink(getLink(UniversalLinkTypes.HOME));
  };

  return (
    <>
      <Exception
        full
        title=""
        description="요청한 페이지를 찾을 수 없습니다"
        actionLabel={actionLabel ?? '홈으로 이동'}
        className={className}
        onAction={handleClickAction}
      />
    </>
  );
})``;
