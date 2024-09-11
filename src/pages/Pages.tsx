import React, { Suspense, useEffect } from 'react';
import { Route, RouteProps, RouteComponentProps, Switch, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import env from '@env';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { NotFound } from '@features/exception/components';
import { LandmarkContainer } from '@features/landmark/containers/LandmarkContainer';
import { FloatingContainer } from '@features/floating';
import { ReactQueryDevtools } from 'react-query/devtools';

/** Route */
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { createDebug } from '@utils/debug';
import { useAuth } from '@hooks/useAuth';
import defaultRoutes from '../apps/route';
import devRoutes from '../apps/routeDevelopment';
import stageRoutes from '../apps/routeStage';

const debug = createDebug('common:pages');

/**
 * Webview 내에서의 Layout 형태
 * @description
 *  - 기본 Meta 속성은 'viewport-fit=cover' 로 설정되어 있음
 *  - routes.ts 에서 설정 (설정 안할시 기본값 'normal')
 *
 * @var {normal} : Native App Header와 컨텐츠 영역이 구분되어 있을때, Safe-Area top, bottom 전체 적용
 * @var {full} : Native App Header가 컨텐츠 위에 레이어 형태로 배치되어 있을때, Full Frame
 * @var {safe-area-bottom} : Safe-Area bottom 적용
 * @var {safe-area-top} : Safe-Area top 적용
 */
type AppCoverType = 'normal' | 'full' | 'safe-area-bottom' | 'safe-area-top';
type TouchActionType = 'auto' | 'manipulation';
interface ExtendRouterProps extends RouteProps {
  /** Webview 내에서의 Layout 형태 */
  appCoverType?: AppCoverType;
  /**
   * Background Color 변경
   * @description 주의! 단일값만 사용 가능
   */
  bodyBackGroundColor?: string;
  /**
   * Height 변경
   */
  bodyHeight?: string;
  /**
   * Touch Action 에 대한 제어
   * 기본 값은 pan-y, pan-x
   */
  bodyTouchAction?: TouchActionType;
  /**
   * overflow hidden 처리
   */
  bodyOverflowHidden?: boolean;
  /**
   * 스크롤 초기화 disable
   */
  disableInitialScroll?: boolean;
}

interface ScrollTopProps {
  disableInitialScroll?: boolean;
}

/**
 * 환경별 Routing
 * @description defaultRoutes를 기본으로 환경에 맞는 Routes를 추가
 * @returns 진행 Route
 */
const getRoutes = () => {
  if (env.isDevelopment) {
    return [...defaultRoutes, ...devRoutes];
  }
  if (env.isStage) {
    return [...defaultRoutes, ...stageRoutes];
  }
  return defaultRoutes;
};

/**
 * 스크롤 위치 초기화
 * @description pathname, search 변경시 스크롤 초기화
 * @TODO - pathname에 따른 예외케이스 처리
 * @returns null
 */
const ScrollToTop = ({ disableInitialScroll = false }: ScrollTopProps) => {
  const { isApp } = useDeviceDetect();
  const { pathname, search } = useLocation();
  const history = useHistory();

  useEffect(() => {
    debug.info('scroll position initialize', {
      pathname,
      search,
      disableInitialScroll,
      isApp,
    });
    /**
     * @TODO disableInitialScroll 옵션에 대한 검토
     * react-query 캐시등의 외부적 요인에 따라 disableInitialScroll의 기능에 영향이 있음.
     * 해당 속성의 제거 혹은 다른 방안에 대해서 검토 필요
     */
    if (!isApp && !disableInitialScroll) {
      debug.info('scroll position initialize execute');
      // 뒤로가기시 scroll top 처리를 위함
      history.action !== 'POP' && setImmediate(() => window.scrollTo(0, 0));

      // 뒤로가기시 scroll top 처리 미적용됨, 코드 실행은 되지만 뒤로가기시에는 브라우저가 스크롤위치를 수동으로 이전 위치로 재설정하으로 코드 실행후 수동 재설정 됨
      // window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableInitialScroll, isApp, pathname, search]);

  return null;
};

const Pages = () => {
  const routes = getRoutes();
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.REACT_QUERY_DEVTOOLS);

  const { isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={<div />}>
      {/* fallback Loading component 처리 */}
      <Switch>
        {routes.map((route) => (
          <RouteWithSubRoutes key={route.path as string} {...route} />
        ))}
        <Route
          component={() => (
            <LandmarkContainer>
              <NotFound mwebHeader />
            </LandmarkContainer>
          )}
        />
      </Switch>
      {activeFeatureFlag ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </Suspense>
  );
};

const RouteWithSubRoutes = (routeProps: ExtendRouterProps) => {
  const {
    appCoverType = 'normal',
    bodyBackGroundColor,
    bodyHeight,
    bodyTouchAction,
    bodyOverflowHidden,
    disableInitialScroll,
    ...route
  } = routeProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = route.component as React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  return (
    <Route
      path={route.path}
      render={(props) => {
        return (
          <>
            <Content
              appCoverType={appCoverType}
              bodyBackGroundColor={bodyBackGroundColor}
              bodyHeight={bodyHeight}
              bodyTouchAction={bodyTouchAction}
              bodyOverflowHidden={bodyOverflowHidden}
            >
              <FloatingContainer>
                <LandmarkContainer>
                  <Component {...props} />
                </LandmarkContainer>
              </FloatingContainer>
            </Content>
            <ScrollToTop disableInitialScroll={disableInitialScroll} />
          </>
        );
      }}
    />
  );
};

interface ContentProps {
  appCoverType: AppCoverType;
  bodyBackGroundColor?: string;
  bodyHeight?: string;
  bodyTouchAction?: TouchActionType;
  bodyOverflowHidden?: boolean;
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({
  appCoverType,
  bodyBackGroundColor,
  bodyHeight,
  bodyTouchAction,
  bodyOverflowHidden,
  children,
}) => {
  const { isApp } = useDeviceDetect();
  useEffect(() => {
    const $html = document.querySelector('html') as HTMLHtmlElement;
    const $body = document.body as HTMLBodyElement;

    if (isApp) {
      if (appCoverType !== 'full') {
        $body.classList.add(`app-cover-${appCoverType}`);
      }
    }

    if (bodyBackGroundColor) {
      $body.style.backgroundColor = bodyBackGroundColor;
    }

    if (bodyHeight) {
      $body.style.height = bodyHeight;
    }

    if (bodyTouchAction) {
      $html.classList.add(`touch-action-${bodyTouchAction}`);
      $body.classList.add(`touch-action-${bodyTouchAction}`);
    }

    if (bodyOverflowHidden) {
      $body.classList.add(`body_overflow`);
    }

    return () => {
      if (isApp && appCoverType !== 'full') {
        $body.classList.remove(`app-cover-${appCoverType}`);
      }
      if (bodyBackGroundColor) {
        $body.style.backgroundColor = '';
      }
      if (bodyHeight) {
        $body.style.height = '';
      }
      if (bodyTouchAction) {
        $html.classList.add(`touch-action-${appCoverType}`);
        $body.classList.remove(`touch-action-${bodyTouchAction}`);
      }
      if (bodyOverflowHidden) {
        $body.classList.remove(`body_overflow`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <MainWrapper>{children}</MainWrapper>;
};

const MainWrapper = styled.main`
  min-height: 100%;
  font: ${({ theme }) => theme.fontType.medium};
`;

export default Pages;
