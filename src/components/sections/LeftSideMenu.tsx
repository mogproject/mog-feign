import React from 'react';
import { useTranslation } from 'react-i18next';

import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { LinkButton } from '@atlaskit/button/new';

const containerStyles = xcss({
  padding: 'space.200',
});

const LeftSideMenu: React.FC = () => {
  const { t: translate } = useTranslation();
  const t = translate as (s: string) => string;

  return (
    <Stack xcss={containerStyles} alignInline={'start'}>
      <LinkButton appearance="subtle" href="#">
        {t('home')}
      </LinkButton>

      <LinkButton appearance="subtle" href="#features">
        {t('features.features')}
      </LinkButton>

      <LinkButton appearance="subtle" href="#settings">
        {t('settings.settings')}
      </LinkButton>

      <Inline xcss={xcss({ marginLeft: 'space.200' })}>
        <LinkButton appearance="subtle" href="#channels">
          <Text size="small">{t('settings.discord_voice_channel')}</Text>
        </LinkButton>
      </Inline>
      <Inline xcss={xcss({ marginLeft: 'space.200' })}>
        <LinkButton appearance="subtle" href="#users">
          <Text size="small">{t('settings.discord_user_management')}</Text>
        </LinkButton>
      </Inline>
      <Inline xcss={xcss({ marginLeft: 'space.200' })}>
        <LinkButton appearance="subtle" href="#players">
          <Text size="small">{t('settings.feign_player_settings')}</Text>
        </LinkButton>
      </Inline>
      <Inline xcss={xcss({ marginLeft: 'space.200' })}>
        <LinkButton appearance="subtle" href="#overlay">
          <Text size="small">{t('settings.overlay_settings')}</Text>
        </LinkButton>
      </Inline>

      <LinkButton appearance="subtle" href="#preview">
        {t('preview.preview')}
      </LinkButton>

      <LinkButton appearance="subtle" href="#obs">
        {t('obs.obs_settings')}
      </LinkButton>
    </Stack>
  );
};

export default LeftSideMenu;
