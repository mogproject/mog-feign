import React from 'react';
import { LayoutContextProvider, useLayoutState } from './LayoutContext';
import { rootStyles } from './styles';
import { css } from '@emotion/react';

type RootProps = {
  children: React.ReactNode;
  defaultTopNavHeight: number;
  defaultSideNavWidth: number;
  defaultSideNavExpanded: boolean;
  defaultAsideWidth: number;
};

type RootInnerProps = {
  children: React.ReactNode;
};

const RootInner: React.FC<RootInnerProps> = ({ children }) => {
  const state = useLayoutState();
  const gridColumnStyles = React.useMemo(() => {
    return css({ gridTemplateColumns: `${state.sideNavWidth + 1}px 1fr ${state.asideWidth}px` });
  }, [state.sideNavWidth, state.asideWidth]);

  return <div css={[rootStyles, gridColumnStyles]}>{children}</div>;
};

const Root: React.FC<RootProps> = (props: RootProps) => {
  return (
    <LayoutContextProvider
      defaultTopNavHeight={props.defaultTopNavHeight}
      defaultSideNavWidth={props.defaultSideNavWidth}
      defaultSideNavExpanded={props.defaultSideNavExpanded}
      defaultAsideWidth={props.defaultAsideWidth}
    >
      <RootInner>{props.children}</RootInner>
    </LayoutContextProvider>
  );
};

export default Root;
