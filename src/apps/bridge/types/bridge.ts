import type { LandingTypes } from '../constants';

export type BridgeRouteParams = {
  landingType: Lowercase<LandingTypes>;
  code: string;
};

export type BridgeParams = {
  landingType: LandingTypes;
  code: string;
};
