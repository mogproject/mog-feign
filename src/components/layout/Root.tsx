import React from 'react';
import { Global, css } from '@emotion/react';
import { LayoutContextProvider, useLayoutState } from './LayoutContext';
import { Inline, Stack, xcss } from '@atlaskit/primitives';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Main from './Main';
import Aside from './Aside';
import { token } from '@atlaskit/tokens';

const footerStyles = css({
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
      css`
        html,
        body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
      `,
    [state.topNavHeight]
  );
  const rightPaneStyles = React.useMemo(
    () =>
      xcss({
        flex: '1',
        height: '100%',
        minHeight: '0',
        overflow: 'hidden',
      }),
    [state.topNavHeight]
  );
  const scrollContainerStyles = css({
    minHeight: '0',
    scrollPaddingTop: '14px',
    overflowX: 'hidden',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
    contain: 'layout paint', // Workaround for Chrome; prevent repaint when scrolling
  });

  // Special treatment for '/#'
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollTo = () => {
      if ((window.location.hash === '' || window.location.hash === '#') && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0 });
      }
    };

    scrollTo();

    window.addEventListener('hashchange', scrollTo);

    return () => {
      window.removeEventListener('hashchange', scrollTo);
    };
  }, []);

  return (
    <>
      <Global styles={globalScrollStyles} />
      <div>
        <TopNav>{props.topNavContent}</TopNav>
        <Inline
          space="space.0"
          alignBlock="start"
          xcss={xcss({
            minHeight: '0',
            height: `calc(100vh - ${state.topNavHeight + 1}px)`,
            overflow: 'hidden',
          })}
        >
          {state.showSideNav && <SideNav>{props.sideNavContent}</SideNav>}
          <Stack xcss={rightPaneStyles}>
            <div ref={scrollContainerRef} css={scrollContainerStyles}>
              <Inline>
                <Main>{props.mainContent}</Main>
                {state.showAside && <Aside>{props.asideContent}</Aside>}
              </Inline>
              <div css={footerStyles}>{props.footerContent}</div>
            </div>
          </Stack>
        </Inline>
      </div>
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
