export const OrderDetailSectionType = {
  ADDITIONAL_INFO: 'additionalInfo',
} as const;
/** 부가정보 타입 */
export const AdditionalInfoUISectionType = {
  // 항공권 탑승객 정보
  AIRLINE_TICKET: 'airlineticket',
} as const;

export const AdditionalInfoSectionType = {
  // 항공권 탑승객 정보
  airlineticket: 'AIRLINE_TICKET',
} as const;

/** 부가정보 입력 모드 */
export const InputFormMode = {
  REGISTER: 'register',
  EDIT: 'edit',
  COMPLETE: 'complete',
} as const;

/** 티켓 입력 타입 */
export const InputFormType = {
  AIRLINE_INTERNATIONAL: 'AIRLINE_INTERNATIONAL',
  AIRLINE_DOMESTIC: 'AIRLINE_DOMESTIC',
  DEFAULT: 'DEFAULT',
} as const;

/**
 * ReceiveValues Event Type
 */
export const AdditionalInfoEventType = {
  ON_OPEN: 'onOpenAdditionalInfo',
  ON_SUCCESS: 'onSuccessAdditionalInfo',
  ON_ERROR: 'onErrorAdditionalInfo',
} as const;

/** 부가정보 섹션 타이틀 */
export const AdditionalInfoSectionTitle = {
  DEFAULT: '부가 정보',
  AIRLINE_TICKET: '탑승자',
} as const;

/** 부가정보 텍스트 관리 */
export const AdditionalInfoText = {
  SECTION: {
    CONFIRM: '확정',
  },
  CONFIRM: {
    TITLE: '탑승자를 확정합니다',
    MESSAGE: '확정 이후에는 수정할 수 없습니다',
    TOAST_MESSAGE: '탑승자를 확정했습니다',
  },
  ALERT: {
    DEFAULT_TITLE: '정보를 입력할 수 없습니다',
    DEFAULT_ERROR_MESSAGE: '일시적인 오류가 발생했습니다',
  },
  MODAL: {
    TITLE: '탑승자',
    SUBMIT_TITLE: '완료',
    INFANT_ACCOMPANIED: '유아 동반',
    CLOSE_CONFIRM: {
      REGISTER_TITLE: '탑승자를 등록하지 않고 나갈까요?',
      EDIT_TITLE: '탑승자를 수정하지 않고 나갈까요?',
      MESSAGE: '내용은 저장되지 않습니다',
    },
    RESET: '초기화',
    NOTICE: '유의사항',
  },
  PAGE_DEFAULT_ERROR_MESSAGE: '부가정보를 찾을 수 없습니다',
  NATIONALITY: {
    PLACE_HOLDER: '국적 선택',
  },
} as const;

export const userDefaultGenderList = [
  {
    code: 'MALE',
    text: '남성',
  },
  {
    code: 'FEMALE',
    text: '여성',
  },
] as const;

export const MYPAGE_ORDER_DETAILS_ADDINFO_QUERY_KEY = 'MYPAGE_ORDER_DETAILS_ADDINFO_QUERY_KEY' as const;

export const ADDINFO_NATION_CODE_QUERY_KEY = 'ADDINFO_NATION_CODE_QUERY_KEY' as const;

export const ADDINFO_RECENT_FORM_QUERY_KEY = 'ADDINFO_RECENT_FORM_QUERY_KEY' as const;

export const NAME_REQUIRED_MESSAGE = '정확히 입력해주세요';
export const DOMESTIC_NAME_PATTERN_REGEXP = /^([가-힣A-Z\s]){1,20}$/;

export const INTERNATIONAL_NAME_PATTERN_REGEXP = /^([A-Z\s]){1,20}$/;

export const BIRTH_DATE_REQUIRED_MESSAGE = '생년월일 YYYY/MM/DD을 정확히 입력해주세요';
export const BIRITH_DATE_PATTERN_REGEXP = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;

export const GENDER_REQUIRED_MESSAGE = '성별을 선택해주세요';

export const PASSPORT_NUMBER_REQUIRED_MESSAGE = '여권번호를 정확히 입력해주세요';
export const PASSPORT_NUMBER_PATTERN_REGEXP = /^[A-Za-z](\d{8}|(?=(?:\d*[A-Za-z]){1}\d*$)[A-Za-z\d]{8})$/;

export const PASSPORT_EXPIRY_DATE_REQUIRED_MESSAGE = '여권만료일 YYYY/MM/DD을 정확히 입력해주세요';
export const PASSPORT_EXPIRY_DATE_PATTERN_REGEXP = BIRITH_DATE_PATTERN_REGEXP;

export const EMAIL_REQUIRED_MESSAGE = '이메일을 정확히 입력해주세요';
export const EMAIL_PATTERN_REGEXP = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;

