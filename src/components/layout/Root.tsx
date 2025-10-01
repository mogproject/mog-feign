import React from 'react';
import { Global, css } from '@emotion/react';
import { LayoutContextProvider, useLayoutState } from './LayoutContext';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Main from './Main';
import Aside from './Aside';
import { token } from '@atlaskit/tokens';

const rightPaneStyles = xcss({
  flex: '1',
  height: '100%',
  position: 'relative',
});

const footerStyles = css({
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  borderBlockStart: `1px solid ${token('color.border')}`,
  backgroundColor: '#ffffff',
  zIndex: 91,
});

type RootInnerProps = {
  topNavContent: React.ReactNode;
  sideNavContent: React.ReactNode;
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
  footerContent: React.ReactNode;
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
        {state.showSideNav && <SideNav>{props.sideNavContent}</SideNav>}
        <Stack xcss={rightPaneStyles}>
          <Inline>
            <Main>{props.mainContent}</Main>
            {state.showAside && <Aside>{props.asideContent}</Aside>}
          </Inline>
          <div css={footerStyles}>{props.footerContent}</div>
        </Stack>
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
