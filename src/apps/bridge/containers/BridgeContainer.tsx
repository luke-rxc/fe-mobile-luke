import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { SEO } from '@pui/seo';
import { userAgent } from '@utils/ua';
import type { LandingTypes } from '../constants';
import { useBridgeService } from '../services';
import type { BridgeRouteParams } from '../types';

export const BridgeContainer = () => {
  const { landingType, code } = useParams<BridgeRouteParams>();
  const { isHeadlessChrome } = userAgent();

  const { data, error, isError, isLoading, handleOpenLink, handleRedirect } = useBridgeService({
    // convert string to landing type
    landingType: landingType.toUpperCase() as LandingTypes,
    code,
  });

  useHeaderDispatch({
    type: 'mweb',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  // 오류 제외 항상 로딩 노출
  useLoadingSpinner(!isError && true);

  useEffect(() => {
    if (!data?.code) return;

    // HeadlessChrome 접근인 경우 중단
    if (isHeadlessChrome) return;

    handleOpenLink(data.code);
    handleRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <PageError error={error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <SEO {...data.seo} />
      <Container>
        <span className="title">스토어로 이동중입니다</span>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .title {
    display: block;
    margin-top: 3.2rem;
    font: ${({ theme }) => theme.fontType.titleB};
  }
`;
