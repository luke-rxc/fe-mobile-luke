export interface LoginFormValues {
  email: string;
  code?: string;
}

export type LoginFormNames = keyof LoginFormValues;
