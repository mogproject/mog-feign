import React from 'react';
import { useTranslation } from 'react-i18next';

import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { LinkButton } from '@atlaskit/button/new';

const containerStyles = xcss({
  padding: 'space.200',
  height: '100%',
  backgroundColor: 'color.background.neutral',
});

const LeftSideMenu: React.FC = () => {
  const { t: translate, i18n } = useTranslation();
  const t = translate as (s: string) => string;

  function createLink(label: string, href: string, indented: boolean) {
    return (
      <Inline xcss={indented ? xcss({ marginLeft: 'space.200' }) : {}}>
        <LinkButton appearance="subtle" href={href} shouldFitContainer={true}>
          <Inline alignInline={'start'}>
            <Text align="start" size={indented ? 'small' : 'medium'}>
              {label}
            </Text>
          </Inline>
        </LinkButton>
      </Inline>
    );
  }

  return React.useMemo(() => {
    return (
      <Stack xcss={containerStyles}>
        {createLink(t('home'), '#', false)}
        {createLink(t('features.features'), '#features', false)}
        {createLink(t('settings.settings'), '#settings', false)}
        {createLink(t('settings.discord_voice_channel'), '#channels', true)}
        {createLink(t('settings.discord_user_management'), '#users', true)}
        {createLink(t('settings.feign_player_settings'), '#players', true)}
        {createLink(t('settings.overlay_settings'), '#overlay', true)}
        {createLink(t('preview.preview'), '#preview', false)}
        {createLink(t('obs.obs_settings'), '#obs', false)}
      </Stack>
    );
  }, [i18n.resolvedLanguage]);
};

export default LeftSideMenu;
