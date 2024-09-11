import { createContext, useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import {
  CallWebTypes,
  CustomEventMappedTypes,
  SignInCompletedParams,
  ReissueCompletedParams,
  AlertMessageClosedParams,
  SearchValuesTypes,
  SubscriptionStatusUpdatedParams,
  ShowroomFollowStatusUpdatedExtendParams,
  ScheduleFollowStatusUpdatedParams,
  ShowroomBannerClosedParams,
  WebStatusParams,
  WishItemUpdatedParams,
  CartItemUpdatedParams,
  BottomSafeAreaUpdated,
  FloatingLivePlayerStatusParams,
  InitializeParams,
  ToolbarButtonTappedParams,
  NotificationStatusParams,
  CardScanCompletedParams,
} from '@constants/webInterface';
import { createDebug } from '@utils/debug';
import { parsePayload } from '@utils/web2App';
import { webStatus } from '@utils/webInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { AuthAdultReceiveProps } from '@features/authIntegrate/types';
import { AuthCloseWebAppType } from '@features/authIntegrate/constants';

const debug = createDebug('context:webInterface');

interface WebInterfaceContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receiveValues: Record<string, any>;
  searchValues: SearchValuesTypes;
  subscribeShowroom: SubscriptionStatusUpdatedParams | null;
  showroomFollowStatusValues: ShowroomFollowStatusUpdatedExtendParams | null;
  subscribeSchedule: ScheduleFollowStatusUpdatedParams | null;
  dispatch: (type: CallWebTypes, options: CustomEvent) => void;
  webStatusCompleted: WebStatusParams | null;
  cartItemUpdatedValues: CartItemUpdatedParams | null;
  wishItemUpdatedValues: WishItemUpdatedParams | null;
  bottomSafeAreaUpdatedValue: BottomSafeAreaUpdated | null;
  addedToCartValue: boolean;
  floatingLivePlayerStatusValue: FloatingLivePlayerStatusParams | null;
  /** 시스템 영역을 포함한 값 조회 */
  initializeValues: InitializeParams | null;
  toolbarButtonTappedValue: ToolbarButtonTappedParams | null;
  pageActivatedCount: number;
}

interface WebInterfaceProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export const WebInterfaceContext = createContext<WebInterfaceContextType>({
  initialValues: {},
  receiveValues: {},
  searchValues: {
    query: '',
  },
  subscribeShowroom: null,
  showroomFollowStatusValues: null,
  subscribeSchedule: null,
  dispatch: () => {},
  webStatusCompleted: null,
  cartItemUpdatedValues: null,
  wishItemUpdatedValues: null,
  bottomSafeAreaUpdatedValue: null,
  addedToCartValue: false,
  floatingLivePlayerStatusValue: null,
  initializeValues: null,
  toolbarButtonTappedValue: null,
  pageActivatedCount: 0,
});

