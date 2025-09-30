import React from 'react';

import './styles/discord.css';

import Header from './components/sections/Header';

import { ContextProvider } from './models/ContextProvider';

import LeftSideMenu from './components/sections/LeftSideMenu';
import Root from './components/layout/Root';
import MainContent from './components/sections/MainContent';
import Footer from './components/sections/Footer';
import QuickMenu from './components/sections/QuickMenu';

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Root
        defaultTopNavHeight={40}
        defaultSideNavWidth={148}
        defaultSideNavExpanded={true}
        defaultAsideWidth={300}
        topNavContent={<Header />}
        sideNavContent={<LeftSideMenu />}
        mainContent={<MainContent />}
        asideContent={<QuickMenu />}
        footerContent={<Footer />}
      />
    </ContextProvider>
  );
};
export default App;
