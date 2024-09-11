// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeatureFlagWebType = Readonly<Record<string, any>>;

/**
 * config 도메인의 feature-flag-web.json object
 */
const featureFlagWeb: FeatureFlagWebType = {};

export const setFeatureFlagWeb = (json: FeatureFlagWebType) => {
  Object.assign(featureFlagWeb, json);
};

export const getFeatureFlagWeb = () => featureFlagWeb;
