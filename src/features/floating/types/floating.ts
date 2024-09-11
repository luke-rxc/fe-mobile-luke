/**
 * Floating Root요소의 상태 타입
 */
export type FloatingRootStateType = 'shown' | 'showing' | 'hidden' | 'hiding' | 'clearing';

/**
 * Floating Item 각각의 상태 타입
 */
export type FloatingItemStateType = 'shown' | 'showing' | 'hidden' | 'hiding' | 'removing';

/**
 * Floating을 식별하기 위한 고유 ID
 */
export type FloatingIdType = string;

/**
 * Floating 순서(descending order)
 */
export type FloatingOrderType = number;

/**
 * Floating에 표시할 실제 콘텐츠 렌더 데이터
 */
export type FloatingRenderType =
  | ((props: { id: FloatingIdType; state: FloatingItemStateType; order?: FloatingOrderType }) => React.ReactNode)
  | React.ReactNode;

/**
 *
 */
export type FloatingRootControllerMethodType = (instant?: boolean) => Promise<boolean>;

/**
 * Floating Root을 제어하기 위한 객체 타입
 */
export type FloatingRootControllerType = {
  /**
   * Floating Root의 상태
   */
  state: FloatingRootStateType;
  /**
   * Floating Root을 노출
   * @param instant 모션의 유무
   */
  show: FloatingRootControllerMethodType;
  /**
   * Floating Root을 숨김
   * @param instant 모션의 유무
   */
  hide: FloatingRootControllerMethodType;
  /**
   * Floating Root의 내부의 모든 FloatingItem 제거
   * @param instant 모션의 유무
   */
  clear: FloatingRootControllerMethodType;
};

/**
 * Floating Item show/hide/remove와 같은 메소드 타입
 */
export type FloatingItemControllerMethodType = (instant?: boolean) => Promise<boolean>;

/**
 * Floating Item을 제어하기 위한 객체 타입
 */
export type FloatingItemControllerType = {
  element: HTMLElement;
  /**
   * Floating item의 상태
   */
  state: FloatingItemStateType;
  /**
   * Floating item을 숨김
   * @param instant 모션의 유무
   */
  hide: FloatingItemControllerMethodType;
  /**
   * Floating item을 노출
   * @param instant 모션의 유무
   */
  show: FloatingItemControllerMethodType;
  /**
   * Floating item을 제거
   * @param instant 모션의 유무
   */
  remove: FloatingItemControllerMethodType;
};

/**
 * Floating Context에서 가지고 있는 FloatingItem 데이터
 */
export type FloatingItemType = {
  /**
   * Floating을 식별하기 위한 고유 ID
   */
  id: FloatingIdType;
  /**
   * Floating에 표시할 실제 콘텐츠 렌더 데이터
   */
  render: FloatingRenderType;
  /**
   * Floating 순서(descending order)
   */
  order?: FloatingOrderType;
  /**
   * Mount 시점의 show/hide 상태
   */
  defaultVisible?: boolean;
  /**
   * Floating 노출완료시 실행할 이벤트 콜백
   */
  onShown?: () => void;
  /**
   * Floating 숨김완료시 실행할 이벤트 콜백
   */
  onHidden?: () => void;
  /**
   * Floating Mount시
   */
  onAdded?: () => void;
  /**
   * Floating Unmount시
   */
  onRemoved?: () => void;
};

/**
 * Floating context value
 */
export type FloatingContextValueType = {
  /**
   * Floating 리스트
   */
  list: FloatingItemType[];
  /**
   * Floating Root요소의 제어를 위한 Ref
   */
  rootController: React.MutableRefObject<FloatingRootControllerType | null>;
  /**
   * Floating item을 제어할 수 있는 Controller Refs
   */
  itemControllers: React.MutableRefObject<Map<FloatingIdType, FloatingItemControllerType>>;
  /**
   * Floating 아이템을 추가/수정
   */
  set: (id: FloatingIdType, item: Omit<FloatingItemType, 'id'>) => FloatingItemType;
  /**
   * ID에 해당하는 아이템을 반환. 단, ID 해당하는 아이템이 없는 경우 undefined반환
   */
  get: (id: FloatingIdType) => FloatingItemType | undefined;
  /**
   * ID에 해당하는 아이템을 제거. 제거 성공유부에 따라 true/false를 반환
   */
  del: (id: FloatingIdType) => void;
  /**
   * ID에 해당하는 아이템의 유무 반환
   */
  has: (id: FloatingIdType) => boolean;
  /**
   * 모든 아이템을 제거
   */
  clear: () => void;
};
