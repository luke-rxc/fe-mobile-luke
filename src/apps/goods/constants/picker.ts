export const DatePickerUIType = {
  CALENDAR_SINGLE: 'CALENDAR_SINGLE',
  CALENDAR_MULTI: 'CALENDAR_MULTI',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DatePickerUIType = ValueOf<typeof DatePickerUIType>;
