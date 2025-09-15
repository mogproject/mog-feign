import React from 'react';

import { useLayoutState } from './LayoutContext';
import { sideNavHidden, sideNavStyles } from './styles';

type SideNavProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const state = useLayoutState();
  const topStyles = React.useMemo(() => {
    if (!state.topNavRef) return {};
    const top = state.topNavRef.current?.offsetHeight;
    return {
      top: top,
      height: `calc(100vh - ${top}px)`,
    };
  }, [state?.topNavRef?.current?.offsetHeight]);
  const widthStyles = React.useMemo(() => ({ width: state.sideNavWidth }), [state.sideNavWidth]);

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
