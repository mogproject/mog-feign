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
        // position: 'fixed',
        overflowX: 'hidden',
        overflowY: 'auto',
        whiteSpace: 'nowrap',

        top: `${state.topNavHeight}px`,
        right: '0',
        height: `calc(100vh - ${state.topNavHeight + 1}px)`,
        width: `${state.asideWidth}px`,
        flexShrink: '0',
        zIndex: 'card',
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
