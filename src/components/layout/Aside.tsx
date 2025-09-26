import React from 'react';
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import { useLayoutState } from './LayoutContext';

export const asideStyles = css({
  // borderInlineStart: `1px solid ${token('color.border')}`,
  top: 0,
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
  const topStyles = React.useMemo(
    () =>
      css({
        top: state.topNavHeight,
        height: `calc(100vh - ${state.topNavHeight + 1}px)`,
      }),
    [state.topNavHeight]
  );
  const widthStyles = React.useMemo(() => css({ width: state.asideWidth }), [state.asideWidth]);
  return <aside css={[asideStyles, topStyles, widthStyles]}>{props.children}</aside>;
};

export default Aside;
