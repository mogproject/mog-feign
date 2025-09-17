import { Field } from '@atlaskit/form';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { css, Global } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import LabeledTextField from '../forms/LabeledTextField';
import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import { isValidVoiceChannelURL } from '../../models/detail/ChannelSettings';

const DiscordChannels: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.channel' });
  const t = translate as (s: string) => string;

  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <Stack>
      <p>{t('description')}</p>
      <LabeledTextField
        label="URL"
        value={state.channelURL}
        validate={isValidVoiceChannelURL}
        setValue={(v: string) => dispatch((prev) => ({ ...prev, channelURL: v.trim() }))}
        width={540}
        placeholder={t('placeholder')}
        id="discord-channel-url"
        feedback={t('feedback')}
      />
    </Stack>
  );
};

export default DiscordChannels;
