import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/ProtoPage')),
    path: '/proto',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoGyroSensorInfoPage')),
    path: '/proto/gyro',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoGyroSensorSequencePage')),
    path: '/proto/gyro/sequence',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoBannerPage')),
    path: '/proto/banner',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoDebugPage')),
    path: '/proto/debug',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoWebviewPage')),
    path: '/proto/webview',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoWebviewDeeplinkPage')),
    path: '/proto/deeplink',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoLinkPage')),
    path: '/proto/link',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoWebInterfacePage')),
    path: '/proto/webinterface',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoWebInterfaceOpenPage')),
    path: '/proto/webinterface/open',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoWebviewFocusPage')),
    path: '/proto/focus',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoModalPage')),
    path: '/proto/modal',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoDrawerPage')),
    path: '/proto/drawer',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/SlotPage')),
    path: '/proto/slot',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoStickyPage')),
    path: '/proto/sticky',
  },
  {
    component: lazy(() => import('./pages/ProtoWowDrawPage')),
    path: '/proto/wow-draw',
  },
  {
    component: lazy(() => import('./pages/ProtoAuctionInfoEditPage')),
    path: '/proto/auction/info/edit',
  },
  {
    component: lazy(() => import('./pages/ProtoARPage')),
    path: '/proto/ar',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoHapticPage')),
    path: '/proto/haptic',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoLiveReceiptPage')),
    path: '/proto/receipt',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ProtoSharePage')),
    path: '/proto/share',
    exact: true,
  },
];
