import React from 'react';
import { Global, css } from '@emotion/react';
import { LayoutContextProvider, useLayoutState } from './LayoutContext';
import { Inline } from '@atlaskit/primitives';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Main from './Main';
import Aside from './Aside';
import { token } from '@atlaskit/tokens';

type RootInnerProps = {
  topNavContent: React.ReactNode;
  sideNavContent: React.ReactNode;
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
};

const RootInner: React.FC<RootInnerProps> = (props: RootInnerProps) => {
  const state = useLayoutState();
  const globalScrollStyles = React.useMemo(
    () =>
      css({
        html: {
          // Adjust scroll offset.
          scrollPaddingTop: `calc(${state.topNavHeight}px + ${token('space.100')})`,

          // Scroll behavior.
          scrollBehavior: 'smooth',
        },
      }),
    [state.topNavHeight]
  );

  return (
    <>
      <Global styles={globalScrollStyles} />
      <TopNav>{props.topNavContent}</TopNav>
      <Inline space="space.0" alignBlock="start">
        <SideNav>{props.sideNavContent}</SideNav>
        <Main>{props.mainContent}</Main>
        <Aside>{props.asideContent}</Aside>
      </Inline>
    </>
  );
};

type RootProps = {
  defaultTopNavHeight: number;
  defaultSideNavWidth: number;
  defaultSideNavExpanded: boolean;
  defaultAsideWidth: number;
} & RootInnerProps;

const Root: React.FC<RootProps> = ({
  defaultTopNavHeight,
  defaultSideNavWidth,
  defaultSideNavExpanded,
  defaultAsideWidth,
  ...rest
}: RootProps) => {
  return (
    <LayoutContextProvider
      defaultTopNavHeight={defaultTopNavHeight}
      defaultSideNavWidth={defaultSideNavWidth}
      defaultSideNavExpanded={defaultSideNavExpanded}
      defaultAsideWidth={defaultAsideWidth}
    >
      <RootInner {...rest} />
    </LayoutContextProvider>
  );
};

export default Root;
