import { useTheme } from '@hooks/useTheme';
import { MetaAttribute, SEO, SEOProps } from '@pui/seo';

type Props = SEOProps;

export const LiveMeta = (props: Props) => {
  const { theme } = useTheme();

  const meta: MetaAttribute[] = [];

  meta.push({ name: 'theme-color', content: theme.color.blackLight });

  return <SEO {...props} meta={meta} />;
};
