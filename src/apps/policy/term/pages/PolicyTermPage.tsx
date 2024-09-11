import { NotFound } from '@features/exception/components';
import { useParams } from 'react-router-dom';
import { TermV1Container, TermV1_1Container } from '../containers';

type Version = string;

const TermContents: Record<Version, () => () => JSX.Element> = {
  v1_1: () => TermV1_1Container,
  v1: () => TermV1Container,
} as const;

const PolicyTermPage = () => {
  const { version } = useParams<{ version?: Version }>();

  const versionKey = version ?? 'v1_1';
  const Content = TermContents[versionKey]?.();

  return Content ? <Content /> : <NotFound />;
};

export default PolicyTermPage;
