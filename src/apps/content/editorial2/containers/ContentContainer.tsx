import { SEO } from '@pui/seo';
import { ContentHeader } from '../components';
import type { ContentStoryModel } from '../models';
import { useContentManagerService } from '../services';
import { FloatingContainer } from './FloatingContainer';
import { PresetListContainer } from './PresetListContainer';

type ContentContainerProps = {
  content: ContentStoryModel;
};
export const ContentContainer = ({ content }: ContentContainerProps) => {
  const { render, handleClickReplyMenu } = useContentManagerService({ content });

  return (
    <>
      <SEO {...content.seo} helmetProps={{ title: content.seo.title }} />
      {render && (
        <>
          <ContentHeader content={content} onClickReply={handleClickReplyMenu} />
          <PresetListContainer content={content} />
          <FloatingContainer content={content} />
        </>
      )}
    </>
  );
};
