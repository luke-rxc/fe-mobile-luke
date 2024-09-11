import { lazy } from 'react';

export default [
  {
    // category > Section
    component: lazy(() => import('./pages/CategoryPage')),
    path: '/section/category/:sectionId',
  },
  {
    // Discover > Section
    component: lazy(() => import('./pages/DiscoverPage')),
    path: '/section/discover/:sectionId/:sectionType?',
  },
  {
    // Concept Showroom > Section
    component: lazy(() => import('./pages/ShowroomPage')),
    path: '/section/showroom/:sectionId(\\d+)/:sectionType(live|goods|content|showroom)?',
    exact: true,
  },
  {
    // Concept Showroom > Region Section
    component: lazy(() => import('./pages/ShowroomRegionPage')),
    path: '/section/showroom/:sectionId(\\d+)/region',
    exact: true,
  },
  {
    // Concept Showroom > Section > Bridge
    component: lazy(() => import('./pages/ShowroomRegionBridgePage')),
    path: '/section/showroom/region/bridge/:showroomId',
    exact: true,
  },
  {
    // Concept Showroom > Section > Schedule
    component: lazy(() => import('./pages/ShowroomRegionSchedulePage')),
    path: '/section/showroom/region/schedule',
    exact: true,
  },
  {
    // Concept Showroom > Section > Filter
    component: lazy(() => import('./pages/ShowroomRegionFilterPage')),
    path: '/section/showroom/region/filter/:showroomId',
    exact: true,
  },
  {
    // Goods > Recommendation Section
    component: lazy(() => import('./pages/GoodsRecommendationPage')),
    path: '/section/goods/recommendation/:sectionId/:sectionType?',
    exact: true,
  },
];
