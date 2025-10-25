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
        overflowY: state.showAside ? 'auto' : 'hidden',
        whiteSpace: 'nowrap',

        top: '0',
        right: state.showAside ? '0' : '16px',
        width: `${state.showAside ? state.asideWidth : 48}px`,

        paddingBlockEnd: 'space.100',
        flexShrink: '0',
        zIndex: '90' as any,

        // Animation
        transition: 'width 0.3s ease',
      }),
    [state.topNavHeight, state.asideWidth, state.showAside, state.windowWidth]
  );

  return (
    <Box as="aside" xcss={asideStyles}>
      {props.children}
    </Box>
  );
};

export default Aside;
