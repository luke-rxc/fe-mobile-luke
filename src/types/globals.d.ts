declare type ValueOf<T> = T[keyof T];

// Web to App Action
interface Web2AppMessageAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage: (payload?: string | number | Record<string, any>) => void;
}

// IOS Webkit
interface IosWebkit {
  messageHandlers: {
    action: Web2AppMessageAction;
    eventLog: Web2AppMessageAction;
  };
}

// PostMessage
interface MessageEvent {
  readonly data: {
    event: string;
    payload: Record<string, string | number>;
  };
}

// PostMessage : Call App To Web Bridge Message Event
interface AppBridgeMessageEvent<T> extends MessageEvent {
  readonly data: {
    event: string;
    payload?: T;
  };
}

/**
 * Window Global Interface
 */
interface Window {
  webkit?: IosWebkit;
  action?: Web2AppMessageAction;
  eventLog?: Web2AppMessageAction;
}

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
