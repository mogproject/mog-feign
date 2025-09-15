import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';
import { sideNavHidden, sideNavStyles } from './styles';

type SideNavProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const state = useLayoutState();
  const topStyles = React.useMemo(
    () =>
      css({
        top: state.topNavHeight,
        height: `calc(100vh - ${state.topNavHeight}px)`,
      }),
    [state.topNavHeight]
  );
  const widthStyles = React.useMemo(() => css({ width: state.sideNavWidth }), [state.sideNavWidth]);

  return (
    <nav
      css={[
        //
        sideNavStyles,
        topStyles,
        widthStyles,
        state.sideNavExpanded || sideNavHidden,
      ]}
    >
      {props.children}
    </nav>
  );
};

export default SideNav;
