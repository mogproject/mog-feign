import React from 'react';

import './styles/discord.css';

import Header from './components/sections/Header';

import { ContextProvider } from './models/ContextProvider';

import LeftSideMenu from './components/sections/LeftSideMenu';
import Root from './components/layout/Root';
import MainContent from './components/sections/MainContent';

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Root
        defaultTopNavHeight={40}
        defaultSideNavWidth={232}
        defaultSideNavExpanded={true}
        defaultAsideWidth={160}
        topNavContent={<Header />}
        sideNavContent={<LeftSideMenu />}
        mainContent={<MainContent />}
        asideContent={<div>Aside!</div>}
      />
    </ContextProvider>
  );
};
export default App;
