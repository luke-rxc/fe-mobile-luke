export const LandingTypes = {
  THRILL: 'THRILL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LandingTypes = ValueOf<typeof LandingTypes>;

export const REDIRECT_TO_HOME_TIME = 3000;
