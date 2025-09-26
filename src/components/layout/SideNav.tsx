import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';
import { Hide } from '@atlaskit/primitives/responsive';
import { xcss } from '@atlaskit/primitives';

type SideNavProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const state = useLayoutState();
  const navStyles = React.useMemo(
    () =>
      xcss({
        position: 'sticky',
        zIndex: '1',

        overflowX: 'hidden',
        overflowY: 'auto',

        // Position
        top: `${state.topNavHeight}px`,
        height: `calc(100vh - ${state.topNavHeight + 1}px)`,
        width: `${state.sideNavWidth}px`,

        // Animation
        transition: 'width 0.3s ease',
        whiteSpace: 'nowrap',
      }),
    [state.topNavHeight, state.sideNavWidth]
  );

  return (
    <Hide below="md" as="nav" xcss={navStyles}>
      {props.children}
    </Hide>
  );
};

export default SideNav;
