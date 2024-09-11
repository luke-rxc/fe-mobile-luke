import FinanceTermRoute from './financeTerm/routes';
import PrivacyRoute from './privacy/routes';
import TermRoute from './term/routes';
import PrivacyProviderRoute from './privacyProvider/routes';
import BenefitRoute from './benefit/routes';
import AuctionRoute from './auction/routes';

export default [
  ...TermRoute,
  ...PrivacyRoute,
  ...FinanceTermRoute,
  ...PrivacyProviderRoute,
  ...BenefitRoute,
  ...AuctionRoute,
];
