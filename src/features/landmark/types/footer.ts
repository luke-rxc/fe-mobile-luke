/**
 * Footer State
 */
export type FooterState =
  | Record<string, never>
  | {
      enabled?: boolean;
      expanded?: boolean;
      hideLinks?: boolean;
      element?: HTMLElement | null;
    };

/**
 * Footer Dispatch
 */
export type FooterDispatch = React.Dispatch<React.SetStateAction<FooterState>>;
