import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';
import { Box, xcss } from '@atlaskit/primitives';

type SideNavProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const state = useLayoutState();

  const navStyles = React.useMemo(
    () =>
      xcss({
        position: 'relative',
        // zIndex: '0',

        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        overflowY: 'auto',

        // Position
        minHeight: '0',
        height: '100%',
        width: `${state.sideNavWidth}px`,

        // Animation
        transition: 'width 0.3s ease',
      }),
    [state.sideNavWidth, state.topNavHeight]
  );

  return (
    <Box as="nav" xcss={navStyles}>
      {props.children}
    </Box>
  );
};

export default SideNav;
