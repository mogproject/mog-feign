import React from 'react';

import Header from './components/sections/Header';

import { ContextProvider } from './models/ContextProvider';

import LeftSideMenu from './components/sections/LeftSideMenu';
import Root from './components/layout/Root';
import MainContent from './components/sections/MainContent';

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Root
        defaultTopNavHeight={49}
        defaultSideNavWidth={200}
        defaultSideNavExpanded={true}
        defaultAsideWidth={240}
        topNavContent={<Header />}
        sideNavContent={<LeftSideMenu />}
        mainContent={<MainContent />}
        asideContent={<div>Aside!</div>}
      />
    </ContextProvider>
  );
};
export default App;
