import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';
import { Hide } from '@atlaskit/primitives/responsive';
import { Box, xcss } from '@atlaskit/primitives';

type SideNavProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const state = useLayoutState();
  const outerStyles = React.useMemo(
    () =>
      xcss({
        position: 'sticky',
        minWidth: `${state.defaultSideNavWidth}px`,
        height: `calc(100vh - ${state.topNavHeight + 1}px)`,
        top: `${state.topNavHeight}px`,
      }),
    [state.topNavHeight, state.defaultSideNavWidth]
  );

  const navStyles = React.useMemo(
    () =>
      xcss({
        zIndex: 'navigation',

        overflowX: 'hidden',
        overflowY: 'auto',

        // Position
        height: `100%`,
        width: `${state.sideNavWidth}px`,

        // Animation
        transition: 'width 0.3s ease',
        whiteSpace: 'nowrap',
      }),
    [state.sideNavWidth]
  );

  return (
    <Hide below="md" as="nav" xcss={outerStyles}>
      <Box xcss={navStyles}>{props.children}</Box>
    </Hide>
  );
};

export default SideNav;
