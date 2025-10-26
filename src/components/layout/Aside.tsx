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
        right: state.showAside ? '10px' : '24px',
        width: state.showAside ? `${state.asideWidth}px` : '56px',

        paddingBlockEnd: 'space.100',
        flexShrink: '0',
        zIndex: '90' as any,

        // Animation
        transition: 'width 0.3s ease',
      }),
    [state.asideWidth, state.showAside]
  );

  return (
    <Box as="aside" id="aside-content" xcss={asideStyles}>
      {props.children}
    </Box>
  );
};

export default Aside;
