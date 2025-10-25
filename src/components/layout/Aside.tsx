import React from 'react';
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import { useLayoutState } from './LayoutContext';
import { Box, xcss } from '@atlaskit/primitives';

type AsideProps = {
  children: React.ReactNode;
};

const Aside: React.FC<AsideProps> = (props) => {
  const state = useLayoutState();
  const asideStyles = React.useMemo(
    () =>
      xcss({
        position: 'sticky',
        overflowX: 'hidden',
        overflowY: 'auto',
        whiteSpace: 'nowrap',

        top: '0',
        right: '0',
        width: `${state.asideWidth}px`,
        paddingBlockEnd: 'space.100',
        flexShrink: '0',
        zIndex: '90' as any,
      }),
    [state.topNavHeight, state.asideWidth]
  );

  return (
    <Box as="aside" xcss={asideStyles}>
      {props.children}
    </Box>
  );
};

export default Aside;
