import React from 'react';
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import { useLayoutState } from './LayoutContext';
import { Hide } from '@atlaskit/primitives/responsive';
import { XCSS, xcss } from '@atlaskit/primitives';

const asideStyles: XCSS = xcss({
  // borderInlineStart: `1px solid ${token('color.border')}`,
  top: '0',
  position: 'sticky',
  overflowX: 'hidden',
  overflowY: 'auto',
  whiteSpace: 'nowrap',
});

type AsideProps = {
  children: React.ReactNode;
};

const Aside: React.FC<AsideProps> = (props) => {
  const state = useLayoutState();
  const topStyles: XCSS = React.useMemo(
    () =>
      xcss({
        top: `${state.topNavHeight}px`,
        height: `calc(100vh - ${state.topNavHeight + 1}px)`,
      }),
    [state.topNavHeight]
  );
  const widthStyles: XCSS = React.useMemo(() => xcss({ width: `${state.asideWidth}px` }), [state.asideWidth]);

  return (
    <Hide below="lg" as="aside" xcss={[asideStyles, topStyles, widthStyles] as XCSS[]}>
      {props.children}
    </Hide>
  );
};

export default Aside;
