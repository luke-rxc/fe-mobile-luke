import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/FeatureFlagConfigPage')),
    path: '/config/feature-flag',
    exact: true,
  }, // feature flag config 페이지
  {
    component: lazy(() => import('./pages/FeatureFlagProtoPage')),
    path: '/config/proto',
    exact: true,
  }, // feature flag config 페이지
  {
    component: lazy(() => import('./pages/ABTestInfoPage')),
    path: '/config/ab-test-info',
    exact: true,
  }, // A/B 테스트 기본 정보 페이지
];
