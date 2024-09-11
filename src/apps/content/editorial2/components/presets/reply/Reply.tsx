import { forwardRef } from 'react';
import styled from 'styled-components';
import type { PresetComponentModel, PresetRefModel } from '../../../models';
import { useContentStore } from '../../../stores';
import { ReplyDrawer } from './ReplyDrawer';

const ReplyComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { show } = useContentStore.use.reply();

  return (
    <div ref={ref} {...props}>
      {show && <ReplyDrawer preset={preset} />}
    </div>
  );
});
const Reply = styled(ReplyComponent)``;
export default Reply;