export const WebInterfaceProvider = ({ children }: WebInterfaceProviderProps) => {
  const { isApp } = useDeviceDetect();

  // Watching Data
  const [initialValues, setInitialValues] = useState({});
  const [receiveValues, setReceiveValues] = useState({});
  const [searchValues, setSearchValues] = useState<SearchValuesTypes>({ query: '' });
  const [subscribeShowroom, setSubscribeShowroom] = useState<SubscriptionStatusUpdatedParams | null>(null);
  const [showroomFollowStatusValues, setShowroomFollowStatusValues] =
    useState<ShowroomFollowStatusUpdatedExtendParams | null>(null);
  const [subscribeSchedule, setSubscribeSchedule] = useState<ScheduleFollowStatusUpdatedParams | null>(null);
  const [webStatusCompleted, setWebStatusCompleted] = useState<WebStatusParams | null>(null);
  const [cartItemUpdatedValues, setCartItemUpdatedValues] = useState<CartItemUpdatedParams | null>(null);
  const [wishItemUpdatedValues, setWishItemUpdatedValues] = useState<WishItemUpdatedParams | null>(null);
  const [bottomSafeAreaUpdatedValue, setBottomSafeAreaUpdatedValue] = useState<BottomSafeAreaUpdated | null>(null);
  const [addedToCartValue, setAddedToCartValue] = useState<boolean>(false);
  const [floatingLivePlayerStatusValue, setFloatingLivePlayerStatusValue] =
    useState<FloatingLivePlayerStatusParams | null>(null);
  const [initializeValues, setInitializeValues] = useState<InitializeParams | null>(null);
  const [toolbarButtonTappedValue, setToolbarButtonTappedValue] = useState<ToolbarButtonTappedParams | null>(null);
  const [pageActivatedCount, setPageActivatedCount] = useState<number>(0);

  /**
   * Custom Event Dispatcher
   *
   * @description CustomEvent를 생성하고, 해당 CustomEvent를 디스패치 합니다.
   */
  const dispatch = useCallback((type: CallWebTypes, options: CustomEvent): void => {
    const { [type]: customEventName } = CustomEventMappedTypes;

    window.dispatchEvent(new CustomEvent(customEventName, options));
  }, []);

  /**
   * Message Listener
   *
   * @description
   *   Native -> WebView로 전달하는 이벤트 리스닝 관리를 합니다.
   *   initialData 이벤트 타이밍 문제로 인해 message를 기본적으로 리스닝 상태로 합니다.
   */
  const handleEventMessage = useCallback(
    (event: MessageEvent<{ event: CallWebTypes; payload?: string }>) => {
      const { origin, data } = event;

      if (origin !== window.location.origin) {
        return;
      }

      const commands = values(CallWebTypes);

      if (!commands.includes(data?.event)) {
        return;
      }

      // dispatching event & data
      const { event: command, payload: detail = '' } = data;

      debug.log('command: %s, detail: %o', command, detail);

      switch (command) {
        case CallWebTypes.SignInCompleted:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<SignInCompletedParams>);
          break;
        case CallWebTypes.ReissueCompleted:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<ReissueCompletedParams>);
          break;
        case CallWebTypes.AlertMessageClosed:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<AlertMessageClosedParams>);
          break;
        case CallWebTypes.ReceiveData:
          setReceiveValues(parsePayload(detail));
          break;
        case CallWebTypes.InitialData:
          setInitialValues(parsePayload(detail));
          break;
        case CallWebTypes.Search:
          setSearchValues(parsePayload(detail) as SearchValuesTypes);
          break;
        case CallWebTypes.SubscriptionStatusUpdated:
          setSubscribeShowroom(parsePayload(detail) as SubscriptionStatusUpdatedParams);
          break;
        case CallWebTypes.ShowroomFollowStatusUpdated:
          setShowroomFollowStatusValues(parsePayload(detail) as ShowroomFollowStatusUpdatedExtendParams);
          break;
        case CallWebTypes.ScheduleFollowStatusUpdated:
          setSubscribeSchedule(parsePayload(detail) as ScheduleFollowStatusUpdatedParams);
          break;
        case CallWebTypes.ShowroomBannerClosed:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<ShowroomBannerClosedParams>);
          break;
        case CallWebTypes.FloatingLivePlayerStatus:
          setFloatingLivePlayerStatusValue(parsePayload(detail) as FloatingLivePlayerStatusParams);
          break;
        /** open interface MWeb Only */
        case CallWebTypes.WebStatusCompleted:
          setWebStatusCompleted(parsePayload(detail) as WebStatusParams);
          break;
        /** open interface MWeb Only */
        case CallWebTypes.CartItemUpdated:
          setCartItemUpdatedValues(parsePayload(detail) as CartItemUpdatedParams);
          break;
        /** open interface MWeb Only */
        case CallWebTypes.WishItemUpdated:
          setWishItemUpdatedValues(parsePayload(detail) as WishItemUpdatedParams);
          break;
        case CallWebTypes.BottomSafeAreaUpdated:
          setBottomSafeAreaUpdatedValue(parsePayload(detail) as BottomSafeAreaUpdated);
          break;
        case CallWebTypes.AddedToCart:
          setAddedToCartValue(true);
          break;
        case CallWebTypes.Initialize:
          setInitializeValues(parsePayload(detail) as InitializeParams);
          break;
        case CallWebTypes.ToolbarButtonTapped:
          setToolbarButtonTappedValue(parsePayload(detail) as ToolbarButtonTappedParams);
          break;
        case CallWebTypes.PageActivated:
          /**
           * 페이지 활성화 상태 카운트 증가
           *
           * @description 모든 페이지 대상인 경우 영향범위에 포함되어 notifications 기준으로 제한하고, 쉽게 파악하도록 별도로 코드 분리는 하지 않았습니다.
           * @todo WebInterface 개선 진행시 논의 후 코드 정리 필요
           */
          if (/^\/notifications/.test(window.location.pathname)) {
            setPageActivatedCount((prev) => prev + 1);
          }
          break;
        case CallWebTypes.NotificationStatus:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<NotificationStatusParams>);
          break;
        case CallWebTypes.CardScanCompleted:
          dispatch(command, { detail: parsePayload(detail) } as CustomEvent<CardScanCompletedParams>);
          break;
        default:
          break;
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!addedToCartValue) {
      return;
    }

    setAddedToCartValue(false);
  }, [addedToCartValue]);

  /**
   * 연령인증 실패 후 revceiveValues가 계속 남아서
   * 페이지 이동시에 alert가 계속 뜨는 이슈가 있어 초기화 로직 추가
   * @link https://rxc.atlassian.net/browse/PQ-1262
   */
  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }
    const { type } = receiveValues as AuthAdultReceiveProps;
    if (!isApp && type === AuthCloseWebAppType.AUTH_ADULT) {
      setReceiveValues({});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    window.addEventListener('message', handleEventMessage);

    // WebInterface 응답을 받을 준비가 된 상태를 전송합니다.
    webStatus({ listenerStatus: 'ready' });

    debug.log('The event listener is `ready`');

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', handleEventMessage);

      // WebInterface 응답을 받을 수 없는 상태를 전송합니다.
      webStatus({ listenerStatus: 'unready' });

      debug.log('The event listener is `unready`');
    };
  }, [isApp, handleEventMessage]);

  return (
    <WebInterfaceContext.Provider
      value={{
        initialValues,
        receiveValues,
        searchValues,
        subscribeShowroom,
        showroomFollowStatusValues,
        subscribeSchedule,
        webStatusCompleted,
        cartItemUpdatedValues,
        wishItemUpdatedValues,
        bottomSafeAreaUpdatedValue,
        addedToCartValue,
        floatingLivePlayerStatusValue,
        initializeValues,
        toolbarButtonTappedValue,
        pageActivatedCount,
        dispatch,
      }}
    >
      {children}
    </WebInterfaceContext.Provider>
  );
};
