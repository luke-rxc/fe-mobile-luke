/**
 * Navigation State
 */
export type NavigationState =
  | Record<string, never>
  | {
      open?: boolean;
      enabled?: boolean;
      element?: HTMLElement | null;
      cartCount?: number;
      notiCount?: number;
      status?: 'opened' | 'opening' | 'closed' | 'closing';
    };

/**
 * Navigation Dispatch
 */
export type NavigationDispatch = React.Dispatch<React.SetStateAction<NavigationState>>;
