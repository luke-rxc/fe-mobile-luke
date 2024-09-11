import { forwardRef } from 'react';
import styled from 'styled-components';
import type { BlankDisplayModel, PresetComponentModel, PresetRefModel } from '../../../models';

const BlankComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, contents } = preset;
  const displayValues = JSON.parse(contents) as BlankDisplayModel;

  return (
    <div ref={ref} {...props}>
      {visible && <BlankContent className="content-wrapper" {...displayValues} />}
    </div>
  );
});
const Blank = styled(BlankComponent)``;
export default Blank;

const BlankContent = styled('div').attrs((props: BlankDisplayModel) => props)`
  height: ${({ height }) => `${Math.floor(height) / 10}rem`};
  background: ${({ colors = [] }) => {
    if (colors.length === 1) {
      return `${colors[0]}`;
    }
    if (colors.length > 1) {
      return `linear-gradient(${colors.join(',')})`;
    }
    return '';
  }};
`;
