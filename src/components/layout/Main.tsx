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
        marginInline: 'auto',
        width: state.mainWidth,
        transition: 'width 0.3s ease',
        paddingBottom: '50px', // save space for footer
      }),
    [state.mainWidth]
  );
  return <div css={[styles]}>{props.children}</div>;
};

export default Main;
