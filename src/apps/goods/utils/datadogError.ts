import { datadogRum } from '@utils/log';

export interface DatadogErrorContext {
  /** 호출부 */
  caller: string;
  /** 수집할 데이터 */
  collect: Record<string, unknown>;
}

interface DatadogErrorProps {
  title: string;
  context: DatadogErrorContext;
}

export const datadogError = ({ title, context }: DatadogErrorProps) => {
  datadogRum.addError(new Error(title), { error: context });
};
