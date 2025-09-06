import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import DiagramSymbolSortIcon from '@atlaskit/icon-lab/core/diagram-symbol-sort';

import { SortOrderType } from './types';

const baseMenuButtonWrapperStyles = xcss({
  height: '100%',
  paddingLeft: 'space.050',
  paddingRight: 'space.050',
});

function SortIndicator({ order }: { order: SortOrderType | null }) {
  return (
    <Box xcss={baseMenuButtonWrapperStyles}>
      {order === null && <DiagramSymbolSortIcon size="small" color={token('color.icon.subtlest')} />}
      {order === 'ASC' && <ChevronUpIcon size="medium" color={token('color.icon.brand')} />}
      {order === 'DESC' && <ChevronDownIcon size="medium" color={token('color.icon.brand')} />}
    </Box>
  );
}

export default SortIndicator;
