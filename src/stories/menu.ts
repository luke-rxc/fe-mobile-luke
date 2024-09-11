import last from 'lodash/last';

/**
 * 스토리북 메뉴 리스트
 */
export const StoriesMenu = {
  Foundation: {
    toString: () => 'Foundation',
  } as const,
  Graphic: {
    toString: () => 'Graphic',
  } as const,
  Features: {
    toString: () => 'Features',
  } as const,
  Apps: {
    toString: () => 'Apps',
  } as const,
  NonPDS: {
    toString: () => 'Non-PDS',
  } as const,
  PDS: {
    toString: () => 'PDS',
    Button: 'PDS/Button',
    Navigation: 'PDS/Navigation',
    DataEntry: 'PDS/DataEntry',
    DataDisplay: 'PDS/DataDisplay',
    DataDisplayCardType: 'PDS/DataDisplay(CardType)',
    Feedback: 'PDS/Feedback',
  } as const,
  /** @deprecated */
  PUI: {
    toString: () => 'PUI',
  } as const,
} as const;

/**
 * 스토리북 메뉴 관리. 선언 순서대로 노출
 */
export const Menu = {
  [`${StoriesMenu.Foundation}`]: {},
  [`${StoriesMenu.Graphic}`]: {},
  [`${StoriesMenu.PDS}`]: {
    [`${last(StoriesMenu.PDS.Button.split('/'))}`]: {},
    [`${last(StoriesMenu.PDS.Navigation.split('/'))}`]: {},
    [`${last(StoriesMenu.PDS.DataEntry.split('/'))}`]: {},
    [`${last(StoriesMenu.PDS.DataDisplay.split('/'))}`]: {},
    [`${last(StoriesMenu.PDS.DataDisplayCardType.split('/'))}`]: {},
    [`${last(StoriesMenu.PDS.Feedback.split('/'))}`]: {},
  },
  [`${StoriesMenu.NonPDS}`]: {},
  [`${StoriesMenu.Features}`]: {},
  [`${StoriesMenu.Apps}`]: {},
};
