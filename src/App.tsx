import React from 'react';
import { Box, Text, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import { useTranslation } from 'react-i18next';
import Header from './components/sections/Header';
import DiscordUsers from './components/sections/DiscordUsers';
import { ContextProvider } from './models/ContextProvider';
import SaveLoad from './components/sections/SaveLoad';

const containerStyles = xcss({
  maxWidth: '1200px',
  marginInline: 'auto', // centering
  paddingInline: 'space.200', // left & right padding
});

const headingStyles = xcss({
  paddingTop: 'space.200',
});

const App: React.FC = () => {
  // Translations.
  const { t: translate } = useTranslation();
  const t = translate as (s: string) => string;

  return (
    <ContextProvider>
      {/*=====================================================================
             HEADER
         ====================================================================*/}
      <Header />

      {/*=====================================================================
             MAIN PANE
         ====================================================================*/}
      <Box xcss={containerStyles}>
        <Box>
          <Text size="small">{t('features.part1')}</Text>
        </Box>
        {/*--------------------------------------------------------------------
             Features
         --------------------------------------------------------------------*/}
        <Box xcss={headingStyles}>
          <Heading id="features" size="large">
            {t('features.features')}
          </Heading>
          <ul>
            <li>{t('features.part2')}</li>
            <li>{t('features.part3')}</li>
            <li>{t('features.part4')}</li>
          </ul>
        </Box>

        {/*--------------------------------------------------------------------
             Settings
         --------------------------------------------------------------------*/}
        <Box xcss={headingStyles}>
          <Heading id="settings" size="large">
            {t('settings.settings')}
          </Heading>
        </Box>
        {/* ---- Save / Load ----*/}
        <SaveLoad />

        <DiscordUsers />
      </Box>
    </ContextProvider>
  );
};
export default App;
