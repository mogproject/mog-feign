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
import Accordion from '../accordion/Accordion';
import AccordionItem from '../accordion/AccordionItem';

const containerStyles = xcss({
  // maxWidth: '1200px',
  // marginInline: 'auto', // centering
  margin: 'space.0',
  paddingInline: 'space.200', // left & right padding
  paddingBlockStart: 'space.100',
  paddingBlockEnd: 'space.300',
});

const headingStyles = xcss({
  paddingTop: 'space.200',
  marginTop: 'space.200',
  marginBottom: 'space.200',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  borderTopColor: 'color.border',
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

      {/* ---- Accordion ----*/}
      <Accordion>
        <AccordionItem
          header={
            <Heading id="channels" size="small">
              {t('settings.discord_voice_channel')}
            </Heading>
          }
          body={<DiscordChannels />}
        />
        <AccordionItem
          header={
            <Heading id="users" size="small">
              {t('settings.discord_user_management')}
            </Heading>
          }
          body={<DiscordUsers />}
        />
        <AccordionItem
          header={
            <Heading id="players" size="small">
              {t('settings.feign_player_settings')}
            </Heading>
          }
          body={<FeignPlayers />}
        />
        <AccordionItem
          isLast
          header={
            <Heading id="overlay" size="small">
              {t('settings.overlay_settings')}
            </Heading>
          }
          body={<ViewSettingsPane />}
        />
      </Accordion>

      {/* ---- Preview ----*/}
      <Box xcss={headingStyles}>
        <Heading id="preview" size="large">
          {t('preview.preview')}
        </Heading>
      </Box>
      <Preview />

      {/* ---- OBS Settings ----*/}
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
