import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Text, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import DiscordUsers from './DiscordUsers';
import SaveLoad from './SaveLoad';
import DiscordChannels from './DiscordChannels';
import FeignPlayers from './FeignPlayers';
import Preview from './Preview';
import ViewSettingsPane from './ViewSettingsPane';
import OBSSettings from './OBSSettings';

const containerStyles = xcss({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1200px',
  marginInline: 'auto', // centering
  paddingInline: 'space.200', // left & right padding
  paddingBlockStart: 'space.100',
  paddingBlockEnd: 'space.300',
});

const headingStyles = xcss({
  paddingTop: 'space.300',
  marginTop: 'space.500',
  marginBottom: 'space.200',
});

const MainContent: React.FC = () => {
  // Translations.
  const { t: translate } = useTranslation();
  const t = translate as (s: string) => string;

  return (
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
      <Box xcss={headingStyles}>
        <Heading id="channels" size="medium">
          {t('settings.discord_voice_channel')}
        </Heading>
      </Box>
      <DiscordChannels />
      <Box xcss={headingStyles}>
        <Heading id="users" size="medium">
          {t('settings.discord_user_management')}
        </Heading>
      </Box>
      <DiscordUsers />
      <Box xcss={headingStyles}>
        <Heading id="players" size="medium">
          {t('settings.feign_player_settings')}
        </Heading>
      </Box>
      <FeignPlayers />
      <Box xcss={headingStyles}>
        <Heading id="overlay" size="medium">
          {t('settings.overlay_settings')}
        </Heading>
      </Box>
      <ViewSettingsPane />
      <Box xcss={headingStyles}>
        <Heading id="preview" size="large">
          {t('preview.preview')}
        </Heading>
      </Box>
      <Preview />
      <Box xcss={headingStyles}>
        <Heading id="obs" size="large">
          {t('obs.obs_settings')}
        </Heading>
      </Box>
      <OBSSettings />
    </Box>
  );
};

export default MainContent;
