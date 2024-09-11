import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    /** 컨텐츠 리스트 페이지 */
    component: lazy(() => import('./list/pages/ContentListPage')),
    path: '/goods/content/:showroomId',
    exact: true,
    appCoverType: 'full',
  },
  /** 콘텐츠 페이지 */
  {
    component: lazy(() => import('./pages/ContentsPage')),
    path: '/:contentType(story|teaser|exclusive|collaboration|event)/:code',
    exact: true,
    appCoverType: 'full',
  },
  /** 투표 인증서 보기 */
  {
    component: withAuth(lazy(() => import('./voteCertification/pages/VoteCertificationPage'))),
    path: '/:contentType(story|teaser|exclusive|collaboration|event)/:code/vote/:voteId',
    exact: true,
  },
  /** 응모하기 */
  {
    component: withAuth(lazy(() => import('./pages/ContentDrawPage'))),
    path: '/draw/goods/:eventId',
    exact: true,
  },
];
