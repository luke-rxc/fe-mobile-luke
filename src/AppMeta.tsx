import { MetaAttribute, SEO } from '@pui/seo';
import { useTheme } from '@hooks/useTheme';
import { userAgent } from '@utils/ua';

const AppMeta = () => {
  const { isApp } = userAgent();
  const { theme } = useTheme();

  const meta: MetaAttribute[] = [];

  !isApp &&
    meta.push(
      { name: 'theme-color', content: theme.color.whiteLight },
      { name: 'apple-itunes-app', content: 'app-id=1605514692' },
    );

  return <SEO init meta={meta} />;
};

export default AppMeta;
