import { NotFound } from '@features/exception/components';
import { useParams } from 'react-router-dom';
import { FinanceTermContainer } from '../containers';

type Version = string;

const FinanceTermContents: Record<Version, () => () => JSX.Element> = {
  latest: () => FinanceTermContainer,
} as const;

const PolicyFinanceTermPage = () => {
  const { version } = useParams<{ version?: Version }>();

  const versionKey = version ?? 'latest';
  const Content = FinanceTermContents[versionKey]?.();

  return Content ? <Content /> : <NotFound />;
};

export default PolicyFinanceTermPage;
