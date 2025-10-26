import React from 'react';
import { css } from '@emotion/react';
import { useLayoutState } from './LayoutContext';

type MainProps = {
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = (props) => {
  const state = useLayoutState();

  const styles = React.useMemo(
    () =>
      css({
        flexShrink: '0', // Needed for Chromium
        marginInline: `${state.mainMargin}px`,
        width: state.mainWidth,
        transition: 'width 0.3s ease, margin-inline 0.3s ease',
      }),
    [state.mainWidth, state.mainMargin]
  );
  return (
    <div id="main-content" css={[styles]}>
      {props.children}
    </div>
  );
};

export default Main;
