import React from 'react';
import { LayoutContextProvider } from './LayoutContext';
import { Inline, Stack, xcss } from '@atlaskit/primitives';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Main from './Main';
import Aside from './Aside';

type RootProps = {
  defaultTopNavHeight: number;
  defaultSideNavWidth: number;
  defaultSideNavExpanded: boolean;
  defaultAsideWidth: number;
  topNavContent: React.ReactNode;
  sideNavContent: React.ReactNode;
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
};

const Root: React.FC<RootProps> = (props: RootProps) => {
  return (
    <LayoutContextProvider
      defaultTopNavHeight={props.defaultTopNavHeight}
      defaultSideNavWidth={props.defaultSideNavWidth}
      defaultSideNavExpanded={props.defaultSideNavExpanded}
      defaultAsideWidth={props.defaultAsideWidth}
    >
      {/* <Stack space="space.0" xcss={xcss({ height: '100vh' })}> */}
        <TopNav>{props.topNavContent}</TopNav>
        <Inline space="space.0" alignBlock="start">
          <SideNav>{props.sideNavContent}</SideNav>
          <Main>{props.mainContent}</Main>
          <Aside>{props.asideContent}</Aside>
        </Inline>
      {/* </Stack> */}
    </LayoutContextProvider>
  );
};

export default Root;
