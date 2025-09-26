import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';

const topNavStyles = css({
  position: 'sticky',
  top: 0,
  zIndex: 100,
});

type TopNavProps = {
  children: React.ReactNode;
};

const TopNav: React.FC<TopNavProps> = (props) => {
  const state = useLayoutState();

  const heightStyles = React.useMemo(() => {
    return {
      height: state.topNavHeight,
    };
  }, [state.topNavHeight]);
  return <header css={[topNavStyles, heightStyles]}>{props.children}</header>;
};

export default TopNav;