export const AirlineTicketRule = {
  AIRLINE_DOMESTIC: {
    firstName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: DOMESTIC_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      validate: {
        empty: (v: string) => v.trim().length > 0 || NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '성',
    },
    lastName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: DOMESTIC_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      validate: {
        empty: (v: string) => v.trim().length > 0 || NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '이름',
    },
    dob: {
      required: {
        value: true,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      pattern: {
        value: BIRITH_DATE_PATTERN_REGEXP,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      placeHolder: '생년월일 (YYYYMMDD)',
    },
    sex: {
      required: {
        value: true,
        message: GENDER_REQUIRED_MESSAGE,
      },
      placeHolder: '성별 선택',
    },
  },
  AIRLINE_INTERNATIONAL: {
    firstName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: INTERNATIONAL_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '영문 성',
    },
    lastName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: INTERNATIONAL_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '영문 이름',
    },
    dob: {
      required: {
        value: true,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      pattern: {
        value: BIRITH_DATE_PATTERN_REGEXP,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      placeHolder: '생년월일 (YYYYMMDD)',
    },
    sex: {
      required: {
        value: true,
        message: GENDER_REQUIRED_MESSAGE,
      },
      placeHolder: '성별 선택',
    },
    email: {
      required: {
        value: true,
        message: EMAIL_REQUIRED_MESSAGE,
      },
      pattern: {
        value: EMAIL_PATTERN_REGEXP,
        message: EMAIL_REQUIRED_MESSAGE,
      },
      placeHolder: '이메일 주소',
    },
    passportNumber: {
      required: {
        value: true,
        message: PASSPORT_NUMBER_REQUIRED_MESSAGE,
      },
      pattern: {
        value: PASSPORT_NUMBER_PATTERN_REGEXP,
        message: PASSPORT_NUMBER_REQUIRED_MESSAGE,
      },
      placeHolder: '여권번호',
    },
    passportExpiryDate: {
      required: {
        value: true,
        message: PASSPORT_EXPIRY_DATE_REQUIRED_MESSAGE,
      },
      pattern: {
        value: PASSPORT_EXPIRY_DATE_PATTERN_REGEXP,
        message: PASSPORT_EXPIRY_DATE_REQUIRED_MESSAGE,
      },
      placeHolder: '여권만료일 (YYYYMMDD)',
    },
  },
  DEFAULT: {
    firstName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: DOMESTIC_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      validate: {
        empty: (v: string) => v.trim().length > 0 || NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '성',
    },
    lastName: {
      required: {
        value: true,
        message: NAME_REQUIRED_MESSAGE,
      },
      pattern: {
        value: DOMESTIC_NAME_PATTERN_REGEXP,
        message: NAME_REQUIRED_MESSAGE,
      },
      validate: {
        empty: (v: string) => v.trim().length > 0 || NAME_REQUIRED_MESSAGE,
      },
      placeHolder: '이름',
    },
    dob: {
      required: {
        value: true,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      pattern: {
        value: BIRITH_DATE_PATTERN_REGEXP,
        message: BIRTH_DATE_REQUIRED_MESSAGE,
      },
      placeHolder: '생년월일 (YYYYMMDD)',
    },
    sex: {
      required: {
        value: true,
        message: GENDER_REQUIRED_MESSAGE,
      },
      placeHolder: '성별 선택',
    },
  },
};

export const NoticeMessage = {
  AIRLINE_DOMESTIC: [
    '탑승자명이 신분증 성명과 동일한지 반드시 확인해주세요. 발권 완료 후 성명을 수정할 수 없습니다.',
    '잘못된 이름 표기로 항공권 미사용 시 환불이 불가합니다.',
    '탑승객 정보의 나이는 출발일 기준입니다.',
    '유아(24개월 미만) 탑승객은 성인 탑승객 1인당 1인만 등록 가능합니다.',
    '국내항공권의 경우 유아 탑승객은 구매수량에 포함되지 않으며, 별도의 티켓번호가 부여되지 않습니다.',
    '본 상품은 소아/유아 단독으로 이용할 수 없습니다.',
    '탑승객 정보가 정확하지 않거나 타인일 경우 탑승이 거절되며, 이로 인한 환불은 불가합니다.',
    '탑승객 확정 이후 정보 수정이 필요하신 경우 1:1문의로 문의 부탁드리며, 취소 수수료가 발생할 수 있습니다.',
  ],
  AIRLINE_INTERNATIONAL: [
    '탑승자명이 여권 영문 성명과 동일한지 반드시 확인해주세요. 발권 완료 후 성명 및 영문 철자를 수정할 수 없습니다.',
    '잘못된 이름 표기로 항공권 미사용 시 환불이 불가합니다.',
    '탑승객 정보의 나이는 출발일 기준입니다.',
    '유아(24개월 미만) 탑승객은 성인 탑승객 1인당 1인만 등록 가능합니다.',
    '반드시 성인/소아를 모두 포함한 실제 탑승자 전원의 성명을 기재해주세요.',
    '본 상품은 소아/유아 단독으로 이용할 수 없습니다.',
    '유아의 경우 좌석은 점유하지 않으나 노선별로 별도의 유아 요금이 발생되며, 판매 종료 후 개별 안내드릴 예정입니다.',
    '탑승객 정보가 정확하지 않거나 타인일 경우 탑승이 거절되며, 이로 인한 환불은 불가합니다.',
    '탑승객 확정 이후 정보 수정이 필요하신 경우 1:1문의로 문의 부탁드리며, 취소 수수료가 발생할 수 있습니다.',
    '이메일 주소가 정확한지 한번 더 확인해주세요. 기입하신 이메일 주소로 전자항공권(E-ticket)을 발송해 드립니다.',
  ],
  DEFAULT: [
    '탑승자명이 신분증 성명과 동일한지 반드시 확인해주세요. 발권 완료 후 성명을 수정할 수 없습니다.',
    '잘못된 이름 표기로 항공권 미사용 시 환불이 불가합니다.',
    '탑승객 정보의 나이는 출발일 기준입니다.',
    '유아(24개월 미만) 탑승객은 성인 탑승객 1인당 1인만 등록 가능합니다.',
    '국내항공권의 경우 유아 탑승객은 구매수량에 포함되지 않으며, 별도의 티켓번호가 부여되지 않습니다.',
    '본 상품은 소아/유아 단독으로 이용할 수 없습니다.',
    '탑승객 정보가 정확하지 않거나 타인일 경우 탑승이 거절되며, 이로 인한 환불은 불가합니다.',
    '탑승객 확정 이후 정보 수정이 필요하신 경우 1:1문의로 문의 부탁드리며, 취소 수수료가 발생할 수 있습니다.',
  ],
} as const;
