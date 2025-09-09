import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import DiscordUsers from './components/sections/DiscordUsers';
import { ContextProvider } from './models/ContextProvider';

const App: React.FC = () => {
  // Translations.
  const { t: translate } = useTranslation();
  const t = translate as (s: string) => string;

  return (
    <ContextProvider>
      <Header />
      <DiscordUsers />
    </ContextProvider>
  );
};
export default App;
