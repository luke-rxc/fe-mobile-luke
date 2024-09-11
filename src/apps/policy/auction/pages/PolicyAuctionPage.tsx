import { NotFound } from '@features/exception/components';
import { useParams } from 'react-router-dom';
import { AuctionContainer } from '../containers';

type Version = string;

const TermContents: Record<Version, () => () => JSX.Element> = {
  latest: () => AuctionContainer,
} as const;

const PolicyAuctionPage = () => {
  const { version } = useParams<{ version?: Version }>();

  const versionKey = version ?? 'latest';
  const Content = TermContents[versionKey]?.();

  return Content ? <Content /> : <NotFound />;
};

export default PolicyAuctionPage;
