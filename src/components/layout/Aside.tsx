import React from 'react';
import { css } from '@emotion/react';

import { useLayoutState } from './LayoutContext';
import { asideStyles, sideBarStyles } from './styles';

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
  return <aside css={[sideBarStyles, asideStyles, topStyles, widthStyles]}>{props.children}</aside>;
};

export default Aside;
