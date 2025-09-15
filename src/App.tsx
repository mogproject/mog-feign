import React from 'react';

import Header from './components/sections/Header';

import { ContextProvider } from './models/ContextProvider';

import LeftSideMenu from './components/sections/LeftSideMenu';
import Root from './components/layout/Root';
import TopNav from './components/layout/TopNav';
import SideNav from './components/layout/SideNav';
import Main from './components/layout/Main';
import MainContent from './components/sections/MainContent';

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Root defaultSideNavWidth={200} defaultSideNavExpanded={true} defaultAsideWidth={240}>
        {/*=====================================================================
             TOP NAV
         ====================================================================*/}
        <TopNav>
          <Header />
        </TopNav>
        {/*=====================================================================
             SIDE NAV
         ====================================================================*/}
        <SideNav>
          <LeftSideMenu />
        </SideNav>
        {/*=====================================================================
             MAIN PANE
         ====================================================================*/}
        <Main>
          <MainContent />
        </Main>
      </Root>
    </ContextProvider>
  );
};
export default App;
